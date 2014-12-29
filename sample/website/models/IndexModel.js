/*
 * File         :   IndexModel.js
 * Description  :   The index model.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (BaseModel) {
    "use strict";

    function IndexModel(params) {
        this.title = params && params.title;
    }

    IndexModel.prototype = new BaseModel();
    IndexModel.prototype.constructor = IndexModel;

    return IndexModel;
};
