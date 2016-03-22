'use strict';

const Slug = require('slug');

module.exports = {
  description: 'Updates a Place',
  handler: function (request, reply) {

    const db = this.db;
    const now = new Date();
    
    const slug = `${Slug(request.payload.name, { lower: true })}`;
    const payload = Object.assign({}, request.payload, { slug : slug });

    reply(this.db.places.findOne({ id: payload.id }).then((place) => {

      if (place) {
        return db.places.updateOne({ id: place.id }, payload);

      }
      return db.places.insert(payload);
    }));
  }
};