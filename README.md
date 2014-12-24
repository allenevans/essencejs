essence.js
==========

About
-----
Essence.js is a async dependency injection framework to help build loosely coupled Node.js applications.

###Why?
Creating loosely coupled applications helps to reduce complexity, improve code reusable and make your code more testable.

Install
-------
    TODO

Getting Started
---------------
    // require the EssenceJs class.
    var EssenceJs = require("essencejs").EssenceJs;

    // create a new instance of EssenceJs.
    var essence = new EssenceJs();

    // ALTERNATIVELY - to do the same in a single line:
    var essence = new (require("essencejs").EssenceJs)();

    // add objects to the essence js container
    essence.register("message", { text : "thingy bobs" });

    // add singleton
    var Start = function Start() { this.startedAt = new Date(); };
    essence.singleton(Start);

    // add factory
    var Random = function Random() { this.random = Math.round(Math.random() * 1000); }
    essence.factory(Random);

    // inject dependencies of a function
    essence.inject(function (message, start, random) {
        console.log(message.text,
            "was started at",
            start.startedAt.toLocaleString() + ".",
            "Here is a random number between 0 - 1000 : ",
            random.random);
    });

    // this returns the console message
        `thingy bobs was started at Mon Dec 22 2014 19:38:53 GMT+0000 (GMT). Here is a random number between 0 - 1000 :  905`

    // calling this same inject function again will return
        `thingy bobs was started at Mon Dec 22 2014 19:38:53 GMT+0000 (GMT). Here is a random number between 0 - 1000 :  323`

    // the start time will always remain the same for the duration of the node process because it is a singleton.
    // the random value will change because a new factory instance is injected every time it is needed.

Examples
--------
    TODO
In the meantime, take a look at the tests to get an idea of how essence.js will work.

Testing
-------
To run the nodeunit tests, use:

    npm test