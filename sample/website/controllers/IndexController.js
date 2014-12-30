/*
 * File         :   IndexController.js
 * Description  :   Index default controller.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    BaseController,
    IndexModel) {
    "use strict";

    function IndexController() {
        this.path = '/';

        BaseController.call(this);
    }

    IndexController.prototype = new BaseController();
    IndexController.prototype.constructor = IndexController;

    IndexController.prototype.get = function (req, res) {
        /* GET home page. */
        res.render('index', new IndexModel({ title: 'Express with essence.js' }));
    };

    return IndexController;
};
