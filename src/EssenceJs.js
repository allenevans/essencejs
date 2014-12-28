/*
 * File         :   EssenceJs.js
 * Description  :   Main entry point for essencejs library.
 * ------------------------------------------------------------------------------------------------ */
var clone = require("clone"),
    glob = require("glob").Glob,
    parser = require("./parser"),
    path = require("path"),
    util = require("./util"),
    CancelError = require("./CancelError"),
    Config = require("./Config"),
    Registration = require("./Registration"),
    Resolvable = require("./Resolvable"),
    ResolveError = require("./ResolveError"),
    WaitFor = require("./WaitFor");

/**
 * EssenceJs class constructor.
 * @constructor
 */
var EssenceJs = function EssenceJs() {
    /**
     * EssenceJs configuration.
     * @type {Config}
     */
    this.config = new Config();

    /**
     * Dependency registration storage.
     * @type {Registration}
     */
    this.registrations = new Registration();

    /**
     * Array of active timers.
     * @type {Array}
     * @private
     */
    this._timers = [];


    // register this instance as $essence.
    this.register("$essence", this);
};

/**
 * clear a timer created by this.setTimeout method.
 * @param {Object} timerRef reference to the created timer.
 */
EssenceJs.prototype.clearTimeout = function (timerRef) {
    var self = this;

    if (self._timers.indexOf(timerRef) >= 0) {
        self._timers.splice(self._timers.indexOf(timerRef), 1);
    }
    clearTimeout(timerRef);
};

/**
 * Create a timeout with tracking.
 * @param {function} func function to execute when timer interval has been reached.
 * @param {Object} interval number of milliseconds to wait for.
 */
EssenceJs.prototype.setTimeout = function (func, interval) {
    var self = this,
        timerRef = setTimeout(function () {
            self.clearTimeout(timerRef);
            func();
        }, interval);

    self._timers.push(timerRef);

    return timerRef;
};

/**
 * Method for tidying up any references and disposing of essencejs.
 */
EssenceJs.prototype.dispose = function dispose() {
    var self = this,
        method,
        timers = self._timers;

    if (self._timers && self._timers.length) {
        timers.forEach(function (timer) {
            self.clearTimeout(timer);
        });
    }

    self.registrations && self.registrations.dispose();
    delete self.registrations;

    for (method in self) {
        if (!self.hasOwnProperty(method) &&
            typeof self[method] === "function" &&
            ["clearTimeout"].indexOf(method) < 0
        ) {
            self[method] = function () {
                throw "Instance disposed.";
            }
        }
    }

    self.isDisposed = function () { return true; };
};

/**
 * Register a factory that will invoke, clone or construct new instances of the function / object as required.
 * @param {object|string|function} itemOrKey Factory to register, or key - requires 2 parameters. If single parameter then the key
 *    will be determined from the object e.g. constructor.name.
 * @param {object|factory} [item] to be registered against the key given. Only used if first parameter @param itemOrKey is a string.
 * @param {object} [overrides] Custom object to override registered dependencies.
 */
EssenceJs.prototype.factory = function factory(itemOrKey, item, overrides) {
    var self = this,
        key = itemOrKey,
        instance;

    if (arguments.length === 1) {
        // single argument specified, calculate key.
        if (typeof itemOrKey === "function") {
            key = itemOrKey.name;
        } else {
            throw "No key specified for object type " + typeof itemOrKey +
            ". Unable to determine a suitable key."
        }

        item = itemOrKey;

        if (item === undefined) {
            throw "Cannot create a singleton instance for an undefined item.";
        }
    }

    (function () {
        var error;

        // if object being registered is a class then convert the key into the lowerCaseFirst naming convention
        // because object will be an instance of the class being registered.
        key = util.isObjectConstructor(item) ? util.lowerCaseFirst(key) : key;

        // register a container against the key to resolve the single instance of the item.
        self.register(key, function __essencejs_container(config, callback) {
            if (error) {
                callback(error);
            } else {
                // if item is an object and not a function, then create a cloned instance of this object.
                if (typeof item === "object") {
                    callback(null, clone(item));
                } else {
                    if (overrides) {
                        config = config || {};
                        config.overrides = overrides;
                    }

                    // inject into the function.
                    self.inject(item, config, function (err, value) {
                        error = err;
                        callback(error, value);
                    });
                }
            }
        });
    }());
};

/**
 * Get the list of registration key names.
 * @returns {string[]}
 */
EssenceJs.prototype.getKeys = function getKeys() {
    return (this.registrations && this.registrations.keys) || [];
};

/**
 * @callback EssenceJs~injectCallback function to execute containing any errors, and the result.
 * @param {object|string} error Object or string that contains the error that occurred.
 * @param {object} result The result of the injected function.
 * @param {?object} [overrides] Custom object to override registered dependencies.
 */

/**
 * Take a given function and as soon as all its parameters can be resolved, execute that function.
 * @param {(function|Array)} func function to be called, or constructor to be instantiated once all functional
 *        parameters can be resolved.
 * @param {?Object|function} [config] configuration object to override default behaviours, or callback if function.
 * @param {EssenceJs~injectCallback} [callback] function to call when inject method completes or timeouts.
 */
EssenceJs.prototype.inject = function inject(func, config, callback) {
    var self = this,
        args = parser.getArgs(func),
        context = func,
        timeout = this.config.timeout,
        overrides;

    if (arguments.length === 2 && typeof config === "function") {
        // config is the callback function. remap.
        callback = config;
        config = null;
    }

    timeout = config && typeof config.timeout !== "undefined" ? config.timeout : timeout;
    context = config && config.context ? config.context : context;
    overrides = (config && config.overrides) || null;

    if (Array.isArray(func)) {
        // the function is an array where the last argument of the array is the function to inject into.
        func = func[func.length - 1];
    }

    if (args.length === 0) {
        // function does not have any arguments that need resolving. Execute immediately.
        self.invoke(func, args, context, callback);

        return;
    }

    // resolve the arguments and wait for the callback.
    self.resolveArgs(args, timeout, overrides, function (err, resolvedArgs) {
        if (err) {
            callback && callback(err);
            return;
        }

        self.invoke(func, resolvedArgs, context, callback);
    }, config && config.resolveStack);
};

/**
 * @callback EssenceJs~invokeCallback Callback function to execute containing any errors, and the result.
 * @param {object|string} error Object or string that contains the error that occurred.
 * @param {object} result The result of the invoked function.
 */

/**
 * Invoke the function with the given arguments against the context provided. The result of executing the
 *  function is passed back as the second parameter in the callback method.
 * @param {function} func Function to execute.
 * @param {string[]} resolvedArgs Array of arguments that have been resolved for the function.
 * @param {?object} [context] Context to apply to the execution of the function. Default null.
 * @param {EssenceJs~invokeCallback} callback Callback function to return the result of invoking the function.
 */
EssenceJs.prototype.invoke = function invoke(func, resolvedArgs, context, callback) {
    if (util.isObjectConstructor(func)) {
        try {
            // success callback passing the instantiated object as the result.
            callback.call(null, null, util.instantiateObject(func, resolvedArgs));
        } catch (x) {
            // callback with error.
            callback.call(null, x);
        }
    } else {
        var result = func.apply(context, resolvedArgs);

        if (callback) {
            // success callback passing the result of applying the function.
            callback.call(null, null, result);
        }
    }
};

/**
 * Check if this essence js instance have been disposed of.
 * @returns {boolean} True if this essence js container is in the disposed state and no longer usable.
 */
EssenceJs.prototype.isDisposed = function isDisposed() {
    return false;
};

/**
 * Check if an item is registered.
 * @param {string} key Key to lookup the item by.
 * @returns {boolean} True if there is a item registered.
 */
EssenceJs.prototype.isRegistered = function isRegistered(key) {
    return !!this.registrations.get(key);
};

/**
 * Register an object by a given injectable name.
 * @param {object|string} itemOrKey Item to register, or key - requires 2 parameters. If single parameter then the key
 *    will be determined from the object e.g. constructor.name.
 * @param {object} [item] to be registered against the key given. Only used if first parameter @param itemOrKey is a string.
 */
EssenceJs.prototype.register = function register(itemOrKey, item) {
    var self = this,
        key = itemOrKey,
        resolvable;

    if (arguments.length === 1) {
        // single argument specified, calculate key.
        if (typeof itemOrKey === "function") {
            key = itemOrKey.name;
        } else {
            throw "No key specified for object type " + typeof itemOrKey +
            ". Unable to determine a suitable key."
        }

        item = itemOrKey;
    }

    resolvable = self.registrations.get(key);

    if (!item) {
        if (resolvable && resolvable.isPlaceholder) {
            // cancel any waitFors callbacks.
            self.registrations.get(key).waitFors.forEach(function (waitFor) {
                waitFor.callback(new CancelError());
            });
        }

        self.registrations && self.registrations.remove(key);
    } else {
        var placeholderResolvable = resolvable && resolvable.isPlaceholder ?
            resolvable : null;

        self.registrations.add(new Resolvable({
            name: key,
            item: item
        }));

        if (placeholderResolvable) {
            // notify any waitFors in the placeholder registration
            placeholderResolvable.waitFors && placeholderResolvable.waitFors.forEach(function (waitFor) {
                var resolvable = self.registrations.get(key);
                resolvable.get(null, waitFor.callback);
            });

            placeholderResolvable = null;
        }
    }
};

/**
 * @callback EssenceJs~registeredCallback Callback function to execute containing any errors, and the file names matching
 * the given pattern.
 * @param {object|string} error Object or string that contains the error that occurred.
 * @param {string[]} matches Files matching the pattern.
 */

/**
 * @callback EssenceJs~strategyCallback Callback function executing within the context of this essence js instance.
 * Its purpose is to allow tailoring of the path file registrations within essence js e.g. register, .siory, singleton.
 * @param {string} path File path to module to be required and registered with the essence.js instance.
 */

/**
 * Register all exported objects from files matching the specified pattern with this essence.js instance using the given strategy.
 * @param {string|string[]} pattern Pattern to search for
 * @param {?EssenceJs~strategyCallback} [strategy] Function that determines how the required file is registered with the essence js instance.
 * Default is to register exactly what was exported.
 * @param {?Object} [options] Options object for glob.
 * @param {?EssenceJs~registeredCallback} [callback] function containing any errors and files matched.
 */
EssenceJs.prototype.registerByStrategy = function registerByStrategy(pattern, strategy, options, callback) {
    var self = this,
        cwd = (options && options.cwd) || process.cwd();

    strategy = strategy || function defaultStrategy(filePath) {
        this.register(path.basename(filePath, path.extname(filePath)).replace(/\s/g, ""), require(path.join(cwd, filePath)));
    };

    glob(pattern, options, function (err, files) {
        files = files || [];

        if (!err) {
            files.forEach(function (filePath) {
                strategy.call(self, filePath);
            });
        }

        callback && callback(err, files);
    });
};

/**
 * Register all exported objects from files matching the specified pattern with this essence.js instance using the register exact strategy.
 * @param {string|string[]} pattern Pattern to search for.
 * @param {Object|EssenceJs~registeredCallback} [options] Options object for glob, or callback.
 * @param {EssenceJs~registeredCallback} [callback] function containing any errors and files matched.
 */
EssenceJs.prototype.registerPath = function registerByStrategy(pattern, options, callback) {
    if (arguments.length === 2 && typeof options === "function") {
        callback = options;
        options = null;
    }

    var cwd = (options && options.cwd) || process.cwd();

    this.registerByStrategy(pattern, function exactStrategy(filePath) {
        this.register(path.basename(filePath, path.extname(filePath)).replace(/\s/g, ""), require(path.join(cwd, filePath)));
    }, options, callback);
};

/**
 * Register all exported functions as singletons from files matching the specified pattern with this essence.js instance.
 * @param {string|string[]} pattern Pattern to search for
 * @param {Object|EssenceJs~registeredCallback} [options] Options object for glob, or callback.
 * @param {EssenceJs~registeredCallback} [callback] function containing any errors and files matched.
 */
EssenceJs.prototype.registerSingletons = function registerSingletons(pattern, options, callback) {
    if (arguments.length === 2 && typeof options === "function") {
        callback = options;
        options = null;
    }

    var cwd = (options && options.cwd) || process.cwd();

    this.registerByStrategy(pattern, function singletonStrategy(filePath) {
        this.singleton(
            path.basename(filePath, path.extname(filePath)).replace(/\s/g, ""),
            require(path.join(cwd, filePath))
        );
    }, options, callback);
};

/**
 * Register all exported functions as factories from files matching the specified pattern with this essence.js instance.
 * @param {string|string[]} pattern Pattern to search for
 * @param {Object|EssenceJs~registeredCallback} [options] Options object for glob, or callback.
 * @param {EssenceJs~registeredCallback} [callback] function containing any errors and files matched.
 */
EssenceJs.prototype.registerFactories = function registerFactories(pattern, options, callback) {
    if (arguments.length === 2 && typeof options === "function") {
        callback = options;
        options = null;
    }

    var cwd = (options && options.cwd) || process.cwd();

    this.registerByStrategy(pattern, function factoryStrategy(filePath) {
        this.factory(
            path.basename(filePath, path.extname(filePath)).replace(/\s/g, ""),
            require(path.join(cwd, filePath))
        );
    }, options, callback);
};

/**
 * @callback EssenceJs~resolveArgsCallback Callback function to execute containing any errors, and the resolve arguments array.
 * @param {object|string} error Object or string that contains the error that occurred.
 * @param {object[]} result The resolved arguments corresponding to the input args.
 */

/**
 * Resolve the array of string name arguments
 * @param {string[]} args Array of arguments to resolve.
 * @param {number} [timeout] Number of milliseconds to complete the resolving of all arguments before timing out.
 * @param {object} [overrides] Custom object to override registered dependencies.
 * @param {EssenceJs~resolveArgsCallback} callback Callback method once all arguments have been resolved, or a timeout has occurred.
 * @param {string[]} [resolveStack] Recursive resolve stack array holding the initiator of the resolveArgs request.
 * This parameter should only be used internally by EssenceJs.
 * Callback parameters are error (if there is one) and resolved - array of resolutions relative to the given args.
 */
EssenceJs.prototype.resolveArgs = function resolveArgs(args, timeout, overrides, callback, resolveStack) {
    overrides = overrides || {};
    timeout = (typeof timeout !== "undefined") && timeout !== null ? timeout : this.config.timeout;
    resolveStack = resolveStack || [];

    var self = this,
        watch,
        notifiedError = false,
        mapped = [];

    // get the 4th line from the stack trace because this should contain the initiator of the resolveArgs function.
    resolveStack.push(
        "[" +
            args.reduce(function (argStr, arg) {
                if (argStr !== "") { argStr += ", "; }

                var resolvable = self.registrations.get(arg);

                argStr += ((!resolvable || resolvable.isPlaceholder) ? "*" : "") + arg;

                return argStr;
            }, "") +
        "]\n" +
        new Error().stack.toString().split(/\n/)[3].trim());

    watch = self.setTimeout(function () {
        var error = new ResolveError({
            resolveStack : resolveStack
        });

        args.forEach(function (arg, i) {
            if (!mapped[i]) {
                // argument failed to resolve.
                error.unresolved.push(arg);
            }
        });

        callback && callback(error);
        callback = null;
    }, timeout);

    args.map(function (arg, i) {
        var resolvable = self.registrations.get(arg);

        function notifyIfComplete() {
            // check if all items have been resolved, if so call the callback.
            // go through all elements in the mapped array and check for any undefined entries.
            // if undefined entries exist, then the keys are still waiting to be resolved.
            for (var i = 0; i < args.length; i += 1) {
                if (mapped[i] === undefined) {
                    // not complete. do not notify.
                    return;
                }
            }

            // successfully retrieved ALL items to be resolved. Execute the callback.
            self.clearTimeout(watch);

            callback && callback(null, mapped);
            callback = null;
        }

        function notifyIfError(err) {
            if (notifiedError) {
                return;
            }

            notifiedError = true;

            // has errored. clear timeout.
            self.clearTimeout(watch);

            // report error back.
            callback && callback(err, mapped);
            callback = null;
        }

        if (typeof overrides[arg] !== "undefined") {
            // an override has been defined for this registration.
            // use override.
            mapped[i] = overrides[arg];
            notifyIfComplete();

            return;
        }

        if (timeout === -1) {
            // -1 timeout indicates that items should be resolved immediately, or be set to undefined if they
            // cannot be resolved.

            if (resolvable) {
                resolvable.get({ timeout : timeout }, function (err, value) {
                    // ignore errors. value should be set to null if err.
                    if (err) {
                        err = null;
                        value = null;
                    }

                    mapped[i] = value;
                    notifyIfComplete();
                });
            } else {
                mapped[i] = null;
                notifyIfComplete();
            }

            return;
        }

        // get a resolvable, or create one if one does not currently exist.
        if (!resolvable) {
            // no resolvable registration currently exists. create a temporary one for holding waitFors.
            self.registrations.add(new Resolvable({
                name         : arg,
                isPlaceholder: true
            }));
            resolvable = self.registrations.get(arg);
        }

        if (resolvable.isPlaceholder) {
            // a placeholder registration exists for this key. add to waitFors queue.
            var waitForTimeout,
                waitFor = new WaitFor({
                    resolveStack : resolveStack,
                    callback : function deferredResolveCallback(err, value) {
                        self.clearTimeout(waitForTimeout);

                        if (err) {
                            // error resolving this argument.
                            notifyIfError(err);
                        } else {
                            mapped[i] = value;
                            notifyIfComplete();
                        }
                    }});

            waitForTimeout = self.setTimeout(function () {
                resolvable.waitFors &&
                    resolvable.waitFors.splice(resolvable.waitFors.indexOf(waitFor), 1);
            }, timeout);

            resolvable.waitFors.push(waitFor);
        } else {
            // some kind of registration already exists for this.
            resolvable.get({
                timeout : timeout,
                resolveStack : resolveStack
            }, function (err, value) {
                if (err) {
                    notifyIfError(err);
                    return;
                }

                if (value !== undefined && !resolvable.isPlaceholder) {
                    // successfully retrieved the item from the registrations.
                    mapped[i] = value;
                    notifyIfComplete();
                }
            });
        }
    });
};

/**
 * Register a single instance (singleton) of a function that can be instantiated or an object that will be cloned.
 * @param {object|string|function} itemOrKey Singleton to register, or key - requires 2 parameters. If single parameter then the key
 *    will be determined from the object e.g. constructor.name.
 * @param {object|function} [item] to be registered against the key given. Only used if first parameter @param itemOrKey is a string.
 * @param {object} [overrides] Custom object to override registered dependencies.
 */
EssenceJs.prototype.singleton = function singleton(itemOrKey, item, overrides) {
    var self = this,
        key = itemOrKey,
        instance;

    if (arguments.length === 1) {
        // single argument specified, calculate key.
        if (typeof itemOrKey === "function") {
            key = itemOrKey.name;
        } else {
            throw "No key specified for object type " + typeof itemOrKey +
            ". Unable to determine a suitable key."
        }

        item = itemOrKey;

        if (item === undefined) {
            throw "Cannot create a singleton instance for an undefined item.";
        }
    }

    (function () {
        var error,
            instance;

        // if object being registered is a class then convert the key into the lowerCaseFirst naming convention
        // because object will be an instance of the class being registered.
        key = util.isObjectConstructor(item) ? util.lowerCaseFirst(key) : key;

        // register a container against the key to resolve the single instance of the item.
        self.register(key, function __essencejs_container(config, callback) {
            if (error || instance) {
                callback(error, instance);
            } else {
                // if item is an object and not a function, then create a cloned instance of this object.
                if (typeof item === "object") {
                    instance = clone(item);
                    callback(null, instance);
                } else {
                    if (overrides) {
                        config = config || {};
                        config.overrides = overrides;
                    }

                    self.inject(item, config, function (err, value) {
                        error = err;
                        instance = value;
                        callback(error, instance);
                    });
                }
            }
        });
    }());
};

module.exports = EssenceJs;