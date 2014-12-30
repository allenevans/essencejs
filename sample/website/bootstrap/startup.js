/*
 * File         :   startup.js
 * Description  :   App startup bootstrap.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function ($essencejs, config, path) {
    "use strict";

    var express = require("express");

    // create the instance of the express app.
    var app = express();

    app.set('views', path.join(process.cwd(), 'views'));
    app.set('view engine', 'jade');

    $essencejs.instance("app", app);
    $essencejs.register("express", express);

    $essencejs.factory('router', function () {
        return express.Router();
    });

    var server = app.listen(config.port, function() {
        console.log('Express server listening on port ' + server.address().port);
    });
};
