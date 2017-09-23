/**
 * PolicyGenerator.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2017, QuorraJS.
 * @license See LICENSE.txt
 */

var helper = require('../util/helper');
var logger = require('../util/logger');
var path = require('path');
var _ = require('lodash');
var endOfLine = require('os').EOL;
var fs = require('fs-extra');

function PolicyGenerator() {
    /**
     * The default policy methods.
     *
     * @var {Array}
     * @protected
     */
    this.__defaults = [
        'view',
        'create',
        'update',
        'delete'
    ];
}

/**
 * Create a new policy class file.
 *
 * @param  {string} policy
 * @param  {string} appPath
 * @param  {string} generatePath
 * @param  {Array}  options
 * @param  {function}  callback
 * @return {void}
 */
PolicyGenerator.prototype.make = function(policy, appPath, generatePath, options, callback) {
    this.__getPolicy(policy, appPath, generatePath, function(policyStub) {
        this.__addMethods(policy, policyStub, options, function(stub) {
            this.__writeFile(stub, policy, generatePath, callback);
        }.bind(this));
    }.bind(this));
};

/**
 * Get the policy class stub.
 *
 * @param  {string} policy
 * @param  {string} appPath
 * @param  {string} generatePath
 * @param  {function} callback
 */
PolicyGenerator.prototype.__getPolicy = function(policy, appPath, generatePath, callback) {
    helper.readFile(path.join(__dirname, 'stubs/policy.stub'), function(stub) {
        stub = stub.replace(/\{\{policy\}\}/g, policy);
        callback(stub);
    });
};

/**
 * Add the method stubs to the policy if options contains model name.
 *
 * @param  {string} policy
 * @param  {string} stub
 * @param  {Array}  options
 * @param  {function}  callback
 */
PolicyGenerator.prototype.__addMethods = function(policy, stub, options, callback) {
    var methods = '';

    if(options.model && options.model.length) {
        // Once we have the applicable methods, we can just spin through those methods
        // and add each one to our array of method stubs. Then we will implode
        // them all with end-of-line characters and return the final joined list.
        var stubs = this.__getMethodStubs(policy, options, callback);

        methods = endOfLine + stubs.join(endOfLine);
    }

    stub = stub.replace('{{methods}}', methods);

    callback(stub);
};

/**
 * Get all of the method stubs for the given options.
 *
 * @param  {Array} policy
 * @param  {Array} options
 * @param  {function} callback
 */
PolicyGenerator.prototype.__getMethodStubs = function(policy, options, callback) {
    var stubs = [];

    // Each stub is conveniently kept in its own file so we can just grab the ones
    // we need from disk to build the policy file. Once we have them all in
    // an array we will return this list of methods so they can be joined up.
    this.__getMethods(options).forEach(function(method) {
        var stub = helper.readFileSync(path.join(__dirname, 'stubs/'+method+'.stub'));
        stub = stub.replace(/\{\{policy\}\}/g, policy);
        stub = stub.replace(/\{\{dummyModel\}\}/g, options.model);
        stub = stub.replace(/\{\{dummyPluralModel\}\}/g, options.pluralModel);

        stubs.push(stub);
    });

    return stubs;
};

/**
 * Get the applicable methods based on the options.
 *
 * @param  {Object} options
 * @return {Array}
 */
PolicyGenerator.prototype.__getMethods = function(options) {
    if (options.only && options.only.length>0) {
        return _.intersection(options.only, this.__defaults);
    }
    else if (options.except && options.except.length>0) {
        return _.difference(this.__defaults, options.except);
    }

    return this.__defaults;
};

/**
 * Write the completed stub to disk.
 *
 * @param {string} stub
 * @param {string} policy
 * @param {string} generatePath
 * @param {function} callback
 * @return {void}
 */
PolicyGenerator.prototype.__writeFile = function(stub, policy, generatePath, callback) {
    fs.mkdirp(generatePath, function(err){
        if(err) {
            logger.error('\nError writing policy file to disk.\n');

            process.exit(1);
        }

        var file = path.join(generatePath, policy + '.js');

        fs.exists(file, function(exists){
            if(!exists) {
                helper.writeFile(file, stub, callback);
            } else {
                logger.error('\nPolicy already exists.\n');

                process.exit(1);
            }
        });
    });
};

module.exports = PolicyGenerator;