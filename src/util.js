/*
 * File         :   util.js
 * Description  :   Utility methods.
 * ------------------------------------------------------------------------------------------------ */

/**
 * Create an instance of the object using the given arguments.
 * @param constructor
 * @param args
 * @returns {instantiateObject.F}
 * @memberof util
 */
function instantiateObject(constructor, args) {
    function F() {
        constructor.apply(this, args);
    }

    args = args || [];

    if (!Array.isArray(args)) {
        throw "Arguments passed to constructObject must be in the form of an array.";
    } else if (!constructor || !constructor.apply) {
        throw "Constructor passed does not support apply method.";
    } else {
        F.prototype = constructor.prototype;
        return new F();
    }
};

/**
 * @function isObjectConstructor.
 * @description checks to see if object can be instantiated.
 * @param {Object} obj object to check.
 * @returns {boolean} True if the object can be instantiated with the new command, else false.
 * @memberof util
 */
function isObjectConstructor(obj) {
    if (obj && typeof obj === "function") {
        // It is not easy to say if the function is intended to be used as a constructor e.g. new Obj(); ...
        // This definition of a function that is a constructor is a function that has a name that begins with
        // a capital letter or a function that has prototype methods assigned to it.
        return !!obj.name.match(/^[A-Z]/) || Object.keys(obj.prototype).length > 0;
    }

    return false;
};

/**
 * Convert the first character of a string into its lowercase representation.
 * @param {string} str To to make the first character lowercase for.
 * @returns {string} String where the first character is in its lowercase representation.
 * @memberof util
 */
function lowerCaseFirst(str) {
    return str && str.replace(/^\w/, function (character) { return character.toLowerCase(); });
}

/**
 * Given a registration key, determine the namespace, and key name for the namespace (if provided).
 * A namespace is denoted by the characters left of a double underscore `__` in the key name.
 * e.g. namespace__keyName
 * If not namespace is defined, then the returned namespace value will be an empty string.
 * @param {string} str String key which may or may not contain a namespace.
 * @returns {Object}
 */
function splitNamespaceKey(str) {
    // get the namespace (if there is one) and remove from the key value.
    var namespace = str.split(/\_\_/);
    var key = (namespace[0] && namespace.slice(1).join("__")) || str;

    function NamespaceKey (params) {
        this.namespace = params && params.namespace;
        this.key = params && params.key;
    }

    NamespaceKey.prototype.toString = function toString() {
        return (this.namespace ? this.namespace + "__" : "") + this.key;
    };

    namespace = namespace.length > 1 ? namespace[0] : "";

    return new NamespaceKey({
        namespace : namespace,
        key : key
    });
}

/**
 * Utilities namespace
 * @namespace util
 */
module.exports = {
    instantiateObject : instantiateObject,
    isObjectConstructor : isObjectConstructor,
    lowerCaseFirst : lowerCaseFirst,
    splitNamespaceKey : splitNamespaceKey
};
