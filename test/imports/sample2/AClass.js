/*
 * File         :   AClass.js
 * Description  :   A sample class.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (ConfigClass) {
    "use strict";

    function AClass() {
        var config = new ConfigClass();

        this.value = config.value;
    }

    return AClass;
};
