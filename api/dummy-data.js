'use strict';

const Config = require('getconfig');
const Muckraker = require('muckraker');
const Joi = require('joi');

const nTimes = (n, fn) => {

  return Promise.all(Array.from(new Array(n)).map(fn));
};

const log = {
  check(msg) {

    console.log(`\n🚩 ${msg}`);
  },
  action(msg) {

    console.log(`  🔨  ${msg}`);
  },
  error(msg) {

    console.log(`  ❌  ${msg}`);
  },
  success(msg) {

    console.log(`  ✅  ${msg}`);
  }
};

const UUID = process.argv[2];
const isGuid = (uuid) => Joi.validate(uuid, Joi.string().guid().required()).value;

new Muckraker(Config.db).connect().then((db) => {

})
.catch((err) => console.error(err, err.stack))
.then(() => process.exit());
