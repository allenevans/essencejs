var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var EssenceJs = require('essencejs').EssenceJs;
var essencejs = new EssenceJs();
essencejs.config.timeout = 1000;

var users = require('./routes/users');

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

var modelStrategy = function modelStrategy(filePath) {
    var namespaceKey = "models__" + path.basename(filePath, path.extname(filePath)).replace(/\s/g, "");
    essencejs.inject(require(path.join(__dirname, filePath)), function (err, Model) {
        if (err) {
            throw err.message;
        }

        essencejs.register(namespaceKey, Model);
    });
};

var controllerStrategy = function controllerStrategy(filePath) {
    var namespaceKey = "controllers__" + path.basename(filePath, path.extname(filePath)).replace(/\s/g, "");
    essencejs.inject(require(path.join(__dirname, filePath)), function (err, Controller) {
        if (err) {
            throw err.message;
        }

        essencejs.register(namespaceKey, Controller);
        // instantiate the controller.
        new Controller();
    });
};

essencejs.registerByStrategy("controllers/**/*.js", controllerStrategy, { namespace : "controllers" }, function (err) {
    if (err) {
        throw err.message;
    }
    essencejs.register("controllersRegistered", true, { namespace : "bootstrap" });
});

essencejs.registerByStrategy("models/**/*.js", modelStrategy, { namespace : "models" }, function (err) {
    if (err) {
        throw err.message;
    }
});
/*
essencejs.inject(function (controllersRegistered) {
    if (controllersRegistered) {
        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }
}, { namespaces : ["bootstrap"] });
*/

/*
app.use('/users', users);


*/

// error handlers

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
