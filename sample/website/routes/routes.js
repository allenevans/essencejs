/*
 * File         :   routes.js
 * Description  :   Routing configuration.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    IndexController,
    UserController,
    router,
    express,
    path,
    app
) {
    "use strict";

    // Route registration table.
    // This simply assumes that router paths are all mounted onto the root i.e. /
    var routes = {
        "/"                 : IndexController,
        "/users/:id?"       : UserController
    };

    // Loop through object paths and bind the corresponding controller to the app path.
    Object.keys(routes).forEach(function (path) {
        var Controller = routes[path],
            controller = new Controller();

        router.
            route(path).
            all(controller.all).
            delete(controller.delete).
            get(controller.get).
            post(controller.post).
            put(controller.put);

        app.use(path, router);
    });

    app.use(express.static(path.join(process.cwd(), 'public')));

    // Register the error handlers
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler will print stack trace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler, no stack traces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
};