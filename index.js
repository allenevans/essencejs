/*
 * File         :   index.js
 * Description  :   Essence Js module namespace export.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

/**
 * Exported EssenceJs namespace.
 * @namespace
 */
module.exports = {
    // Classes
    EssenceJs : require("./src/EssenceJs"),

    Config : require("./src/Config"),
    Registration : require("./src/Registration"),
    Resolvable : require("./src/Resolvable"),

    // Errors
    BaseError : require("./src/BaseError"),
    CancelError : require("./src/CancelError"),
    ResolveError : require("./src/ResolveError"),

    // Namespaces
    parser : require("./src/parser"),
    util : require("./src/util")
};
