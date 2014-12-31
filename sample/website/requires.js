/*
 * File         :   requires.js
 * Description  :   Module for handling requiring and configuration of third-party modules
  *                 then registering with essence js container.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function ($register) {
    "use strict";

    // passport - for handing authentication.
    // https://scotch.io/tutorials/easy-node-authentication-setup-and-local
    $register("passport", require("passport"), { namespace : "requires"});
    $register("LocalPassportStrategy", require('passport-local').Strategy, { namespace : "requires"});

    // Express web server.
    $register("express", require("express"), { namespace : "requires"});
    $register("session", require("express-session"), { namespace : "requires"});
    $register("hogan", require("hogan-express"), { namespace : "requires"});

    // core node modules
    $register("path", require('path'), { namespace : "requires"});
    $register("util", require('util'), { namespace : "requires"});
};
