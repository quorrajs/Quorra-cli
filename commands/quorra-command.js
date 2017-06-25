#!/usr/bin/env node

/**
 * quorra-command.js
 *
 * @author: Danilo Polani <danilo.polani@gmail.com>
 * @copyright Copyright (c) 2015-2017, QuorraJS.
 * @license See LICENSE.txt
 */

var path = require('path');
var logger = require('../util/logger');
var helper = require('../util/helper');

function quorraCommand(commandName, self) {
    var appPath = process.cwd();
    var argv = process.argv;
    commandName = commandName[0];

    // Verify application
    helper.verifyApplicationDoesExist(appPath);

    // First check if it's a user command
    helper.boot(appPath, function(app) {
        var Command = app.command;
        var enabledCommands = require(path.join(app.path.app, 'console', 'kernel')).commands;

        // Check if command exists
        var commandFound = false;
        enabledCommands.some(function (cmd) {
            var signature = new (require(path.join(app.path.base, cmd)))().signature;
            if (typeof signature !== 'undefined' && signature.split(' ')[0] == commandName) {
                commandFound = true;
                return true;
            }
        });
        if (!commandFound) {
            return self.help();
        }

        // Find index of the user command to trim the array for the user inputs
        var cmdIndex = false;
        argv.some(function (name, index) {
            if (name == commandName) {
                cmdIndex = index;
                return;
            }
        });
        var userArgv = argv.splice(cmdIndex + 1);

        // Execute command
        try {
            Command.run(commandName, {}, userArgv);
        } catch (err) {
            logger.error(err.toString());
        }
    });
}

module.exports = quorraCommand;
