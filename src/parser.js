/*
 * File         :   parser.js
 * Description  :   Helper methods for parsing.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

// Regex for parsing functions when converted to strings.
var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    RM_COMMENTS = /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/mg;

/**
 * reflects to get the arguments of the given function.
 * @param {function|Array} itemDeclaration function to get arguments for.
 * @returns {Array} Array of any argument names for the given function.
 */
function getArgs(itemDeclaration) {
    if (itemDeclaration && itemDeclaration.constructor === Array) {
        if (!itemDeclaration.length || typeof itemDeclaration[itemDeclaration.length - 1] !== "function") {
            throw "Last argument of array must be a function";
        }

        return itemDeclaration.slice(0, itemDeclaration.length - 1);
    } else if (typeof itemDeclaration === "function") {
        var text = itemDeclaration.toString();

        return text.
            replace(RM_COMMENTS, "").
            match(FN_ARGS)[1].
            split(",").
            reduce(function (args, arg) {
                if (arg.length) {
                    args.push(arg.trim());
                }
                return args;
            }, []);
    } else {
        return []; // no arguments.
    }
}

module.exports = {
    getArgs : getArgs
};
