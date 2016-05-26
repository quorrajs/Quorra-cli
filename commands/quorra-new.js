#!/usr/bin/env node

/**
 * quorra-new.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */

var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;
var logger = require('../util/logger');
var spinner = require('../util/spinner');

function quorraNew(name, version) {
    var directory;

    spinner.start();
    verifyApplicationDoesntExist(directory = path.join(process.cwd(), name));

    version = version || 'latest';

    logger.info('\r\nCrafting application...\r\n');

    download(version, directory, function(err){
        if(err) {
            logger.error(err);
            spinner.stop();
            process.exit(1);
        } else {
            generateKey(directory, function(err){
                spinner.stop();

                if(err) {
                    logger.error(err);
                    process.exit(1);
                } else {
                    logger.info('Application ready! Build something amazing.\r\n');
                }
            })
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
    // Create directory
    fs.mkdirsSync(directory);
    fs.mkdirsSync(downloadPath);

    var cmd = 'npm install quorra@'+version;

    exec(cmd, {cwd: directory}, function(err) {
        if(err) {
            return callback(err.message)
        }

        createApp(directory, downloadPath, callback);
    });
}

/**
 * Structure Quorra application from downloaded quorra package.
 *
 * @param directory
 * @param downloadPath
 * @param callback
 */
function createApp(directory, downloadPath, callback) {
    var tempPath = path.join(directory, 'quorra_package_download');
    var frameworkPackage = 'quorra';

    try {
        var stats = fs.lstatSync(path.join(downloadPath, frameworkPackage, 'node_modules'));

        if (stats.isDirectory()) {
            fs.rename(downloadPath, tempPath, function (err) {
                if (err) {
                    return callback(err.message)
                }

                fs.copy(path.join(tempPath, frameworkPackage), directory, function (err) {
                    if (err) {
                        return callback(err.message);
                    }

                    fs.remove(tempPath);

                    createPackageFile(directory, callback);
                });
            });

            return ;
        }
    } catch (e) {
    }

    fs.copy(path.join(downloadPath, frameworkPackage), directory, function (err) {
        if (err) {
            return callback(err.message);
        }

        fs.remove(path.join(downloadPath, frameworkPackage));

        createPackageFile(directory, callback);
    });
}

/**
 * Create package file for new application and add quorra dependencies.
 *
 * @param directory
 * @param callback
 */
function createPackageFile(directory, callback) {
    var quorraPackageInfo = require(path.join(directory, 'package.json'));
    var appPackage = {
        "name": path.basename(directory),
        "version": "0.0.0",
        "description": "My QuorraJS Application",
        "scripts": {
            "start": "quorra ride"
        },
        "dependencies": quorraPackageInfo.dependencies
    };

    fs.writeFile(path.join(directory, 'package.json'), JSON.stringify(appPackage, null, 4), function (err) {
        if (err) {
            return callback(err.message);
        }

        callback();
    });
}

/**
 * Set application key
 *
 * @param {string} directory
 * @param {function} callback
 */
function generateKey(directory, callback) {
    exec('quorra generate-key', {cwd: directory}, function(err) {
        if(err) {
            return callback(err.message)
        }

        callback();
    });
}

module.exports = quorraNew;
