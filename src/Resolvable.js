/*
 * File         :   Resolvable.js
 * Description  :   Resolvable dependency container.
 * ------------------------------------------------------------------------------------------------ */

/**
 * Resolvable classes contain information about the dependency that is to be resolved.
 * @param {object} params Object for setting instance properties during instantiation.
 * @constructor
 */
var Resolvable = function Resolvable(params) {
    /**
     *
     * @type {string} Name of the resolvable argument.
     */
    this.name = params && params.name;

    /**
     * Flag to indicate that this resolvable is a temporary placeholder that will be replaced once the
     * actual resolvable item can be resolved.
     * @type {boolean}
     */
    this.isPlaceholder = (params && params.isPlaceholder) || false;

    /**
     * A string list of things that need to be resolved before this resolvable can be resolved.
     * @type {Array}
     */
    this.waitFors = (params && params.waitFors) || [];

    /**
     * Item that is being stored in this resolvable.
     * @type {Object}
     */
    this.item = params && params.item;
};

/**
 * Get the resolvable item.
 * @param {function} callback function to execute that will return the contents of the item.
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
