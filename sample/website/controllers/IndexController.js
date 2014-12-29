/*
 * File         :   IndexController.js
 * Description  :   Index default controller.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (
    app,
    router,
    BaseController,
    IndexModel) {
    "use strict";

    function IndexController() {
        BaseController.call(this);

        /* GET home page. */
        router.get('/', function(req, res) {
            res.render('index', new IndexModel({ title: 'Express with essence.js' }));
        });

        app.use('/', router);
    }

    IndexController.prototype = new BaseController();
    IndexController.prototype.constructor = IndexController;

    return IndexController;
};
