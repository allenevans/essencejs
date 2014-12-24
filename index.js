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
    EssenceJs : require("./src/EssenceJs"),

    Config : require("./src/Config"),
    Registration : require("./src/Registration"),
    Resolvable : require("./src/Resolvable"),

    parser : require("./src/parser"),
    util : require("./src/util")
};
