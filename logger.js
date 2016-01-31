#!/usr/bin/env node

/**
 * logger.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2016, Harish Anchu. All rights reserved.
 * @license Licensed under MIT
 */
var colors = require('colors');

var logger = {
    info: function (string) {
        console.info(string.green);
    },

    line: function (string) {
        console.log(string);
    },

    warn: function (string) {
        console.error(string.yellow);
    },

    error: function (string) {
        console.error(string.red);
    }
};

module.exports = logger;
