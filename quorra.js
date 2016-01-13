/**
 * quorra.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright 2016, Harish Anchu. All rights reserved.
 * @license Licensed under MIT
 */

var program = require('commander');

//$ quorra new <appname> [version]

program
    .command('new <path_to_new_app> [version]')
    .action(require('./quorraNew'));

program.parse(process.argv);