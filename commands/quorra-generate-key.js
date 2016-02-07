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

        getKeyFile(function(pathAndContents){
            var key = getRandomKey();

            pathAndContents.contents = pathAndContents.contents.replace(config.get('app').key, key) ;

            updateFile(pathAndContents, function() {
                logger.info("\nApplication key ["+ key +"] set successfully.\n");
            });
        });
    });
}

/**
 * Get the key file and contents.
 * @param {function} callback
 * @return {object}
 */
function getKeyFile(callback) {
    var filePath = path.join(ref.app.path.app,'config',  ref.app.environment(), 'app.js');
    if(!fs.existsSync(path)) {
        filePath = path.join(ref.app.path.app, 'config', 'app.js');
    }

    fs.readFile(filePath, 'utf8', function(err, data){
        if(err) {
            logger.error('\nError reading configuration file at '+filePath+'\n');

            process.exit(1);
        }

        callback({
            path: filePath,
            contents: data
        });
    })
}

/**
 * Write contents to the file as given path
 *
 * @param {object} pathAndContents
 * @param {function} callback
 */
function updateFile(pathAndContents, callback) {
    fs.writeFile(pathAndContents.path, pathAndContents.contents, 'utf8', function(err) {
        if(err) {
            logger.error('\nError writing configuration file to '+pathAndContents.path+'\n');

            process.exit(1);
        }

        callback();
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