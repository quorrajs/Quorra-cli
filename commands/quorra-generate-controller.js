#!/usr/bin/env node

/**
 * quorra-generate-controller.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */

var helper = require('../util/helper');
var logger = require('../util/logger');
var _ = require('lodash');
var path = require('path');
var ControllerGenerator = require('../controller-generator/ControllerGenerator');

var ref = {};

function generateController(name, options) {
    var appPath = process.cwd();

    helper.verifyApplicationDoesExist(appPath);

    helper.boot(appPath, function(app){
        ref.app = app;

        var generatePath = getPath(options.path);

        options = getBuildOptions(options.only, options.except);

        // Finally, we're ready to generate the actual controller file on disk and let
        // the developer start using it. The controller will be stored in the right
        // place based on the namespace of this controller specified by commands.
        var generator = new ControllerGenerator();
        generator.make(name, app.path.app, generatePath, options, function(){
            logger.success('\nController created successfully!\n');
        });
    });
}

/**
 * Get the path in which to store the controller.
 *
 * @return {string}
 */
function getPath(generatePath) {
    if(_.isString(generatePath) && generatePath) {
        generatePath = path.join(ref.app.path.base, generatePath)
    } else {
        generatePath = path.join(ref.app.path.app, 'controllers')
    }

    return generatePath;
}

/**
 * Get the options for controller generation.
 *
 * @param {string|function} only
 * @param {string|function} except
 * @return {{only: (Array), except: (Array)}}
 */
function getBuildOptions(only, except)
{
    return {
        only: _.isString(only)?only.split(','):[],

        except: _.isString(except)?except.split(','):[]
    }
}

module.exports = generateController;