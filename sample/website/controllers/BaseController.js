/*
 * File         :   BaseController.js
 * Description  :   Base controller from which other controllers should inherit.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function () {
    "use strict";

    function BaseController() { }

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

    BaseController.prototype.dispose = function dispose() { };

    return BaseController;
};
