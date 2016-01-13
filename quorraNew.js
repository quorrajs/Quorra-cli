/**
 * quorra-new.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2016, Harish Anchu. All rights reserved.
 * @license Licensed under MIT
 */

var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;

function quorraNew(name, version) {
    var directory;

    verifyApplicationDoesntExist(directory = path.join(process.cwd(), name));

    version = version || 'latest';

    console.info('Crafting application...');

    download(version, directory, function(err){
        if(err) {
            console.error(err);
            process.exit(1);
        } else {
            console.info('Application ready! Build something amazing.');
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
            console.error('Application already exists!');
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
