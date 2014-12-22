/*
 * File         :   Registration.js
 * Description  :   Registration class for holding dependencies.
 * ------------------------------------------------------------------------------------------------ */
var Resolvable = require("./Resolvable.js");

/**
 * Registration record class for maintaining the list of dependency registrations.
 * @constructor
 */
var Registration = function Registration() {
    /**
     * Dictionary of key / value registrations
     * @type {Object.<string, Resolvable>}
     */
    this.dictionary = {};

    /**
     * Get the list of registration keys stored within the dictionary.
     * @name keys
     * @memberOf! Registration
     * @type {string[]}
     * @readonly
     */
    Object.defineProperty(this, "keys", {
        get : function () {
            return Object.keys(this.dictionary);
        }
    });
};

/**
 * Register a resolvable instance using the name property as the key. Registering a resolvable with the same name
 * will replace previous resolvable objects;
 * @param {Resolvable} resolvable instance to store
 */
Registration.prototype.add = function add(resolvable) {
    if (!(resolvable instanceof Resolvable)) { throw "Argument `resolvable` MUST be an instance of Resolvable"; }
    if (resolvable.name === undefined || resolvable.name === null) { throw "Resolvable must be given a name before it can be registered"; }

    if (this.dictionary[resolvable.name] &&
        !this.dictionary[resolvable.name].isPlaceholder) {
        // a resolvable already exists for this key.
        // try and dispose of it correctly before it is replaced.
        this.remove(resolvable.name);
    }

    this.dictionary[resolvable.name] = resolvable;
};

/**
 * Get the resolvable by name.
 * @param {string} name of the resolvable stored in the dictionary.
 * @returns {Resolvable} resolvable
 */
Registration.prototype.get = function get(name) {
    return this.dictionary[name];
};

/**
 * Removes and disposes of the resolvable by name.
 * @param {string} name of the resolvable stored in the dictionary.
 */
Registration.prototype.remove = function remove(name) {
    this.dictionary[name] && this.dictionary[name].dispose && this.dictionary[name].dispose();
    delete this.dictionary[name];
};

/**
 * Dispose of this registration and any resolvables in the dictionary.
 */
Registration.prototype.dispose = function dispose() {
    var self = this;

    Object.keys(self.dictionary).
        forEach(function (key) {
            self.remove(key);
        });

    delete self.dictionary;
};

module.exports = Registration;