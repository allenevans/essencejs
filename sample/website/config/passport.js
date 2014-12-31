/*
 * File         :   passport.js
 * Description  :   Configure the passport authentication handler.
 * ------------------------------------------------------------------------------------------------ */
module.exports = function (passport, LocalPassportStrategy) {
    "use strict";

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        // todo: get from db.
        done(null, { id : id, email : "a@b.c", frientlyName : "bob"});
    });

    passport.use('local-login',
        new LocalPassportStrategy({
            // override the passport default form posted field names.
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            if (email === "a@b.c" && password === "123") {
                // user successfully authenticated.
                done(null, { id : 1, email : email, friendlyName : "bob" });

                return;
            }

            done(null, false);
        }));

};
