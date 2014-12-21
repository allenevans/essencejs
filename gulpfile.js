/*
 * File         :   gulpfile.js
 * Description  :   Gulp tasks file.
 * ------------------------------------------------------------------------------------------------ */
var gulp = require("gulp"),
    runSequence = require("run-sequence"),
    jsdoc = require("gulp-jsdoc");

gulp.task("docs", function () {
    return gulp.src(["./src/**/*.js", "README.md"]).
        pipe(jsdoc.parser({
            description : "Node.js dependency injection framework.",
            licenses : "MIT"
        })).
        pipe(jsdoc.generator(
            "./docs", {
                theme : "cerulean",
                path : "ink-docstrap",
                systemName : 'essence.js',
                footer          : "essence.js",
                copyright       : "© Allen Evans - Released under MIT license",
                navType         : "vertical",
                linenums        : true,
                collapseSymbols : false,
                inverseNav      : false
            }));
});

gulp.task("default", function (callback) {
    runSequence(
        "docs",
        callback
    );
});