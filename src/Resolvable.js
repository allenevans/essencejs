/*
 * File         :   Resolvable.js
 * Description  :   Resolvable dependency container.
 * ------------------------------------------------------------------------------------------------ */

/**
 * Resolvable constructor initialisation parameters.
 * @typedef {Object} Resolvable~Params
 * @prop {string} namespace Namespace the argument is registered in.
 * @prop {string} key Name of the resolvable argument.
 * @prop {boolean} isPlaceholder Is placeholder flag.
 * @prop {string[]} waitFors String list of things needed to be resolved.
 * @prop {Object} item Item stored within the resolvable.
 */

/**
 * Resolvable classes contain information about the dependency that is to be resolved.
 * @param {Resolvable~Params} params Object for setting instance properties during instantiation.
 * @constructor
 */
var Resolvable = function Resolvable(params) {
    /**
     * Namespace the resolvable is assigned to.
     * @type {string}
     */
    this.namespace = params && params.namespace;

    /**
     * Name of the resolvable argument.
     * @type {string}
     */
    this.key = params && params.key;

    /**
     * Flag to indicate that this resolvable is a temporary placeholder that will be replaced once the
     * actual resolvable item can be resolved.
     * @type {!boolean}
     */
    this.isPlaceholder = (params && params.isPlaceholder) || false;

    /**
     * A function list of callbacks that are waiting on this thing to resolve.
     * @type {WaitFor[]}
     */
    this.waitFors = (params && params.waitFors) || [];

    /**
     * Item that is being stored in this resolvable.
     * @type {Object}
     */
    this.item = params && params.item;
};

/**
 * @callback Resolvable~getCallback function to execute that will return the contents of the item.
 * @param {object} error error
 * @param {object} item resolved item
 */

/**
 * Config object passed through to the get command for the resolvable.
 * @typedef {Object} Resolvable~getConfig
 * @prop {number} timeout number of milliseconds that a get command has for execution.
 * @prop {string[]} resolveStack stack of calls that require arguments to be resolved.
 */

/**
 * Get the resolvable item.
 * @param {?Resolvable~getConfig|Object} config Configuration object passed through into the get.
 * @param {Resolvable~getCallback} callback Handle the retrieval of the item in the resolvable.
 */
Resolvable.prototype.get = function get(config, callback) {
    if (typeof this.item === "function" && this.item.name === "__essencejs_container") {
        // item is a container that needs to be executed to get the value to inject.
        // execute the function and pass to the callback the result.
        this.item(config, callback);
    } else {
        // return what was stored for this registration.
        callback(null, this.item);
    }
};

/**
 * Method to clean up any references to objects. Call when destroying the object.
 */
Resolvable.prototype.dispose = function dispose() {
    delete this.name;
    delete this.isPlaceholder;
    delete this.waitFors;
    delete this.item;
};

module.exports = Resolvable;
