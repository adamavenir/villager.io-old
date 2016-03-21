'use strict';

const bcrypt = require('bcrypt');
const Slug = require('slug');
// const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;
const createToken = require('../../util/token');

function hashPassword(password, cb) {
  // Generate a salt at level 10 strength
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return cb(err, hash);
    });
  });
}

module.exports = {

    description: 'Create a Place',
    handler: function (request, reply) {

        user.email = request.payload.email;
        user.username = request.payload.username;
        user.admin = false;

        hashPassword(request.payload.password, (err, hash) => {

          if (err) { throw err; }
          user.password = hash;

          const result = this.db.users.insert(payload).then((err, user) => {
              if (err) {
                throw err;
              }
              // If the user is saved successfully, issue a JWT
              reply({ id_token: createToken(user) }).code(201);
          });

        });

        return reply(result);

    },
    // pre: [
    //   { method: verifyUniqueUser, assign: 'user' }
    // ]
}
