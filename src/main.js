/*
 * File         :   main.js
 * Description  :   Main entry point for essencejs library.
 * ------------------------------------------------------------------------------------------------ */

var defaultConfig = require("./config.js"),
    parser = require("./parser.js");

/**
 * Method for tidying up any references and disposing of essencejs.
 */
function dispose() { }

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

    // TODO. At the moment we're timing out on everything.
    setTimeout(function () {
        callback("Timed out");
    }, timeout);
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
    var result = func.apply(context, resolvedArgs);

    if (callback) {
        callback.call(null, null, result);
    }
}

/**
 * Register an object by a given injectable name.
 */
function register() {

}

/**
 * Register a single instance (singleton) of an object that can be instantiated.
 */
function singleton() {

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
        timeout = defaultConfig.timeout,
        result;

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
    register : register,
    singleton : singleton,
    factory : factory,
    inject : inject
};
