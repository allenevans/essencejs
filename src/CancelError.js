/*
 * File         :   CancelError.js
 * Description  :   Error object related to cancelling when resolving arguments.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var BaseError = require("./BaseError");

/**
 * Resolvable constructor initialisation parameters.
 * @typedef {Object} CancelError~Params
 * @prop {string} [message] Message detailing the cancellation reason. Default = 'Cancelled.'.
 */

/**
 * Essence js resolve error class.
 * @param {CancelError~Params} params Class property initialisation object.
 * @constructor
 * @extends BaseError
 */
var CancelError = function CancelError(params) {
    BaseError.call(this, params);

    /**
     * Message detailing the cancellation reason. Default = 'Cancelled.'.
     * @type {string}
     */
    this.message = (params && params.message) || "Cancelled.";
};

CancelError.prototype = new BaseError();
CancelError.prototype.constructor = CancelError;

module.exports = CancelError;