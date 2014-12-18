/*
 * File         :   main.js
 * Description  :   Main entry point for essencejs library.
 * ------------------------------------------------------------------------------------------------ */

(function () {
    var defaultConfig = require("./config.js"),
        parser = require("./parser.js"),
        util = require("./util.js"),

        registrations = {};

    /**
     * Method for tidying up any references and disposing of essencejs.
     */
    function dispose() {
        registrations = {};
    }

    /**
     * Resolve the array of string name arguments
     * @param {string[]} args Array of arguments to resolve.
     * @param {number} timeout Number of milliseconds to complete the resolving of all arguments before timing out.
     * @param {object} overrides Override any defined entries using this custom object.
     * @param {function} callback Callback method once all arguments have been resolved, or a timeout has occurred.
     *  Callback parameters are error (if there is one) and resolved - array of resolutions relative to the given args.
     */
    function resolveArgs(args, timeout, overrides, callback) {
        overrides = overrides || {};
        timeout = (typeof timeout !== "undefined") && timeout !== null ? timeout : defaultConfig.timeout;

        var watch = setTimeout(function () {
                var debugMapped =  { };
                args.forEach(function (arg, i) {
                    debugMapped[arg] = !!mapped[i];
                });

                callback && callback("Timed out", debugMapped);
                callback = null;
            }, timeout),
            notifiedError = false,
            mapped = [];

        args.map(function (arg, i) {
            var registration = registrations[arg];

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
                clearTimeout(watch);

                callback && callback(null, mapped);
                callback = null;
            }

            function notifyIfError(err) {
                if (notifiedError) {
                    return;
                }

                notifiedError = true;

                // has errored. clear timeout.
                clearTimeout(watch);

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

            if (!registration) {
                // no registration currently exists. create a temporary one for holding waitFors.
                registrations[arg] = {
                    name : arg,
                    isPlaceholder : true,
                    waitFors : []
                };

                registration = registrations[arg]
            }

            if (registration.isPlaceholder) {
                // a placeholder registration exists for this key. add to waitFors queue.
                var waitForTimeout,
                    waitFor = function deferredResolveCallback(err, value) {
                        clearTimeout(waitForTimeout);

                        if (err) {
                            // error resolving this argument.
                            notifyIfError(err);
                        } else {
                            mapped[i] = value;
                            notifyIfComplete();
                        }
                    };

                waitForTimeout = setTimeout(function () {
                    registration.waitFors.splice(registration.waitFors.indexOf(waitFor), 1);
                }, timeout);

                registration.waitFors.push(waitFor);
            } else {
                // some kind of registration already exists for this.
                registration.get(function (err, value) {
                    if (err) {
                        notifyIfError(err);
                        return;
                    }

                    if (value && !registration.isPlaceholder) {
                        // successfully retrieved the item from the registrations.
                        mapped[i] = value;

                        notifyIfComplete();

                        return;
                    }
                });
            }
        });
    }

    /**
     * Invoke the function with the given arguments against the context provided. The result of executing the
     *  function is passed back as the second parameter in the callback method.
     * @param {function} func Function to execute.
     * @param {Array} resolvedArgs Array of arguments that have been resolved for the function.
     * @param {object} [context] Context to apply to the execution of the function. Default null.
     * @param {function} callback Callback function to return the result of invoking the function.
     */
    function invoke(func, resolvedArgs, context, callback) {
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
    }

    /**
     * Register an object by a given injectable name.
     * @param {object|string} itemOrKey Item to register, or key - requires 2 parameters. If single parameter then the key
     *    will be determined from the object e.g. constructor.name.
     * @param {object} item to be registered against the key given. Only used if first parameter @param itemOrKey is a string.
     */
    function register(itemOrKey, item) {
        var key = itemOrKey;

        if (arguments.length === 1) {
            // single argument specified, calculate key.
            if (typeof itemOrKey === "function") {
                key = itemOrKey.name;
            } else {
                throw "No key specified for object type " +
                    typeof itemOrKey +
                    ". Unable to determine a suitable key."
            }

            item = itemOrKey;
        }

        if (!item) {
            if (registrations[key] && registrations[key].isPlaceholder) {
                // cancel any waitFors callbacks.
                registrations[key].waitFors.forEach(function (waitFor) {
                    waitFor("Cancelled");
                });
            }

            delete registrations[key];
        } else {
            var placeholderRegistration = registrations[key] && registrations[key].isPlaceholder ?
                registrations[key] : null;

            registrations[key] = {
                /**
                 * @prop {string} name of the registration.
                 */
                name : key,

                /**
                 * @returns {Object} return exactly what was put into the registration.
                 */
                get : function (callback) {
                    if (typeof item === "function" && item.name === "__essencejs_container") {
                        // item is a container that needs to be executed to get the value to inject.
                        // execute the function and pass to the callback the result.
                        item(callback);
                    } else {
                        // return what was stored for this registration.
                        callback(null, item);
                    }
                },

                /**
                 * @prop indicates that this registration is registered.
                 */
                isPlaceholder : false,

                /**
                 * @prop waitFors listeners to be executed when this registration is registered
                 */
                waitFors : []
            };

            if (placeholderRegistration) {
                // notify any waitFors in the placeholder registration
                placeholderRegistration.waitFors.forEach(function (waitFor) {
                    registrations[key].get(waitFor);
                });

                placeholderRegistration = null;
            }
        }
    }

    /**
     * Check if an item is registered.
     * @param {string} key Key to lookup the item by.
     * @returns {boolean} True if there is a item registered.
     */
    function isRegistered(key) {
        return !!registrations[key];
    }

    /**
     * Register a single instance (singleton) of an object that can be instantiated.
     * @param {object|string} itemOrKey Singleton to register, or key - requires 2 parameters. If single parameter then the key
     *    will be determined from the object e.g. constructor.name.
     * @param {object} [item] to be registered against the key given. Only used if first parameter @param itemOrKey is a string.
     */
    function singleton(itemOrKey, item) {
        var key = itemOrKey,
            instance;

        if (arguments.length === 1) {
            // single argument specified, calculate key.
            if (typeof itemOrKey === "function") {
                key = itemOrKey.name;
            } else {
                throw "No key specified for object type " +
                typeof itemOrKey +
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
            register(key, function __essencejs_container(callback) {
                if (error || instance) {
                    callback(error, instance);
                } else {
                    inject(item, null, function (err, value) {
                        error = err;
                        instance = value;
                        callback(error, instance);
                    });
                }
            });
        }());
    }

    /**
     * Register a factory to create new instances of an object that can be instantiated.
     */
    function factory() {

    }

    /**
     * Take a given function and as soon as all its parameters can be resolved, execute that function.
     * @param {(function|Array)} func function to be called, or constructor to be instantiated once all functional
     *        parameters can be resolved.
     * @param {Object|function} [config] configuration object to override default behaviours, or callback if function.
     * @param {function} [callback] function to call when inject method completes or timeouts.
     */
    function inject(func, config, callback) {
        var args = parser.getArgs(func),
            context = func,
            timeout = defaultConfig.timeout;

        if (arguments.length === 2) {
            if (typeof config === "function") {
                // config is the callback function. remap.
                callback = config;
                config = null;
            }
        }

        timeout = config && typeof config.timeout !== "undefined" ? config.timeout : timeout;
        context = config && config.context ? config.context : context;

        if (Array.isArray(func)) {
            // the function is an array where the last argument of the array is the function to inject into.
            func = func[func.length - 1];
        }

        if (args.length === 0) {
            // function does not have any arguments that need resolving. Execute immediately.
            invoke(func, args, context, callback);

            return;
        }

        // resolve the arguments and wait for the callback.
        resolveArgs(args, timeout, null, function (err, resolvedArgs) {
            if (err) {
                callback(err);
                return;
            }

            invoke(func, resolvedArgs, context, callback);
        });
    }

    module.exports = {
        config : defaultConfig,
        dispose : dispose,
        isRegistered : isRegistered,
        register : register,
        resolveArgs : resolveArgs,
        singleton : singleton,
        factory : factory,
        inject : inject
    };
}());
