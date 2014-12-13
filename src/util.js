/*
 * File         :   util.js
 * Description  :   Utility methods.
 * ------------------------------------------------------------------------------------------------ */

/**
 *   @function isObjectConstructor.
 *   @description checks to see if object can be instantiated.
 *   @param {Object} obj object to check.
 *   @returns {Boolean} True if the object can be instantiated with the new command.
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

module.exports = {
    isObjectConstructor : isObjectConstructor
};
