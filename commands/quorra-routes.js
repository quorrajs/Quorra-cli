/**
 * quorra-routes.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */

var path = require('path');
var logger = require('../util/logger');
var helper = require('../util/helper');
var _ = require('lodash');
var Table = require('cli-table2');

var ref = {};


function quorraRoutes(options) {
    var appPath = process.cwd();

    helper.verifyApplicationDoesExist(appPath);

    helper.boot(appPath, function(app){
        var router = app.router;
        var routes = router.getRoutes().getRoutes();
        ref.app = app;

        if (routes.length  === 0)
        {
            return logger.error("\nYour application doesn't have any routes.\n");
        } else {
            displayRoutes(getRoutes(routes, options));
        }
    });
}

/**
 * Compile the routes into a displayable format.
 *
 * @param {object} routes
 * @param {object} options
 * @return {Array}
 */
function getRoutes(routes, options) {
    var results = [];
    var routeInfo;

    routes.forEach(function(route) {
        if(routeInfo = getRouteInformation(route, options)) {
            results.push(routeInfo);
        }
    });

    return results;
}

/**
 * Get the route information for a given route.
 *
 * @param  {object} route
 * @param  {object} options
 * @return {Array}
 */
function getRouteInformation(route, options)
{
    var uri = route.methods().join('|') + ' ' + route.uri();

    return filterRoute({
        'host': route.domain(),
        'uri': uri,
        'name': route.getName(),
        'action': route.getActionName(),
        'before': getBeforeFilters(route)
    }, options);
}

/**
 * Get before filters
 *
 * @param  {object} route
 * @return {string}
 */
function getBeforeFilters(route) {
    var before = Object.keys(route.beforeFilters());

    before = _.uniq(_.merge(before, getPatternFilters(route)));

    return before.join(',');
}

/**
 * Get all of the pattern filters matching the route.
 *
 * @param  {object} route
 * @return array
 */
function getPatternFilters(route) {
    var patterns = [];

    route.methods().forEach(function(method) {
        // For each method supported by the route we will need to gather up the patterned
        // filters for that method. We will then merge these in with the other filters
        // we have already gathered up then return them back out to these consumers.
        var inner = getMethodPatterns(route.uri(), method);

        patterns = patterns.concat(Object.keys(inner));
    });

    return patterns;
}

/**
 * Get the pattern filters for a given URI and method.
 *
 * @param  {string} uri
 * @param  {string} method
 * @return array
 */
function getMethodPatterns(uri, method) {
    return ref.app.getFilterer().findPatternFilters({path: uri, method: method});
}

/**
* Filter the route by URI and / or name.
*
* @param  {Object} route
* @param  {Object} options
* @return {Object|null}
*/
function filterRoute(route, options) {
    if ((_.isString(options.name) && (!route.name || route.name.indexOf(options.name) === -1)) ||
        (_.isString(options.path) && (!route.uri || route.uri.indexOf(options.path) === -1))) {
        return null;
    }

    return route;
}

/**
 * Display the route information on the console.
 *
 * @param  {Array} routes
 * @return {void}
 */
function displayRoutes(routes) {
    var table = new Table({
        head: ['Domain', 'URI', 'Name', 'Action', 'Before Filters'],
        style: { head: ['green'] }
    });

    routes.forEach(function(route){
        table.push(Object.keys(route).map(function(key){ return route[key]; }));
    });

    logger.line(table.toString())
}

module.exports = quorraRoutes;
