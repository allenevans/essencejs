/*
 * File         :   express-middleware.js
 * Description  :   Bootstrap the express middleware.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (app, passport) {
    "use strict";

    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    // uncomment after placing your favicon in /public
    //app.use(favicon(process.cwd() + '/public/favicon.ico'));
};
