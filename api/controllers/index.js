'use strict';

const Fs = require('fs');
const Path = require('path');

const internals = {};
internals.getControllers = function (base) {

  base = base || __dirname;
  const controllers = {};
  const files = Fs.readdirSync(base).filter((file) => file !== 'index.js');

  for (let i = 0, il = files.length; i < il; ++i) {
    const file = files[i];
    const path = Path.join(base, file);
    controllers[file.replace(/\.js$/, '')] = Fs.statSync(path).isDirectory() ? internals.getControllers(path) : require(path);
  }

  return controllers;
};

module.exports = internals.getControllers();