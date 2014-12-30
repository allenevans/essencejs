/*
 * File         :   BaseController.js
 * Description  :   Base controller from which other controllers should inherit.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function () {
    "use strict";

    function BaseController() {
        this.path = this.path || null;

        if (this.path) {
            this.path = Array.isArray(this.path) ? this.path : [this.path];
        }
    }

    // Run for all http verbs
    BaseController.prototype.all = function all(req, res, next) {
        next();
    };

    BaseController.prototype.delete = function delete_(req, res) {
        res.status(400);
        res.send('Not implemented');
    };

    BaseController.prototype.get = function get(req, res) {
        res.status(400);
        res.send('Not implemented');
    };

    BaseController.prototype.options = function options(req, res) {
        res.status(400);
        res.send('Not implemented');
    };

    BaseController.prototype.post = function post(req, res) {
        res.status(400);
        res.send('Not implemented');
    };

    BaseController.prototype.put = function put(req, res) {
        res.status(400);
        res.send('Not implemented');
    };

    return BaseController;
};
