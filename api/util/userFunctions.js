'use strict';

const Boom = require('boom');
const User = require('../model/User');
const bcrypt = require('bcrypt');

function verifyUniqueUser(request, reply) {
  // Find an entry from the database that
  // matches either the email or username
  User.findOne({
    $or: [
      { email: request.payload.email },
      { username: request.payload.username }
    ]
  }, (err, user) => {
    // Check whether the username or email
    // is already taken and error out if so
    if (user) {
      if (user.username === request.payload.username) {
        reply(Boom.badRequest('Username taken'));
      }
      if (user.email === request.payload.email) {
        reply(Boom.badRequest('Email taken'));
      }
    }
    // If everything checks out, send the payload through
    // to the route handler
    reply(request.payload);
  });
}

function verifyCredentials(request, reply) {

  const password = request.payload.password;

  // Find an entry from the database that
  // matches either the email or username
  User.findOne({
    $or: [
      { email: request.payload.email },
      { username: request.payload.username }
    ]
  }, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (isValid) {
          reply(user);
        }
        else {
          reply(Boom.badRequest('Incorrect password!'));
        }
      });
    } else {
      reply(Boom.badRequest('Incorrect username or email!'));
    }
  });
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser,
  verifyCredentials: verifyCredentials
}
