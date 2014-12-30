/*
 * File         :   gulpfile.js
 * Description  :   Gulp tasks file.
 * ------------------------------------------------------------------------------------------------ */
var gulp = require("gulp"),
    runSequence = require("run-sequence"),
    jsdoc = require("gulp-jsdoc"),
    bump = require("gulp-bump"),
    remove = require("gulp-rimraf"),
    istanbul = require("gulp-istanbul"),
    nodeunit = require("gulp-nodeunit");

gulp.task("clean-coverage", function () {
    return gulp.src(["./coverage", "./test/*.js.xml"], { read : false }).
        pipe(remove({force : true}));
});

gulp.task("clean-coverage-xml", function () {
    return gulp.src(["./test/*.js.xml"], { read : false }).
        pipe(remove({force : true}));
});

gulp.task("clean-docs", function () {
    return gulp.src(["./docs"], { read : false }).
        pipe(remove({force : true}));
});

gulp.task("generate-docs", function () {
    return gulp.src(["index.js", "./src/**/*.js", "README.md"]).
        pipe(jsdoc.parser({
            description : "Node.js dependency injection framework.",
            licenses : "MIT"
        })).
        pipe(jsdoc.generator(
            "./docs", {

                theme : "simplex",
                path : "ink-docstrap",
                systemName : 'essence.js',
                footer          : "essence.js",
                copyright       : "© Allen Evans - Released under MIT license",
                navType         : "vertical",
                linenums        : true,
                collapseSymbols : false,
                inverseNav      : false,
                footer          : '' +
                    '<script>function scrollInit() {' +
                        'function menuHack() {' +
                            'var viewPortTooSmall = $("#toc").position().top + $("#toc").height() > $(window).height();' +
                            '$("#toc").css("position", "absolute"); ' +
                            '$(".quick-search").css("position", "absolute"); ' +
                            '$("#toc").css("margin-top", viewPortTooSmall ? 0 : window.scrollY); ' +
                            '$(".quick-search").css("margin-top", viewPortTooSmall ? 0 : window.scrollY); ' +
                        '}' +
                        'window.onscroll = menuHack;' +
                        '' +
                    '}; document.addEventListener("DOMContentLoaded", scrollInit, false);</script>'
            }));
});

gulp.task("major-version-bump", function () {
    gulp.src("./package.json")
        .pipe(bump({type : "major"}))
        .pipe(gulp.dest("./"));
});

gulp.task("minor-version-bump", function () {
    gulp.src("./package.json")
        .pipe(bump({type : "minor"}))
        .pipe(gulp.dest("./"));
});

gulp.task("patch-version-bump", function () {
    gulp.src("./package.json")
        .pipe(bump({type : "patch"}))
        .pipe(gulp.dest("./"));
});

gulp.task("docs", function (callback) {
    runSequence(
        "clean-docs",
        "generate-docs",
        callback
    );
});

gulp.task("coverage", function (callback) {
    gulp.src(["src/**/*.js"])
        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function () {
            gulp.src(["test/**/*.spec.js"])
                .pipe(nodeunit({
                    reporter: "junit",
                    reporterOptions: {
                        output: "test"
                    }
                }))
                .pipe(istanbul.writeReports())// Creating the reports after tests ran.
                .on('end', callback);
        });
});

gulp.task("test", function (callback) {
    runSequence(
        "clean-coverage",
        "coverage",
        "clean-coverage-xml",
        callback
    );
});

gulp.task("default", function (callback) {
    runSequence(
        "test",
        "patch-version-bump",
        "docs",
        callback
    );
});