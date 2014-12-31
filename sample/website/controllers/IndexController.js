/*
 * File         :   IndexController.js
 * Description  :   Index default controller.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    util,
    BaseController,
    IndexModel) {
    "use strict";

    function IndexController() {
        this.instantiatedAt = new Date();

        BaseController.call(this);
    }

    util.inherits(IndexController, BaseController);

    IndexController.prototype.get = function (req, res) {
        /* GET home page. */
        res.render('index', new IndexModel({ title: 'Express with essence.js ' + this.instantiatedAt.toString() }));
    };

    return IndexController;
};
