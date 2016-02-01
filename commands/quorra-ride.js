#!/usr/bin/env node

/**
 * quorra-ride.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright (c) 2015-2016, Harish Anchu.
 * @license Licensed under MIT
 */

var path = require('path');
var fs = require('fs');
var logger = require('../logger');

function quorraRide() {
    var appPath = process.cwd();

    logger.info('\r\nStarting app...\r\n');

    verifyApplicationDoesExist(appPath);

    require(path.join(appPath, 'index.js'));
}

function verifyApplicationDoesExist(appPath) {
    // when no package.json file
    if (!fs.existsSync(path.join(appPath, 'package.json'))) {
        logger.warn('Cannot read package.json in the current directory (' + appPath + ')');
        logger.warn('Are you sure this is a Quorra app?\r\n');

        process.exit(1);
    }

    var packageInfo = require(path.join(appPath, 'package.json'));

    // when not a Quorra app
    if (!(packageInfo.dependencies && packageInfo.dependencies.positron)) {
        logger.warn('The package.json in the current directory does not looks like Quorra app\'s...');
        logger.warn('Are you sure `' + process.cwd() + '` is a Quorra app?\r\n');

        process.exit(1);
    }
}

module.exports = quorraRide;
