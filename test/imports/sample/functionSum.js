/*
 * File         :   functionSum.js
 * Description  :   sample module exporting function.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function () {
    return function (v1, v2) {
        return v1 + v2;
    };
};