var config = require('getconfig');

if (!config.DBPATH) {
    for (var item in process.env) {
        config[item] = process.env[item];
    }
}

module.exports = config;