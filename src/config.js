/*
 * File         :   Config.js
 * Description  :   Essencejs configuration class
 * ------------------------------------------------------------------------------------------------ */
"use strict";

/**
 * Resolvable constructor initialisation parameters.
 * @typedef {Object} Config~Params
 * @prop {number} [timeout] Maximum number of milliseconds to wait for dependencies of the injected function to be resolved.
 */

/**
 * Essence js configuration class.
 * @param {Config~Params} params Class property initialisation object.
 * @constructor
 */
var Config = function Config(params) {
    /**
     * Maximum number of milliseconds to wait for dependencies of the injected function to be resolved.
     * @type {number}
     */
    this.timeout = (params && params.timeout) || 30000;
};

module.exports = Config;