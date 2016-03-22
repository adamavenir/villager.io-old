'use strict';

const Slug = require('slug');

module.exports = {

    description: 'Create a Place',
    handler: function (request, reply) {
        // console.log(request.payload)
        // console.log('request.payload.name', request.payload.name)
        const now = new Date();
        // what's up with the `${}` below?
        const slug = `${Slug(request.payload.name, { lower: true })}`;
        // const slug = Slug(request.payload.name, { lower: true });
        const payload = Object.assign({}, request.payload, { slug : slug });

        const result = this.db.places.insert(payload).then((place) => {
            return request.generateResponse(place).code(201);
        })

        return reply(result);

    }
}
