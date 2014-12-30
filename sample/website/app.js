/*
 * File         :   app.js
 * Description  :   Website main application file.
 * ------------------------------------------------------------------------------------------------ */

// set up the essencejs container.
var path = require('path'); // GRRR FIX PATHS!!!!

var EssenceJs = require('essencejs').EssenceJs;
var essencejs = new EssenceJs();

essencejs.imports(path.join(__dirname, "bootstrap/*.js"));

var express = require('express');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

essencejs.config.timeout = 1000;


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

essencejs.instance('app', app);
essencejs.singleton('router', function () {
    return express.Router();
});

essencejs.imports(path.join(__dirname, "controllers/**/*Controller.js"), { namespace : "controllers" }, function (err, controllers) {
    if (err) {
        throw err;
    }

    // initialise controllers.
    controllers.forEach(function (Controller) {
        var controller = new Controller();

        if (controller.path) {
            controller.path = Array.isArray(controller.path) ? controller.path : [controller.path];

            controller.path.forEach(function (path) {
                var router = express.Router();

                    router.
                        route(path).
                        all(controller.all).
                        delete(controller.delete).
                        get(controller.get).
                        post(controller.post).
                        put(controller.put);

                app.use(path, router);
            });
        }
    });

    essencejs.register("controllersRegistered", true, { namespace : "bootstrap" });
});

essencejs.imports(path.join(__dirname, "models/**/*.js"), { namespace : "models" }, function (err) {
    if (err) {
        throw err;
    }
    essencejs.register("modelsRegistered", true, { namespace : "bootstrap" });
});


/*
essencejs.resolveArgs(essencejs.getKeys("controllers"), null, null, null, function (err, controllers) {
    if (err) {
        throw err;
    }

    controllers.forEach(function (Controrller) {
        new Controller();
    });
});
*/

/*
app.use('/users', users);


*/

// error handlers
/*
app.use(function(req, res, next) {
    res.status(err.status || 404);
    res.render('error', {
        message: err.message,
        error: err
    });
});
*/
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000);

module.exports = app;
