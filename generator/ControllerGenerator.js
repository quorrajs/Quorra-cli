/**
 * ControllerGenerator.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */

var helper = require('../util/helper');
var logger = require('../util/logger');
var path = require('path');
var _ = require('lodash');
var endOfLine = require('os').EOL;
var fs = require('fs.extra');

function ControllerGenerator() {
    /**
     * The default resource controller methods.
     *
     * @var {Array}
     * @protected
     */
    this.__defaults = [
        'index',
        'create',
        'store',
        'show',
        'edit',
        'update',
        'destroy'
    ];
}

/**
 * Create a new resourceful controller file.
 *
 * @param  {string} controller
 * @param  {string} appPath
 * @param  {string} generatePath
 * @param  {Array}  options
 * @param  {function}  callback
 * @return {void}
 */
ControllerGenerator.prototype.make = function(controller, appPath, generatePath, options, callback) {
    this.__getController(controller, appPath, generatePath, function(controllerStub) {
        this.__addMethods(controllerStub, options, function(stub) {
            this.__writeFile(stub, controller, generatePath, callback);
        }.bind(this));
    }.bind(this));
};

/**
 * Get the controller class stub.
 *
 * @param  {string} controller
 * @param  {string} appPath
 * @param  {string} generatePath
 * @param  {function} callback
 */
ControllerGenerator.prototype.__getController = function(controller, appPath, generatePath, callback) {
    helper.readFile(path.join(__dirname, 'stubs/controller.stub'), function(stub) {
        stub = stub.replace(/\{\{controller\}\}/g, controller);

        var baseControllerRelativePath = path.relative(generatePath, path.join(appPath, 'controllers', 'BaseController.js'));

        if(baseControllerRelativePath == 'BaseController.js') {
            baseControllerRelativePath = './BaseController.js';
        }

        stub = stub.replace('{{BaseController}}', baseControllerRelativePath);
        callback(stub);
    });
};

/**
 * Add the method stubs to the controller.
 *
 * @param  {string} stub
 * @param  {Array}  options
 * @param  {function}  callback
 */
ControllerGenerator.prototype.__addMethods = function(stub, options, callback) {
    // Once we have the applicable methods, we can just spin through those methods
    // and add each one to our array of method stubs. Then we will implode
    // them all with end-of-line characters and return the final joined list.
    var stubs = this.__getMethodStubs(options, callback);

    var methods = stubs.join(endOfLine);

    callback(stub.replace('{{methods}}', methods));
};

/**
 * Get all of the method stubs for the given options.
 *
 * @param  {Array} options
 * @param  {function} callback
 */
ControllerGenerator.prototype.__getMethodStubs = function(options, callback) {
    var stubs = [];

    // Each stub is conveniently kept in its own file so we can just grab the ones
    // we need from disk to build the controller file. Once we have them all in
    // an array we will return this list of methods so they can be joined up.
    this.__getMethods(options).forEach(function(method) {
        stubs.push(helper.readFileSync(path.join(__dirname, 'stubs/'+method+'.stub')))
    });

    return stubs;
};

/**
 * Get the applicable methods based on the options.
 *
 * @param  {Object} options
 * @return {Array}
 */
ControllerGenerator.prototype.__getMethods = function(options) {
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
 * @param {string} controller
 * @param {string} generatePath
 * @param {function} callback
 * @return {void}
 */
ControllerGenerator.prototype.__writeFile = function(stub, controller, generatePath, callback) {
    fs.mkdirp(generatePath, function(err){
        if(err) {
            logger.error('\nError writing controller file to disk.\n');

            process.exit(1);
        }

        var file = path.join(generatePath, controller + '.js');

        fs.exists(file, function(exists){
            if(!exists) {
                helper.writeFile(file, stub, callback);
            } else {
                logger.error('\nController already exists.\n');

                process.exit(1);
            }
        });
    });
};

module.exports = ControllerGenerator;