/*
 * File         :   ResolveError.js
 * Description  :   Error object related to resolving of arguments errors.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var BaseError = require("./BaseError");

/**
 * Resolvable constructor initialisation parameters.
 * @typedef {Object} ResolveError~Params
 * @prop {string} [message] Message about the error. Default = 'Failed to resolve one or more dependencies.'.
 */

/**
 * Essence js resolve error class.
 * @param {ResolveError~Params} params Class property initialisation object.
 * @constructor
 */
var ResolveError = function ResolveError(params) {
    BaseError.call(this, params);

    /**
     * Message about the error. Default = 'Failed to resolve one or more dependencies.'.
     * @type {string}
     */
    this.message = (params && params.message) || "Failed to resolve one or more dependencies.";

    /**
     * List of unresolved names.
     * @type {string[]}
     */
    this.unresolved = (params && params.unresolved) || [];

    /**
     * Resolve callstack trace.
     * @type {string[]}
     */
    this.resolveStack = (params && params.resolveStack) || [];
};

ResolveError.prototype = new BaseError();
ResolveError.prototype.constructor = ResolveError;

/**
 * Return a string printable version of this error.
 */
ResolveError.prototype.toString = function toString() {
    return this.message + "\n\n" +
        "Unresolved:\n" +
        this.unresolved.join("\n") + "\n" +
        "Resolve Stack :\n" +
        this.resolveStack.join("\n");
};

module.exports = ResolveError;