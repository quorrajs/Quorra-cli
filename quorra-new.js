#!/usr/bin/env node

/**
 * quorra-new.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright (c) 2015-2016, Harish Anchu.
 * @license Licensed under MIT
 */

var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;
var logger = require('./logger');

function quorraNew(name, version) {
    require('colors');

    var directory;

    verifyApplicationDoesntExist(directory = path.join(process.cwd(), name));

    version = version || 'latest';

    logger.info('\r\nCrafting application...\r\n');

    download(version, directory, function(err){
        if(err) {
            logger.error(err);
            process.exit(1);
        } else {
            logger.info('Application ready! Build something amazing.\r\n');
        }
    });

}

/**
 * Verify that the application does not already exist.
 *
 * @param  {String}  directory
 * @return {void}
 */
function verifyApplicationDoesntExist(directory) {
    try {
        // Query the entry
        var stats = fs.lstatSync(directory);

        // Is it a directory?
        if (stats.isDirectory()) {
            logger.error('\r\nApplication already exists!\r\n');
            process.exit(1);
        }
    }
    catch (e) {
    }
}

/**
 * Download the package.
 *
 * @param  {String}  version
 * @param  {String}  directory
 * @param  {function}  callback
 * @return {void}
 */

function download(version, directory, callback) {
    var downloadPath = path.join(directory, 'node_modules');
    var tempPath = path.join(directory, 'quorra_package_download');
    var frameworkPckage = 'quorra';
    // Create directory
    fs.mkdirsSync(directory);
    fs.mkdirsSync(downloadPath);

    var cmd = 'npm install '+ frameworkPckage +'@'+version;

    exec(cmd, {cwd: directory}, function(err) {
        if(err) {
            return callback(err)
        }

        fs.rename(downloadPath, tempPath, function(err){
            if(err) {
                return callback(err)
            }

            fs.copy(path.join(tempPath, frameworkPckage), directory, function (err) {
                if (err) {
                    return callback(err);
                }

                fs.remove(tempPath);

                callback()
            })
        });
    });
}

module.exports = quorraNew;
