/**
 * Watcher.js
 *
 * @author: Harish Anchu <harishanchu@gmail.com>
 * @copyright Copyright (c) 2015-2016, QuorraJS.
 * @license See LICENSE.txt
 */

var path = require('path');
var chokidar = require('chokidar');
var _ = require('lodash');
var helper = require('../util/helper');
var logger = require('../util/logger');

function Watcher(app, config, appPath) {
    /**
     * Quorra application instance
     *
     * @var {Object}
     * @protected
     */
    this.__app = app;

    /**
     * Watch configuration
     *
     * @var {Object}
     * @protected
     */
    this.__config = _.merge({
        cwd: appPath,
        // Ignore the initial "add" events which are
        // generated when Chokidar starts watching files
        ignoreInitial: true
    }, config);

    /**
     * Application root path
     *
     * @var {String}
     * @protected
     */
    this.__appPath = appPath;
}

/**
 * Watch for Quorra application file changes and reboot
 */
Watcher.prototype.watch = function() {
    chokidar
        .watch(this.__config.dirs, _.omit(this.__config, ['dirs']))
        .on('all', _.debounce(this.hotReloadQuorra.bind(this), 300));

    logger.line("Watching: ", JSON.stringify(this.__config.dirs), "for changes.");
};

/**
 * Hot reload Quorra application
 */
Watcher.prototype.hotReloadQuorra = function () {
    var self = this;

    logger.info('Detected API change -- Rebooting Quorra');

    this.__clearRequireCache();

    // Tear down waterline models since it will be recreated during
    // Quorra application re-boot
    self.__app.modelFactory.teardown(function(err) {
        if(err) {
            logger.err('Failed to tear down waterline adapters.');
            logger.err(err);

            return process.exit(1);
        }

        // Reset the Quorra application before re-boot
        self.__app.resetForReboot();

        // Re-boot the Quorra application
        helper.boot(self.__appPath, function () {
            logger.success('Hot reboot success');
        });
    });
};

/**
 * Clear app's cached files from require.cache
 *
 * @protected
 */
Watcher.prototype.__clearRequireCache = function() {
    Object.keys(require.cache)
        .filter(function (item) {
            return !~item.indexOf('node_modules')
        })
        .forEach(function (module) {
            delete require.cache[module];
        });
};

module.exports = Watcher;