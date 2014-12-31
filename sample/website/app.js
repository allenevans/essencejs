/*
 * File         :   app.js
 * Description  :   Website main application file.
 * ------------------------------------------------------------------------------------------------ */

// set up the essencejs container.
var EssenceJs = require('essencejs').EssenceJs;
var essencejs = new EssenceJs();
essencejs.config.timeout = 1000;

essencejs.imports("./requires.js");

// import modules.
essencejs.imports("./config/settings/**/*.js", { namespace : "config" });
essencejs.imports("./bootstrap/**/*.js");
essencejs.imports("./models/**/*.js", { namespace : "models" });
essencejs.imports("./controllers/**/*Controller.js", { namespace : "controllers" });

// import routes
essencejs.imports("./routes/routes.js");