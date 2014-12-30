/*
 * File         :   express-middleware.js
 * Description  :   Bootstrap the express middleware.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (app, express, path) {
    "use strict";

    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
};
