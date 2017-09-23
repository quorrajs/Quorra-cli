#!/usr/bin/env node

/**
 * quorra-generate-policy.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2017, QuorraJS.
 * @license See LICENSE.txt
 */

var helper = require('../util/helper');
var logger = require('../util/logger');
var _ = require('lodash');
var path = require('path');
var pluralize = require('pluralize');
var PolicyGenerator = require('../policy-generator/PolicyGenerator');

var ref = {};

function generatePolicy(name, options) {
    var appPath = process.cwd();

    helper.verifyApplicationDoesExist(appPath);

    helper.boot(appPath, function(app){
        ref.app = app;

        var generatePath = getPath(options.path);

        options = getBuildOptions(options.model, options.only, options.except);

        // Finally, we're ready to generate the actual policy file on disk and let
        // the developer start using it. The policy will be stored in the right
        // place based on the namespace of this policy specified by commands.
        var generator = new PolicyGenerator();
        generator.make(name, app.path.app, generatePath, options, function(){
            logger.success('\nPolicy created successfully!\n');
        });
    });
}

/**
 * Get the path in which to store the policy.
 *
 * @return {string}
 */
function getPath(generatePath) {
    if(_.isString(generatePath) && generatePath) {
        generatePath = path.join(ref.app.path.base, generatePath)
    } else {
        generatePath = path.join(ref.app.path.app, 'policies')
    }

    return generatePath;
}

/**
 * Get the options for policy generation.
 *
 * @param {string|function} model
 * @param {string|function} only
 * @param {string|function} except
 * @return {{only: (Array), except: (Array)}}
 */
function getBuildOptions(model, only, except) {
    var pluralModel;
    if(model && model.length) {
        model = model.charAt(0).toLowerCase() + model.slice(1);
        pluralModel = pluralize(model, 2)
    }

    return {
        model: model,

        pluralModel: pluralModel,

        only: _.isString(only)?only.split(','):[],

        except: _.isString(except)?except.split(','):[]
    }
}

module.exports = generatePolicy;