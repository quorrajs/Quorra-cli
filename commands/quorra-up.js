#!/usr/bin/env node

/**
 * quorra-up.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */

var helper = require('../util/helper');
var fs = require('fs');
var logger = require('../util/logger');
var path = require('path');

function up() {
    var appPath = process.cwd();

    helper.verifyApplicationDoesExist(appPath);

    helper.boot(appPath, function(app){
        fs.unlink(path.join(app.path.storage, 'meta', 'down'), function(err){
            if(err) {
                if(err.code === 'ENOENT') {
                    logger.info('\nApplication is now live.\n');
                } else {
                    logger.error('\nUnable to delete file: ' + path.join(app.path.storage, 'meta', 'down') + '\n');
                }
            } else {
                logger.info('\nApplication is now live.\n');
            }
        })
    });
}

module.exports = up;