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
 * Utilities namespace
 * @namespace util
 */
module.exports = {
    instantiateObject : instantiateObject,
    isObjectConstructor : isObjectConstructor,
    lowerCaseFirst : lowerCaseFirst
};
