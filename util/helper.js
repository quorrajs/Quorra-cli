/**
 * helper.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */

var path = require('path');
var fs = require('fs');
var logger = require('./logger');

var helper = {
    verifyApplicationDoesExist: function(appPath) {
        // when no package.json file
        if (!fs.existsSync(path.join(appPath, 'package.json'))) {
            logger.warn('\r\nCannot read package.json in the current directory (' + appPath + ')');
            logger.warn('Are you sure this is a Quorra app?\r\n');

            process.exit(1);
        }

        var packageInfo = require(path.join(appPath, 'package.json'));

        // when not a Quorra app
        if (!(packageInfo.dependencies && packageInfo.dependencies.positron)) {
            logger.warn('\r\nThe package.json in the current directory does not looks like Quorra app\'s...');
            logger.warn('Are you sure `' + process.cwd() + '` is a Quorra app?\r\n');

            process.exit(1);
        }
    }
};

module.exports = helper;