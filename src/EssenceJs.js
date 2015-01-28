/*
 * File         :   EssenceJs.js
 * Description  :   Main entry point for essencejs library.
 * ------------------------------------------------------------------------------------------------ */
var async = require("async"),
    clone = require("clone"),
    glob = require("glob").Glob,
    jsonfile = require("jsonfile"),
    parser = require("./parser"),
    path = require("path"),
    util = require("./util"),
    CancelError = require("./CancelError"),
    Config = require("./Config"),
    EventEmitter = require('events').EventEmitter,
    Registration = require("./Registration"),
    Resolvable = require("./Resolvable"),
    ResolveError = require("./ResolveError"),
    WaitFor = require("./WaitFor");

/**
 * EssenceJs class constructor.
 * @constructor
 */
var EssenceJs = function EssenceJs() {
    var self = this;

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

    /**
     * Event emitter.
     * @type {EventEmitter}
     */
    this._emitter = new EventEmitter();

    // register convenience methods can can be injected.
    this.register("$essencejs", this);
    this.register("$factory", function () { return self.factory.apply(self, arguments); });
    this.register("$inject", function () { return self.inject.apply(self, arguments); });
    this.register("$register", function () { return self.register.apply(self, arguments); });
    this.register("$singleton", function () { return self.singleton.apply(self, arguments); });
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
 * @param {number} interval number of milliseconds to wait for.
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
 *
 * @fires EssenceJs#disposing
 */
EssenceJs.prototype.dispose = function dispose() {
    var self = this,
        method,
        timers = self._timers;

    /**
     * EssenceJs instance is in the process of being disposed of event.
     * @event EssenceJs#disposing
     * @type {EssenceJs}
     */
    self._emitter.emit("disposing", self);

    if (self._timers && self._timers.length) {
        timers.forEach(function (timer) {
            self.clearTimeout(timer);
        });
    }

    self.registrations && self.registrations.dispose();
    delete self.registrations;

    self._emitter.removeAllListeners();

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

    self._emitter = null;
    self.isDisposed = function () { return true; };
};

/**
 * Config object passed when registering a factory.
 * @typedef {object} EssenceJs~factoryOptions
 * @prop {string} [namespace] Namespace the factory will be registered in. Set this as an alternative to
 *  specifying the namespace in the key.
 *  @prop {object} [overrides] Custom object to override registered dependencies.
 */

/**
 * Register a factory that will invoke, clone or construct new instances of the function / object as required.
 * @param {object|string|function} itemOrKey Factory to register, or key - requires 2 parameters. If single parameter then the key
 *    will be determined from the object e.g. constructor.name.
 * @param {object|factory} [item] to be registered against the key given. Only used if first parameter @param itemOrKey is a string.
 * @param {EssenceJs~factoryOptions} config Configuration options for factory registration.
 */
EssenceJs.prototype.factory = function factory(itemOrKey, item, config) {
    var self = this,
        key = itemOrKey,
        instance;

    config = config || {};

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
            throw "Cannot create a factory instance for an undefined item.";
        }
    }

    (function () {
        var error,
            namespaceKey = util.splitNamespaceKey(key),
            overrides = config.overrides;

        namespaceKey.namespace = config.namespace || namespaceKey.namespace;

        // if object being registered is a class then convert the key into the lowerCaseFirst naming convention
        // because object will be an instance of the class being registered.
        namespaceKey.key = util.isObjectConstructor(item) ? util.lowerCaseFirst(namespaceKey.key) : namespaceKey.key;

        // register a container against the key to resolve the single instance of the item.
        self.register(namespaceKey.toString(), function __essencejs_container(config, callback) {
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
 * @param {string} [namespace] Filter the keys registered to the given namespace only.
 * @returns {string[]}
 */
EssenceJs.prototype.getKeys = function getKeys(namespace) {
    var keys = (this.registrations && this.registrations.keys) || [];

    if (namespace) {
        return keys.reduce(function (filtered, key) {
            var namespaceKey = util.splitNamespaceKey(key);

            if (namespaceKey.namespace === namespace) {
                filtered.push(namespaceKey.key);
            }

            return filtered;
        }, []);
    }

    return keys;
};

/**
 * Config object passed for importing files from the file system.
 * @typedef {object} EssenceJs~importsOptions
 * @prop {string} [namespace] namespace to register with.
 * @prop {string} [cwd] Current working directory. Defaults to process.cwd().
 */

/**
 * Imports into the container the result from injecting into module exports.
 * @param {string} pattern Pattern to search for.
 * @param {EssenceJs~importsOptions} config Configuration options for importing module export outputs.
 * @param {function} callback
 */
EssenceJs.prototype.imports = function imports(pattern, config, callback) {
    config = config || {};

    var self = this,
        namespacePrefix = config.namespace ? config.namespace + "__" : "";

    config.cwd = config.cwd || process.cwd();

    function normaliseFilePath(filePath) {
        if (filePath.match(/^\./)) {
            filePath = path.join(config.cwd, filePath);
        }

        return filePath;
    }

    function importsStrategy(filePath, callback) {
        var namespaceKey = namespacePrefix + util.variableNameFromFilePath(filePath);
        var required = require(normaliseFilePath(filePath));

        if (typeof required === "function") {
            // required is a function. inject into this function and register the result against the key.
            self.inject(required, function (err, result) {
                if (!err) {
                    self.register(namespaceKey, result);
                }

                callback(err, result);
            });
        } else {
            // required is not a function, therefore register this object against the key.
            self.register(namespaceKey, required);
            callback(null, required);
        }
    }

    self.registerByStrategy(pattern, importsStrategy, {
        cwd : config.cwd
    }, callback);
};

/**
 * Imports into the container the dependencies defined in the package.json file.
 * @param {string} [packageJsonPath] Optional path to the json file to automatically require the dependencies for.
 * Defaults to load the package.json file in the process current working directory.
 * @param {EssenceJs~registerOptions} [config] Optional registration configuration object.
 */
EssenceJs.prototype.importPackageJson = function importPackageJson(packageJsonPath, config) {
    var self = this,
        package;

    packageJsonPath = packageJsonPath || path.join(process.cwd(), "package.json");

    package = jsonfile.readFileSync(packageJsonPath);

    package && package.dependencies &&
        Object.keys(package.dependencies).forEach(function (dependency) {
            self.register(
                dependency.trim().replace(/^(\d)|[^a-zA-Z\d\$\_]/g, "_$1"),
                require(dependency), config);
        });
};

/**
 * Config object passed when injecting into a function.
 * @typedef {object} EssenceJs~injectConfig
 * @prop {?object} [overrides] Custom object to override registered dependencies.
 * @prop {?string[]} [namespaces] String list of namespaces to search in to resolve dependencies. An empty array or
 * falsey value means search in global and all namespaces to resolve the dependency.
 */

/**
 * @callback EssenceJs~injectCallback function to execute containing any errors, and the result.
 * @param {object|string} error Object or string that contains the error that occurred.
 * @param {object} result The result of the injected function.
 */

/**
 * Take a given function and as soon as all its parameters can be resolved, execute that function.
 * @param {(function|Array)} func function to be called, or constructor to be instantiated once all functional
 *        parameters can be resolved.
 * @param {?EssenceJs~injectConfig|function} [config] configuration object to override default behaviours, or callback if function.
 * @param {EssenceJs~injectCallback} [callback] function to call when inject method completes or timeouts.
 */
EssenceJs.prototype.inject = function inject(func, config, callback) {
    var self = this,
        args = parser.getArgs(func),
        context = func,
        timeout = this.config.timeout,
        namespaces,
        overrides;

    if (arguments.length === 2 && typeof config === "function") {
        // config is the callback function. remap.
        callback = config;
        config = null;
    }

    timeout = config && typeof config.timeout !== "undefined" ? config.timeout : timeout;
    context = config && config.context ? config.context : context;
    overrides = (config && config.overrides) || null;
    namespaces = (config && config.namespaces) || null;

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
    self.resolveArgs(args, namespaces, timeout, overrides, function (err, resolvedArgs) {
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
 * @param {?string[]} [namespaces] Namespaces to match against. A null or empty array implies match against any namespace.
 * @returns {boolean} True if there is a item registered.
 */
EssenceJs.prototype.isRegistered = function isRegistered(key, namespaces) {
    return !!this.registrations.get(key, namespaces);
};

/**
 * Add an event listener to be fired every time the event is emitted.
 * @param {string} event name to listen for.
 * @param {function} listener callback function executed when the event is emitted.
 * @returns {EventEmitter} reference to the listener.
 */
EssenceJs.prototype.on = function (event, listener) {
    return this._emitter.on(event, listener);
};

/**
 * Add an event listener to be fired only once when the event is emitted.
 * @param {string} event name to listen for.
 * @param {function} listener callback function executed when the event is emitted.
 * @returns {EventEmitter} reference to the listener.
 */
EssenceJs.prototype.once = function (event, listener) {
    return this._emitter.once(event, listener);
};

/**
 * Config object passed when registering an object.
 * @typedef {object} EssenceJs~registerOptions
 * @prop {string} [namespace] Namespace the object will be registered in. Set this as an alternative to
 *  specifying the namespace in the key.
 */

/**
 * Register an object by a given injectable name.
 * @param {object|string} itemOrKey Item to register, or key - requires 2 parameters. If single parameter then the key
 *    will be determined from the object e.g. constructor.name.
 * @param {object} [item] to be registered against the key given. Only used if first parameter @param itemOrKey is a string.
 * @param {EssenceJs~registerOptions} [config] registration configuration options.
 *
 * @fires EssenceJs#registered
 * @fires EssenceJs#cancelled
 */
EssenceJs.prototype.register = function register(itemOrKey, item, config) {
    var self = this,
        key = itemOrKey,
        resolvable,
        namespaceKey,
        namespace;

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

    namespaceKey = util.splitNamespaceKey(key);
    namespace = (config && config.namespace) || namespaceKey.namespace;
    key = namespaceKey.key;

    resolvable = self.registrations.get(key, [namespace]);

    if (!item) {
        if (resolvable && resolvable.isPlaceholder) {
            // cancel any waitFors callbacks.
            self.registrations.get(key, [namespace]).waitFors.forEach(function (waitFor) {
                var cancelError = new CancelError({
                    message : "Cancelled " + key + "."
                });

                waitFor.callback(cancelError);

                /**
                 * Dependency resolving cancelled event.
                 * @event EssenceJs#cancelled
                 * @type {CancelError}
                 */
                self._emitter && self._emitter.emit("cancelled", cancelError);
            });
        }

        self.registrations && self.registrations.remove(key);
    } else {
        var placeholderResolvable = resolvable && resolvable.isPlaceholder ? resolvable : null,
            newRegistration;

        newRegistration = new Resolvable({
            namespace : namespace,
            key: key,
            item: item
        });

        self.registrations.add(newRegistration);

        /**
         *  A dependency has been registered with this instance of the EssenceJs container event.
         *  @event EssenceJs#registered
         *  @type {Resolvable}
         */
        self._emitter.emit("registered", newRegistration);

        if (placeholderResolvable) {
            // notify any waitFors in the placeholder registration
            placeholderResolvable.waitFors && placeholderResolvable.waitFors.forEach(function (waitFor) {
                var resolvable = self.registrations.get(key, [namespace]);
                resolvable.get(null, waitFor.callback);
            });

            placeholderResolvable = null;
        }
    }
};

/**
 * Synonym for register method.
 * @method EssenceJs#instance
 * @see EssenceJs#register
 */
EssenceJs.prototype.instance = EssenceJs.prototype.register;

/**
 * Returns a list of listeners for the specified event.
 * @param {string} event name of the event.
 */
EssenceJs.prototype.listeners = function listeners(event) {
    return this._emitter.listeners(event);
};

/**
 * @callback EssenceJs~registeredCallback Callback function to execute containing any errors, and the file names matching
 * the given pattern.
 * @param {object|string} error Object or string that contains the error that occurred.
 * @param {string[]} matches Files matching the pattern.
 */

/**
 * @callback EssenceJs~strategyCallback Callback function executing within the context of this essence js instance.
 * Its purpose is to allow tailoring of the path file registrations within essence js e.g. register, .factory, singleton.
 * @param {string} path File path to module to be required and registered with the essence.js instance.
 * @param {function} callback Callback once the strategy has completed function (err, result) { ... }.
 */

/**
 * Config object passed for registering files from the file system.
 * @typedef {Object} EssenceJs~registerByOptions
 * @prop {string} namespace namespace to register with.
 * @prop {string} cwd The current working directory in which to search. Defaults to process.cwd().
 * @prop {string} root The place where patterns starting with / will be mounted onto.
 *  Defaults to path.resolve(options.cwd, "/")
 * @prop {boolean} nosort Don't sort the results.
 * @prop {boolean} sync Perform a synchronous glob search.
 * @prop {boolean} nobrace Do not expand {a,b} and {1..3} brace sets.
 * @prop {boolean} noglobstar Do not match ** against multiple filenames. (Ie, treat it as a normal * instead.)
 * @prop {boolean} noext Do not match +(a|b) "extglob" patterns.
 * @prop {boolean} nodir Do not match directories, only files.
 * @see https://github.com/isaacs/node-glob
 */

/**
 * Register all exported objects from files matching the specified pattern with this essence.js instance using the given strategy.
 * @param {string|string[]} pattern Pattern to search for.
 * @param {?EssenceJs~strategyCallback} [strategy] Function that determines how the required file is registered with the essence js instance.
 * Default is to register exactly what was exported.
 * @param {?EssenceJs~registerByOptions} [options] Options object.
 * @param {?EssenceJs~registeredCallback} [callback] function containing any errors and files matched.
 */
EssenceJs.prototype.registerByStrategy = function registerByStrategy(pattern, strategy, options, callback) {
    var self = this;

    options = options || {};

    strategy = strategy || function defaultStrategy(filePath, callback) {
        var namespaceKey =
                (options && options.namespace ? options.namespace + "__" : "") +
                path.basename(filePath, path.extname(filePath)).replace(/\s/g, ""),
            cwd = (options && options.cwd) || process.cwd();

        this.register(namespaceKey, require(path.join(cwd, filePath)));

        callback(null, filePath);
    };

    // ensure the relative directory name for glob is set. Defaults to process.cwd().
    options.cwd = options.cwd || process.cwd();

    glob(pattern, options, function (err, files) {
        files = files || [];

        if (!err) {
            async.parallel(
                files.map(function (filePath) {
                    return function (callback) {
                        strategy.call(self, filePath, callback);
                    }
                })
            , function done(err, files) {
                callback && callback(err, files);
            });
        }
    });
};

/**
 *
 * @param {string} key Find the registration matching this key and dispose of it and remove from the container.
 * @param {string|string[]} [namespaces] Optional namespace to search in.
 */
EssenceJs.prototype.remove = function remove(key, namespaces) {
    this.registrations.remove(key, namespaces);
};

/**
 * Remove an event listener.
 * @param {string} event name of the event the listener was bound to
 * @param {EventEmitter} listener Emitter reference to remove.
 * @returns {EventEmitter} reference to the event emitter
 */
EssenceJs.prototype.removeListener = function (event, listener) {
    return this._emitter.removeListener(event, listener);
};

/**
 * @callback EssenceJs~resolveArgsCallback Callback function to execute containing any errors, and the resolve arguments array.
 * @param {object|string} error Object or string that contains the error that occurred.
 * @param {object[]} result The resolved arguments corresponding to the input args.
 */

/**
 * Resolve the array of string name arguments
 * @param {string[]} args Array of arguments to resolve.
 * @param {?string[]} [namespaces] String list of namespaces to search in to resolve dependencies. An empty array or
 * falsey value means search in global and all namespaces to resolve the dependency.
 * @param {number} [timeout] Number of milliseconds to complete the resolving of all arguments before timing out.
 * @param {object} [overrides] Custom object to override registered dependencies.
 * @param {EssenceJs~resolveArgsCallback} callback Callback method once all arguments have been resolved, or a timeout has occurred.
 * @param {string[]} [resolveStack] Recursive resolve stack array holding the initiator of the resolveArgs request.
 * This parameter should only be used internally by EssenceJs.
 * Callback parameters are error (if there is one) and resolved - array of resolutions relative to the given args.
 *
 * @fires EssenceJs#resolveError
 * @fires EssenceJs#waiting
 */
EssenceJs.prototype.resolveArgs = function resolveArgs(args, namespaces, timeout, overrides, callback, resolveStack) {
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

                var resolvable;

                try {
                    resolvable = self.registrations.get(arg, namespaces);
                    // * - to indicate that this argument is still being resolved.
                    argStr += ((!resolvable || resolvable.isPlaceholder) ? "*" : "") + arg;
                } catch (x) {
                    // ! - to indicate that this argument cannot be resolved because of a conflict e.g. Ambiguous
                    // matches argument in the list of dependency registrations.
                    argStr += "!" + arg;
                }

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

        /**
         * Error resolving one or more dependencies event.
         * @event EssenceJs#resolveError
         * @type {ResolveError}
         */
        self._emitter && self._emitter.emit("resolveError", error);
    }, timeout);

    args.map(function (arg, i) {
        var namespaceKey = util.splitNamespaceKey(arg),
            resolvable = self.registrations.get(arg, namespaces);

        function notifyIfComplete() {
            // check if all items have been resolved, if so call the callback.
            // go through all elements in the mapped array and check for any undefined entries.
            // if undefined entries exist, then the keys are still waiting to be resolved.
            for (var i = 0; i < args.length; i += 1) {
                if (mapped[i] === undefined) {
                    // not complete. do not notify waitFors.

                    /**
                     * EssenceJs instance is waiting for this argument to be defined.
                     * @event EssenceJs#waiting
                     * @type {EssenceJs}
                     */
                    self._emitter.emit("waiting", args[i]);

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
                namespace   : namespaceKey.namespace,
                key         : namespaceKey.key,
                isPlaceholder: true
            }));
            resolvable = self.registrations.get(arg, [namespaceKey.namespace]);
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

            /**
             * EssenceJs instance is waiting for this argument to be defined.
             * @event EssenceJs#waiting
             * @type {EssenceJs}
             */
            self._emitter.emit("waiting", resolvable.key);

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
 * Config object passed when registering a singleton.
 * @typedef {object} EssenceJs~singletonOptions
 * @prop {string} [namespace] Namespace the singleton will be registered in. Set this as an alternative to
 *  specifying the namespace in the key.
 *  @prop {object} [overrides] Custom object to override registered dependencies.
 */

/**
 * Register a single instance (singleton) of a function that can be instantiated or an object that will be cloned.
 * @param {object|string|function} itemOrKey Singleton to register, or key - requires 2 parameters. If single parameter then the key
 *    will be determined from the object e.g. constructor.name.
 * @param {object|function} [item] to be registered against the key given. Only used if first parameter @param itemOrKey is a string.
 * @param {EssenceJs~singletonOptions} config Configuration options for singleton registration.
 */
EssenceJs.prototype.singleton = function singleton(itemOrKey, item, config) {
    var self = this,
        key = itemOrKey,
        instance;

    config = config || {};

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
            instance,
            namespaceKey = util.splitNamespaceKey(key),
            overrides = config.overrides;

        namespaceKey.namespace = config.namespace || namespaceKey.namespace;

        // if object being registered is a class then convert the key into the lowerCaseFirst naming convention
        // because object will be an instance of the class being registered.
        namespaceKey.key = util.isObjectConstructor(item) ? util.lowerCaseFirst(namespaceKey.key) : namespaceKey.key;

        // register a container against the key to resolve the single instance of the item.
        self.register(namespaceKey.toString(), function __essencejs_container(config, callback) {
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