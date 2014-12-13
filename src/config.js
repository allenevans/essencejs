/*
 * File         :   config.js
 * Description  :   Essencejs default configuration.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

/**
 * Essence js configuration object.
 * @prop {{timeout: number}} Maximum number of milliseconds to wait for dependencies of the injected function
 *                           to be resolved.
 */
var config = {
    timeout : 30000
};

module.exports = config;