'use strict';

const Config = require('getconfig');

module.exports = Config.db;
module.exports[Config.getconfig.env] = Config.db;