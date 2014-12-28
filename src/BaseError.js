/*
 * File         :   BaseError.js
 * Description  :   Base error object from which other error objects should inherit.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

/**
 * Resolvable constructor initialisation parameters.
 * @typedef {Object} BaseError~Params
 * @prop {string} [message] Message about the error. Default = 'An error occurred.'.
 */

/**
 * Essence js base error class.
 * @param {BaseError~Params} params Class property initialisation object.
 * @constructor
 */
var BaseError = function BaseError(params) {
    /**
     * Generalised message about the type of error.
     * @type {string}
     */
    this.message = (params && params.message) || "An error occurred.";
};

module.exports = BaseError;