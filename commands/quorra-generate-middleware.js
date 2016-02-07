/**
 * quorra-generate-middleware.js
 *
 * @author: Harish Anchu <me@harishanchu.com>
 * Copyright (c) 2015, Wimoku Pvt Ltd. All rights reserved.
 */

var helper = require('../util/helper');
var logger = require('../util/logger');
var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');

var ref = {};

function generateMiddleware(name, options) {
    var appPath = process.cwd();

    helper.verifyApplicationDoesExist(appPath);

    helper.boot(appPath, function(app){
        ref.app = app;

        var generatePath = getPath(options.path);

        // Finally, we're ready to generate the actual middleware file on disk and let
        // the developer start using it.
        generate(name, generatePath, function(){
            logger.info('\nMiddleware created successfully!\n');
        });
    });
}

/**
 * Get the path in which to store the middleware.
 *
 * @return {string}
 */
function getPath(generatePath) {
    if(_.isString(generatePath) && generatePath) {
        generatePath = path.join(ref.app.path.base, generatePath)
    } else {
        generatePath = path.join(ref.app.path.app, 'middlewares')
    }

    return generatePath;
}

function generate(middleware, generatePath, callback) {
    helper.readFile(path.join(__dirname, '..', 'middleware-stub', 'middleware.stub'), function(stub) {
        stub = stub.replace(/\{\{middleware\}\}/g, middleware);

        writeFile(middleware, stub, generatePath, callback);
    });
}

function writeFile(middleware, stub, generatePath, callback) {
    fs.mkdirp(generatePath, function(err){
        if(err) {
            logger.error('\nError writing middleware file to disk.\n');

            process.exit(1);
        }

        var file = path.join(generatePath, middleware + '.js');

        fs.exists(file, function(exists){
            if(!exists) {
                helper.writeFile(file, stub, callback);
            } else {
                logger.error('\nMiddleware already exists.\n');

                process.exit(1);
            }
        });
    });
};

module.exports = generateMiddleware;