#!/usr/bin/env node

/**
 * quorra-generate-key.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */

var helper = require('../util/helper');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var logger = require('../util/logger');

var ref = {};

function generateKey() {
    var appPath = process.cwd();

    helper.verifyApplicationDoesExist(appPath);

    helper.boot(appPath, function(app){
        var config = app.config;
        ref.app = app;


        var filePath = path.join(ref.app.path.app,'config',  ref.app.environment(), 'app.js');
        if(!fs.existsSync(path)) {
            filePath = path.join(ref.app.path.app, 'config', 'app.js');
        }

        helper.readFile(filePath, function(contents){
            var key = getRandomKey();

            contents = contents.replace(config.get('app').key, key) ;

            helper.writeFile(filePath, contents, function() {
                logger.success("\nApplication key ["+ key +"] set successfully.\n");
            });
        });
    });
}

/**
 * Generate a random key for the application.
 *
 * @return {string}
 */
function getRandomKey()
{
    return crypto.randomBytes(16).toString('hex');
}
module.exports = generateKey;