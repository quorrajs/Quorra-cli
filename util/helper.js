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
    /**
     * Check whether quorra application exists in specified location.
     *
     * @param appPath
     */
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
    },

    /**
     * Load the Quorra application
     *
     * @return {void}
     */
    boot: function(appPath, callback) {
        require(path.join(appPath , 'bootstrap/start'))(callback);
    },

    /**
     * Read the file and contents.
     *
     * @param {string} filePath
     * @param {function} callback
     * @return {object}
     */
    readFile: function(filePath, callback) {
        fs.readFile(filePath, 'utf8', function(err, data){
            if(err) {
                logger.error('\nError reading file at '+filePath+'\n');

                process.exit(1);
            }

            callback(data);
        })
    },

    /**
     * Get the file and contents synchronously.
     *
     * @param {string} filePath
     * @return {object}
     */
    readFileSync: function(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8')
        } catch(e) {
            logger.error('\nError reading file at '+filePath+'\n');

            process.exit(1);
        }
    },

    /**
     * Write contents to the file in given path
     *
     * @param {string} filePath
     * @param {string} contents
     * @param {function} callback
     */
    writeFile: function(filePath, contents, callback) {
        fs.writeFile(filePath, contents, 'utf8', function(err) {
            if(err) {
                logger.error('\nError writing file to '+pathAndContents.path+'\n');

                process.exit(1);
            }

            callback();
        });
    }
};

module.exports = helper;