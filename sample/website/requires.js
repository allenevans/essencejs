/*
 * File         :   requires.js
 * Description  :   Module for handling requiring and configuration of third-party modules
  *                 then registering with essence js container.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function ($essencejs) {
    "use strict";

    // passport - for handing authentication.
    // https://scotch.io/tutorials/easy-node-authentication-setup-and-local
    $essencejs.register("passport", require("passport"), { namespace : "requires"});
    $essencejs.register("LocalPassportStrategy", require('passport-local').Strategy, { namespace : "requires"});

    // Express web server.
    $essencejs.register("express", require("express"), { namespace : "requires"});
    $essencejs.register("session", require("express-session"), { namespace : "requires"});

    // core node modules
    $essencejs.register("path", require('path'), { namespace : "requires"});
    $essencejs.register("util", require('util'), { namespace : "requires"});
};
