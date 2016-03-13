'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  description: 'Fetches a Place',
  notes: 'Does the lookup by id',
  handler: function (request, reply) {
      
    const result = this.db.places.findOne(request.params).then((place) => {

      if (!place) {
        throw Boom.notFound();
      }

      return place;
    });

    return reply(result);
  }
};