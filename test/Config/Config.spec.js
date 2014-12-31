/*
 * File         :   Config.spec.js
 * Description  :   TEST Config class definition tests.
 * ------------------------------------------------------------------------------------------------ */
"use strict";

var path = require("path");

module.exports = {
    "Config should be exported":
        function (test) {
            var Config = require(path.join(process.cwd(), "src/Config.js"));

            test.expect(2);

            test.equal(!!Config, true, "Expected to be able to require Config");
            test.equal(Config.name, "Config", "Expected name to be `Config`");

            test.done();
        },
    "Should be able to set timeout through Config constructor":
        function (test) {
            var Config = require(path.join(process.cwd(), "src/Config.js"));

            var defaultConfig = new Config();

            var config = new Config({
                timeout : 12345
            });

            test.expect(2);

            test.equal(config.timeout, 12345);
            test.notEqual(config.timeout, defaultConfig.timeout);

            test.done();
        }
};