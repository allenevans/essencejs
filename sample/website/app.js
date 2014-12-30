/*
 * File         :   app.js
 * Description  :   Website main application file.
 * ------------------------------------------------------------------------------------------------ */

// set up the essencejs container.
var EssenceJs = require('essencejs').EssenceJs;
var essencejs = new EssenceJs();
essencejs.config.timeout = 1000;

essencejs.register("path", require('path'));

// import modules.
essencejs.imports("./config.js");
essencejs.imports("./bootstrap/**/*.js");
essencejs.imports("./models/**/*.js", { namespace : "models" });
essencejs.imports("./controllers/**/*Controller.js", { namespace : "controllers" });

// import routes
essencejs.imports("./routes/routes.js");