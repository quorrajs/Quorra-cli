/**
 * quorra-down.js
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
        fs.open(path.join(app.path.storage, 'meta', 'down'), 'w', function(err){
            if(err) {
                logger.error('\nUnable to create file: ' + path.join(app.path.storage, 'meta', 'down') + '\n');
                logger.error('\n' + err.message + '\n');
            } else {
                logger.warn('\nApplication is now in maintenance mode.\n');
            }
        })
    });
}

module.exports = up;