/*
 * File         :   requires.js
 * Description  :   Module for handling requiring and configuration of third-party modules
  *                 then registering with essence js container.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function ($essencejs) {
    "use strict";

    // passport - for handing authentication.
    // https://scotch.io/tutorials/easy-node-authentication-setup-and-local
    $essencejs.register("passport", require("passport"));
    $essencejs.register("LocalPassportStrategy", require('passport-local').Strategy);

    // Express web server.
    $essencejs.register("express", require("express"));

    // core node modules
    $essencejs.register("path", require('path'));
};
