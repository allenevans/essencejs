/*
 * File         :   BaseController.js
 * Description  :   Base controller from which other controllers should inherit.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (app, router) {
    "use strict";

    function BaseController() {
        this.path = this.path || null;

        if (this.path) {
            this.path = Array.isArray(this.path) ? this.path : [this.path];

            for (var i = 0; i < this.path.length; i += 1) {
                router.
                    route(this.path[i]).
                    all(this.all).
                    delete(this.delete).
                    get(this.get).
                    post(this.post).
                    put(this.put);

                app.use(this.path, router);
            }
        }
    }

    // Run for all http verbs
    BaseController.prototype.all = function get(req, res, next) {
        next();
    };

    BaseController.prototype.delete = function get(req, res) {
        res.status(400);
        res.send('Not implemented');
    };

    BaseController.prototype.get = function get(req, res) {
        res.status(400);
        res.send('Not implemented');
    };

    BaseController.prototype.options = function get(req, res) {
        res.status(400);
        res.send('Not implemented');
    };

    BaseController.prototype.post = function get(req, res) {
        res.status(400);
        res.send('Not implemented');
    };

    BaseController.prototype.put = function get(req, res) {
        res.status(400);
        res.send('Not implemented');
    };

    return BaseController;
};
