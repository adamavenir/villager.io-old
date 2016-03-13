'use strict';

const Joi = require('joi');

module.exports = {
  description: 'Deletes a Place',
  handler: function (request, reply) {
      
    return reply(this.db.places.destroy(request.params));

  },
  validate: {
    params: {
      id: Joi.number().integer().min(0)
    }
  }
};