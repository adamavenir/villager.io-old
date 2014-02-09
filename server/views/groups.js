var Group = require('../models/Group');
var _ = require('underscore');

module.exports = function groups(server) {

  var Passport = server.plugins.travelogue.passport;

  formGroup = function (request, reply) {
    reply.view('formGroup');
  };

  createGroup = function (request, reply) {
    var form = request.payload;
    var g = Group.create({
      type    : form.type,
      name    : form.name,
      address : form.address,
      city    : form.city,
      image   : form.image,
      twitter : form.twitter,
      website : form.website,
      about   : form.about
    });
    g.save(function (err) {
      Group.load(g.key, function (err, group) {
        reply().code(201).redirect('/groups/' + p.slug);
      })
    });
  };

  getGroup = function (request, reply) {
    Group.getByIndex('slug', request.params.group, function(err, value) {
      if (err) {
        reply.view('404');
      }
      else {
        if (Array.isArray(value) && value.length === 1) { value = value[0] };
        reply.view('group', { group : value, user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });
      }
    });
  };

  listGroups = function (request, reply) {
    Group.all(function(err, data) {
      var approved = _.where(data, { approved: true });
      if(approved.length === 0) {
        reply.view('noGroups', { user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });
      }
      else {
        reply.view('listGroups', { groups : approved });
      }
    });
  };

  deleteGroup = function (request, reply) {
    Group.delete(request.params.group, callback);
    var callback = reply.view('deleted').redirect('/groups');
  };

};