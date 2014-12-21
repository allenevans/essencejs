/*
 * File         :   Resolvable.js
 * Description  :   Resolvable dependency container.
 * ------------------------------------------------------------------------------------------------ */

/**
 * Resolvable constructor initialisation parameters.
 * @typedef {Object} Resolvable~Params
 * @prop {string} name Name of the resolvable argument.
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
     * Name of the resolvable argument.
     * @type {string}
     */
    this.name = params && params.name;

    /**
     * Flag to indicate that this resolvable is a temporary placeholder that will be replaced once the
     * actual resolvable item can be resolved.
     * @type {!boolean}
     */
    this.isPlaceholder = (params && params.isPlaceholder) || false;

    /**
     * A string list of things that need to be resolved before this resolvable can be resolved.
     * @type {string[]}
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
 * Get the resolvable item.
 * @param {Resolvable~getCallback} callback Handle the retrieval of the item in the resolvable.
 */
Resolvable.prototype.get = function get(callback) {
    if (typeof this.item === "function" && this.item.name === "__essencejs_container") {
        // item is a container that needs to be executed to get the value to inject.
        // execute the function and pass to the callback the result.
        this.item(callback);
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
