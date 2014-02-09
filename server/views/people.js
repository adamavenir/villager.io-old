var User = require('../models/User');
var _ = require('underscore');

module.exports = function people(server) {

  var Passport = server.plugins.travelogue.passport;

  addPerson = function (request, reply) {
    reply.view('addPerson', { 
      user : request.session.user, 
      moderator : request.session.moderator, 
      admin : request.session.admin
    });
  };

  createPerson = function (request, reply) {
    var form = request.payload;
    var p = User.create({
      fullName  : form.fullName,
      email     : form.email,
      twitter   : form.twitter,
      site      : form.site,
      company   : form.company,
      bio       : form.bio
    });
    p.save(function (err) {
      User.load(p.key, function (err, person) {
        reply().code(201).redirect('/people/' + p.slug);
      })
    });
  };

  getPerson = function (request, reply) {
    User.getByIndex('slug', request.params.person, function(err, value) {
      if (err) {
        reply.view('404');
      }
      else {
        if (Array.isArray(value) && value.length === 1) { value = value[0] };
        reply.view('person', { person : value, user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });
      }
    });
  };

  listPeople = function (request, reply) {
    User.all(function(err, data) {
      var approved = _.where(data, { approved: true });
      if(approved.length === 0) {
        reply.view('noPeople');
      }
      else {
        reply.view('listPeople', { people : approved, user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });  
      }
    });
  };

  deletePerson = function (request, reply) {
    if (request.session.moderator) {
      User.delete(request.params.person, callback);
      var callback = reply.view('deleted').redirect('/people');
    }
    else { reply().code(401).redirect('/'); }
  };

};