#!/usr/bin/env node

/**
 * quorra.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2016, Harish Anchu. All rights reserved.
 * @license Licensed under MIT
 */

var program = require('commander');
var packageInfo = require('./package.json');


//$ quorra -v
//$ quorra --version

program
    .version('Quorra CLI version: '+packageInfo.version, '-v, --version');

//$ quorra new <appname> [version]

program
    .command('new <path_to_new_app> [version]')
    .description('Create a new Quorra application')
    .action(require('./quorraNew'));

//$ quorra ride

program
    .command('ride')
    .description('Serve the application on the NodeJs server')
    .action(require('./quorraRide'));

program.parse(process.argv);
