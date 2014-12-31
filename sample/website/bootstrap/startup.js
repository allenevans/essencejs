/*
 * File         :   startup.js
 * Description  :   App startup bootstrap.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function ($essencejs, express, session, settings, path) {
    "use strict";

    // create the instance of the express app.
    var app = express();
    app.use(session({
        secret: 'some-secret-you-really-should-change-this-todo',
        resave : false,
        saveUninitialized : true
    })); // session secret

    app.set('views', path.join(process.cwd(), 'views'));
    app.set('view engine', 'jade');

    $essencejs.instance("app", app);
    $essencejs.register("express", express);

    $essencejs.factory('router', function () {
        return express.Router();
    });

    var server = app.listen(settings.port, function() {
        console.log('Express server listening on port ' + server.address().port);
    });
};
