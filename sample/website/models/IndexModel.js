/*
 * File         :   IndexModel.js
 * Description  :   The index model.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    util,
    BaseModel
) {
    "use strict";

    function IndexModel(params) {
        this.title = params && params.title;
    }

    util.inherits(IndexModel, BaseModel);

    return IndexModel;
};
