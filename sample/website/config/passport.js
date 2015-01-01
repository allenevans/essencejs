/*
 * File         :   passport.js
 * Description  :   Configure the passport authentication handler.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (passport, LocalPassportStrategy, authenticateService, userService) {
    "use strict";

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        userService.getById(id, done);
    });

    passport.use('local-login',
        new LocalPassportStrategy({
            // override the passport default form posted field names.
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            authenticateService.authenticate(email, password, function authResult(err, user) {
                done(err, user);
            });
        }));
};
