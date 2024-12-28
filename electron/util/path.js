const path = require('node:path');
const main = require('../main');

const pathData = {
    'sensitive': getPathTo('/data/sensitive.json'),
    'session': getPathTo('/data/session.json'),
    'settings': getPathTo('/data/settings.json'),
    'defaultSettings': getPathTo('/data/defaultSettings.json'),
};

const pathPreloads = {
    'preloadService': getPathTo('/preloads/preloadService.js')
};

/**
 * @param {String} dest The partial file path. 
 * @returns {String} The absolute file path.
 */
function getPathTo(dest) {
    return path.normalize(
        path.join( main.__basename, dest)
    );
}

module.exports = {
    pathData,
    pathPreloads
};