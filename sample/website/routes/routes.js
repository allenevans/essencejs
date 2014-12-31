/*
 * File         :   routes.js
 * Description  :   Routing configuration. File for defining which controller will be bound to which route.
 *                  The way a controller is bound can be customised. Below three handlers have been defined
 *                  which change the way the controller handles the route i.e. controller instance for the lifespan
 *                  of the application, or controller instance per request.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    IndexController,
    LoginController,
    UserController,
    router,
    express,
    path,
    app,
    $essencejs
) {
    "use strict";

    // Route registration table.
    // This simply assumes that router paths are all mounted onto the root i.e. /
    var routes = {
        "/"                 : IndexController,
        "/login"            : LoginController,
        "/users/:id?"       : UserController
    };

    // Loop through object paths and bind the corresponding controller to the app path.
    Object.keys(routes).forEach(function (path) {
        var Controller = routes[path],
            handler;

        // Use dependency injection to instantiate the controller will any necessary dependencies.
        // The controller lasts only for the lifespan of the request.
        // ================================================================================================
        function dependencyInjectedConstructorControllerHandler(method) {
            return function () {
                var middlewareArgs = Array.prototype.slice.apply(arguments, [0]);

                $essencejs.inject(Controller, {
                      overrides : {
                        req : arguments[0],
                        res : arguments[1],
                        next : arguments[2]
                      }
                    },
                    function injectedConstructor(err, controller) {
                        if (err) { throw err; }

                        // call the controller method e.g. get() with the arguments passed into the middleware,
                        // typically req, res, next.
                        method.apply(controller, middlewareArgs);

                        // dispose of the controller for this request.
                        controller.dispose();
                        controller = null;
                    });
            }
        }

        handler = dependencyInjectedConstructorControllerHandler;

        var route = router.route(path);

        // only configure the all route if all method has been defined on the controller.
        // defining an all method will cause the controller code to be executed more than once.
        // e.g. GET /users => all(new Controller()) => get(new Controller())
        if (Controller.prototype.all) {
            route.all(handler(Controller.prototype.all));
        }

        route.
            delete(handler(Controller.prototype.delete)).
            get(handler(Controller.prototype.get)).
            post(handler(Controller.prototype.post)).
            put(handler(Controller.prototype.put));

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