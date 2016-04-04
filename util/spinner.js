/**
 * spinner.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */


var readline = require('readline');

var spinnerText = '|/-\\';
var current = 0;
var id;
var delay = 60;

/**
 * Start spinner
 */
function start() {
    id = setInterval(function() {
        clearLine();
        process.stdout.write(spinnerText[current]);
        current = ++current % spinnerText.length;
    }, delay);
}

/**
 * End spinner
 */
function stop () {
    clearInterval(id);
    clearLine();
}


function clearLine() {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
}

module.exports = {
    start: start,
    stop: stop
};