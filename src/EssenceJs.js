/*
 * File         :   main.js
 * Description  :   Main entry point for essencejs library.
 * ------------------------------------------------------------------------------------------------ */
var parser = require("./parser"),
    util = require("./util"),
    Resolvable = require("./Resolvable"),
    Registration = require("./Registration");

/**
 * EssenceJs class constructor.
 * @constructor
 */
var EssenceJs = function EssenceJs() {
    this.defaultConfig = require("./config");
    this.registrations = new Registration();

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
        if (!self.hasOwnProperty(method) && typeof self[method] === "function") {
            self[method] = function () {
                throw "Instance disposed.";
            }
        }
    }
};

/**
 * Register a factory that will invoke or construct new instances of the function as required.
 * @param {object|string} itemOrKey Factory to register, or key - requires 2 parameters. If single parameter then the key
 *    will be determined from the object e.g. constructor.name.
 * @param {object} [item] to be registered against the key given. Only used if first parameter @param itemOrKey is a string.
 */
EssenceJs.prototype.factory = function factory(itemOrKey, item) {
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
        self.register(key, function __essencejs_container(callback) {
            if (error) {
                callback(error);
            } else {
                self.inject(item, null, function (err, value) {
                    error = err;
                    callback(error, value);
                });
            }
        });
    }());
};

/**
 * @callback EssenceJs~injectCallback function to execute containing any errors, and the result.
 * @param {object|string} error Object or string that contains the error that occurred.
 * @param {object} result The result of the injected function.
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
        timeout = this.defaultConfig.timeout;

    if (arguments.length === 2 && typeof config === "function") {
        // config is the callback function. remap.
        callback = config;
        config = null;
    }

    timeout = config && typeof config.timeout !== "undefined" ? config.timeout : timeout;
    context = config && config.context ? config.context : context;

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
    self.resolveArgs(args, timeout, null, function (err, resolvedArgs) {
        if (err) {
            callback(err);
            return;
        }

        self.invoke(func, resolvedArgs, context, callback);
    });
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
                waitFor("Cancelled");
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
                resolvable.get(waitFor);
            });

            placeholderResolvable = null;
        }
    }
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
 * @param {object} [overrides] Override any defined entries using this custom object.
 * @param {EssenceJs~resolveArgsCallback} callback Callback method once all arguments have been resolved, or a timeout has occurred.
 * Callback parameters are error (if there is one) and resolved - array of resolutions relative to the given args.
 */
EssenceJs.prototype.resolveArgs = function resolveArgs(args, timeout, overrides, callback) {
    overrides = overrides || {};
    timeout = (typeof timeout !== "undefined") && timeout !== null ? timeout : this.defaultConfig.timeout;

    var self = this,
        watch = self.setTimeout(function () {
            var debugMapped = {};
            args.forEach(function (arg, i) {
                debugMapped[arg] = !!mapped[i];
            });

            callback && callback("Timed out", debugMapped);
            callback = null;
        }, timeout),
        notifiedError = false,
        mapped = [];

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

        if (overrides[arg]) {
            // an override has been defined for this registration.
            // use override.
            mapped[i] = overrides[arg];
            notifyIfComplete();

            return;
        }

        if (!resolvable) {
            // no registration currently exists. create a temporary one for holding waitFors.
            self.registrations.add(new Resolvable({
                name         : arg,
                isPlaceholder: true
            }));

            resolvable = self.registrations.get(arg);
        }

        if (resolvable.isPlaceholder) {
            // a placeholder registration exists for this key. add to waitFors queue.
            var waitForTimeout,
                waitFor = function deferredResolveCallback(err, value) {
                    self.clearTimeout(waitForTimeout);

                    if (err) {
                        // error resolving this argument.
                        notifyIfError(err);
                    } else {
                        mapped[i] = value;
                        notifyIfComplete();
                    }
                };

            waitForTimeout = self.setTimeout(function () {
                resolvable.waitFors &&
                    resolvable.waitFors.splice(resolvable.waitFors.indexOf(waitFor), 1);
            }, timeout);

            resolvable.waitFors.push(waitFor);
        } else {
            // some kind of registration already exists for this.
            resolvable.get(function (err, value) {
                if (err) {
                    notifyIfError(err);
                    return;
                }

                if (value && !resolvable.isPlaceholder) {
                    // successfully retrieved the item from the registrations.
                    mapped[i] = value;

                    notifyIfComplete();
                }
            });
        }
    });
};

/**
 * Register a single instance (singleton) of an object that can be instantiated.
 * @param {object|string} itemOrKey Singleton to register, or key - requires 2 parameters. If single parameter then the key
 *    will be determined from the object e.g. constructor.name.
 * @param {object} [item] to be registered against the key given. Only used if first parameter @param itemOrKey is a string.
 */
EssenceJs.prototype.singleton = function singleton(itemOrKey, item) {
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
        self.register(key, function __essencejs_container(callback) {
            if (error || instance) {
                callback(error, instance);
            } else {
                self.inject(item, null, function (err, value) {
                    error = err;
                    instance = value;
                    callback(error, instance);
                });
            }
        });
    }());
};

module.exports = EssenceJs;