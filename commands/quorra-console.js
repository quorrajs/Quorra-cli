#!/usr/bin/env node

/**
 * quorra-console.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */

var path = require('path');
var repl = require('repl');
var logger = require('../util/logger');
var helper = require('../util/helper');

function quorraConsole() {
    var appPath = process.cwd();

    helper.verifyApplicationDoesExist(appPath);

    logger.info('\r\nStarting app in interactive mode...');

    helper.boot(appPath, function (app) {
        app.listen(function (server) {
            logger.info('\r\nWelcome to the Quorra console.');
            logger.note('( to exit, type <CTRL>+<C> )\r\n');

            repl.start({
                prompt: 'quorra> '
            }).on('exit', function(err) {
                if (err) {
                    logger.error(err);

                    return app.close(function () {
                        process.exit(1);
                    });
                }

                app.close(function () {
                    process.exit(0);
                });
            });
        });
    });
}

module.exports = quorraConsole;
