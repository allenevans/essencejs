/*
 * File         :   app.js
 * Description  :   Website main application file.
 * ------------------------------------------------------------------------------------------------ */

// set up the essencejs container.
var EssenceJs = require('essencejs').EssenceJs;
var essencejs = new EssenceJs({});

essencejs.config.timeout = 250;

/**
 * Register each class as a factory. The essence js default naming convention will lower case the first character
 * of the class when registering an factory method for that class e.g. AuthenticationService => authenticationService.
 * @param {object} Any errors during import of the classes.
 * @params {object[]} Classes to be registered as factories.
 */
function registerAsFactories(err, classes) {
    if (!err) {
        classes.forEach(function(Class) {
            essencejs.factory(Class);
        });
    }
}

// import modules.
essencejs.imports("./requires.js");
essencejs.imports("./config/**/*.js", { namespace : "config" });
essencejs.imports("./db.js");
essencejs.imports("./bootstrap/**/*.js");
essencejs.imports("./models/**/*.js", { namespace : "models" });
essencejs.imports("./services/**/*.js", { namespace : "services" }, registerAsFactories);
essencejs.imports("./controllers/**/*Controller.js", { namespace : "controllers" });

// import routes
essencejs.imports("./routes/routes.js");

essencejs.on("resolveError", function (err) {
    // fatal error resolving dependencies.
    console.error(err);
    process.exit(1);
});