var User = require('../models/User');
var Place = require('../models/Place');
var _ = require('underscore');

module.exports = function moderation(server) {

  var Passport = server.plugins.travelogue.passport;

  approvePerson = function (request, reply) {
    if (request.session.moderator) {
      User.update(request.params.person, { approved: true }, function (person) {
        console.log('approved:', request.params.person);
        reply().code(200).redirect('/people');
      })
    }
    else { reply().code(401).redirect('/'); }
  };

  approvePlace = function (request, reply) {
    if (request.session.moderator) {
      Place.update(request.params.place, { approved: true }, function (place) {
        console.log('approved:', request.params.place);
        reply().code(200).redirect('/places');
      })
    }
    else { reply().code(401).redirect('/'); }
  };

  adminPerson = function (request, reply) {
    if (request.session.admin) {
      User.update(request.params.person, { admin: true, moderator: true, approved: true }, function (person) {
        console.log('made admin:', request.params.person);
        reply().code(200).redirect('/people');
      })
    }
    else { reply().code(401).redirect('/'); }
  };

  moderatorPerson = function (request, reply) {
    if (request.session.admin) {
      User.update(request.params.person, { moderator: true, approved: true }, function (person) {
        console.log('made moderator:', request.params.person);
        reply().code(200).redirect('/people');
      })
    }
    else { reply().code(401).redirect('/'); }
  };

};