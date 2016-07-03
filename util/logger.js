#!/usr/bin/env node

/**
 * logger.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright (c) 2015-2016, Harish Anchu.
 * @license Licensed under MIT
 */

var colors = require('colors');

var logger = {
    info: function (string) {
        console.info(string.blue);
    },

    success: function (string) {
        console.info(string.green);
    },

    note: function (string) {
        console.info(string.grey);
    },

    line: function () {
        console.log.apply(console, arguments)
    },

    warn: function (string) {
        console.error(string.yellow);
    },

    error: function (string) {
        console.error(string.red);
    }
};

module.exports = logger;
