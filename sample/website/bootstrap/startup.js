/*
 * File         :   startup.js
 * Description  :   App startup bootstrap.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function ($essencejs, express, settings, path, hogan) {
    "use strict";

    // create the instance of the express app.
    var app = express();

    app.set('views', path.join(process.cwd(), 'views'));
    app.engine("html", hogan);
    app.set('view engine', 'html');
    app.set('layout', path.join(process.cwd(), 'views/layouts/default'));
    app.set('partials', {
        header : path.join(process.cwd(), "views/partials/header")
    });

    $essencejs.instance("app", app);
    $essencejs.register("express", express);

    $essencejs.factory('router', function () {
        return express.Router();
    });

    var server = app.listen(settings.port, function() {
        console.log('Express server listening on port ' + server.address().port);
    });
};
