#!/usr/bin/env node

/**
 * quorra-command.js
 *
 * @author: Danilo Polani <danilo.polani@gmail.com>
 * @copyright Copyright (c) 2015-2017, QuorraJS.
 * @license See LICENSE.txt
 */

const path = require('path');
const logger = require('../util/logger');
const helper = require('../util/helper');

function quorraCommand(commandName, self) {
    const appPath = process.cwd();
    const argv = process.argv;
    commandName = commandName[0];

    // Verify application
    helper.verifyApplicationDoesExist(appPath);

    // First check if it's a user command
    helper.boot(appPath, function(app) {
        const Command = app.command;
        const enabledCommands = require(path.join(app.path.app, 'console', 'kernel')).commands;

        // Check if command exists
        let commandFound = false;
        enabledCommands.some(cmd => {
            let signature = new (require(path.join(app.path.base, cmd)))().signature;
            if (typeof signature !== 'undefined' && signature.split(' ')[0] == commandName) {
                commandFound = true;
                return true;
            }
        });
        if (!commandFound) {
            return self.help();
        }

        // Find index of the user command to trim the array for the user inputs
        let cmdIndex = false;
        argv.some((name, index) => {
            if (name == commandName) {
                cmdIndex = index;
                return;
            }
        });
        const userArgv = argv.splice(cmdIndex + 1);

        // Execute command
        try {
            Command.run(commandName, {}, userArgv);
        } catch (err) {
            logger.error(err.toString());
        }
    });
}

module.exports = quorraCommand;
