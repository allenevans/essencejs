/*
 * File         :   Registration.js
 * Description  :   Registration class for holding dependencies.
 * ------------------------------------------------------------------------------------------------ */
var Resolvable = require("./Resolvable.js"),
    util = require("./util");

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

    /**
     * Get the list of namespaces stored within the dictionary.
     * @name keys
     * @memberOf! Registration
     * @type {string[]}
     * @readonly
     */
    Object.defineProperty(this, "namespaces", {
        get : function () {
            return this.keys.reduce(function (namespaces, key) {
                var namespaceKey = util.splitNamespaceKey(key);

                if (namespaceKey.namespace && namespaces.indexOf(namespaceKey.namespace) < 0) {
                    namespaces.push(namespaceKey.namespace);
                }

                return namespaces;
            }, [])
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
    if (resolvable.key === undefined || resolvable.key === null) { throw "Resolvable must be given a name before it can be registered"; }

    var dictionaryKey = (resolvable.namespace ? resolvable.namespace + "__" : "") +
            resolvable.key;

    if (this.dictionary[dictionaryKey] &&
        !this.dictionary[dictionaryKey].isPlaceholder) {
        // a resolvable already exists for this key.
        // try and dispose of it correctly before it is replaced.
        this.remove(dictionaryKey);
    }

    this.dictionary[dictionaryKey] = resolvable;
};

/**
 * Get the resolvable by name.
 * @param {string} key of the resolvable stored in the dictionary.
 * @param {?string[]|string} namespaces Namespaces to match against.
 *  A null or empty array implies match against any namespace.
 * @returns {Resolvable} resolvable
 */
Registration.prototype.get = function get(key, namespaces) {
    var self = this;

    namespaces = namespaces && (Array.isArray(namespaces) ? namespaces : [namespaces]) || [];

    if (namespaces.length === 0 && self.dictionary[key] === undefined) {
        // no namespaces defined. use all available namespaces.
        namespaces = self.namespaces;
    }

    var matches = namespaces.reduce(function (matched, namespace) {
        var searchKey = namespace + "__" + key,
            found = self.dictionary[searchKey];

        if (found) {
            matched.push(searchKey);
        }
        return matched;
    }, []);

    if (matches.length > 1) {
        // matches should only return a maximum of 1 result, else throw an ambiguous get error.
        throw new Error("Ambiguous result. Key `" + key + "` matches " + matches.join(", ") + ".");
    }

    if (matches.length === 1) {
        // found an exact match using the given namespace.
        return self.dictionary[matches[0]];
    }

    // fallback, return lookup by key.
    return self.dictionary[key];
};

/**
 * Removes and disposes of the resolvable by name.
 * @param {string} name of the resolvable stored in the dictionary.
 */
Registration.prototype.remove = function remove(key, namespaces) {
    namespaces = namespaces && (Array.isArray(namespaces) ? namespaces : [namespaces]) || [];

    var self = this,
        matches = namespaces.reduce(function (matched, namespace) {
        var searchKey = namespace + "__" + key,
            found = self.dictionary[searchKey];

        if (found) {
            matched.push(searchKey);
        }
        return matched;
    }, []);

    if (namespaces.length === 0) {
        // remove global registration.
        matches.push(key);
    }

    matches.forEach(function (key) {
        self.dictionary[key] && self.dictionary[key].dispose && self.dictionary[key].dispose();
        delete self.dictionary[key];
    });
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