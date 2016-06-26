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
var argv = process.argv;

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
    .option('--port <port>', 'Custom application port')
    .action(require('./commands/quorra-ride'));

//$ quorra console

program
    .command('console')
    .description('Serve the application on the NodeJs server in interactive mode')
    .option('--env <environment>', 'Custom application environment')
    .option('--port <port>', 'Custom application port')
    .action(require('./commands/quorra-console'));

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

//$ quorra generate-controller <name>

program
    .command('generate-controller <name>')
    .description('Create a new resourceful controller')
    .option('--only <only>', 'The methods that should be included')
    .option('--except <except>', 'The methods that should be excluded')
    .option('--path <path>', 'Where to place the controller')
    .action(require('./commands/quorra-generate-controller'));

//$ quorra generate-middleware <name>

program
    .command('generate-middleware <name>')
    .description('Create a new middleware')
    .option('--path <path>', 'Where to place the middleware')
    .action(require('./commands/quorra-generate-middleware'));


//$ quorra up

program
    .command('up')
    .description('Bring the application out of maintenance mode')
    .action(require('./commands/quorra-up'));

//$ quorra down

program
    .command('down')
    .description('Put the application into maintenance mode')
    .action(require('./commands/quorra-down'));

//$ quorra <unknown command>
// Show help on unknown commands
program
    .on('*', function (userCommand) {
        this.help();
    });

program.parse(argv);

//$ quorra
// If no command specified
if (program.args.length === 0) {
    // display help
    program.help();
}
