'use strict';

const Joi = require('joi');

module.exports = {
  description: 'Fetches all Places',
  handler: function (request, reply) {

    const params = Object.assign({}, request.query);

    return reply(this.db.places.page(params));
  },
  validate: {
    query: {
      limit: Joi.number().integer().min(1).max(100).default(100),
      offset: Joi.number().integer().min(0).default(0)
    }
  },
  auth: {
    strategy: 'token',
    mode: 'required'
  }
};
