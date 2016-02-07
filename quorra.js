#!/usr/bin/env node

/**
 * quorra.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright (c) 2015-2016, Harish Anchu.
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
    .action(require('./commands/quorra-new'));

//$ quorra ride [--env environment]

program
    .command('ride')
    .description('Serve the application on the NodeJs server')
    .option('--env <environment>', 'Custom application environment')
    .action(require('./commands/quorra-ride'));

//$ quorra routes

program
    .command('routes')
    .description('List all registered routes')
    .option('--name <name>', 'Filter the routes by name')
    .option('--path <path>', 'Filter the routes by path')
    .action(require('./commands/quorra-routes'));

//$ quorra generate-key

program
    .command('generate-key')
    .description('Set the application key')
    .action(require('./commands/quorra-generate-key'));

program.parse(process.argv);
