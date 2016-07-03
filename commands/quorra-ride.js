#!/usr/bin/env node

/**
 * quorra-ride.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */

var path = require('path');
var logger = require('../util/logger');
var helper = require('../util/helper');
var Watcher = require('../util/Watcher');

function quorraRide(options) {
    var appPath = process.cwd();

    helper.verifyApplicationDoesExist(appPath);

    logger.success('\r\nStarting app...');

    ride(appPath, options.watch);
}

function ride(appPath, watch) {
    helper.boot(appPath, function (app) {
        app.listen(function (server) {
            if(watch) {
                (new Watcher(app, app.config.get('watch'), app.path.base)).watch();
            }
        });
    });
}

module.exports = quorraRide;
