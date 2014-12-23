/*
 * File         :   gulpfile.js
 * Description  :   Gulp tasks file.
 * ------------------------------------------------------------------------------------------------ */
var gulp = require("gulp"),
    runSequence = require("run-sequence"),
    jsdoc = require("gulp-jsdoc"),
    bump = require("gulp-bump");

gulp.task("docs", function () {
    return gulp.src(["./src/**/*.js", "README.md"]).
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

gulp.task("default", function (callback) {
    runSequence(
        "patch-version-bump",
        "docs",
        callback
    );
});