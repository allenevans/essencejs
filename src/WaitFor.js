/*
 * File         :   WaitFor.js
 * Description  :   Essencejs wait for callback object
 * ------------------------------------------------------------------------------------------------ */
"use strict";

/**
 * WaitFor constructor initialisation parameters.
 * @typedef {Object} WaitFor~Params
 * @prop {function} [callback] Function to call once the resolvable item has been resolved.
 */

/**
 * Essence js wait for class.
 * @param {WaitFor~Params} params Class property initialisation object.
 * @constructor
 */
var WaitFor = function WaitFor(params) {
    /**
     * Resolve stack of calls leading up to this wait for creation.
     * @type {string[]}
     */
    this.resolveStack = params && params.resolveStack;

    /**
     * Function to call once the resolvable item has been resolved.
     * @type {function}
     */
    this.callback = (params && params.callback) || function noop() {};
};

module.exports = WaitFor;