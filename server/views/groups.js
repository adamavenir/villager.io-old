var Group = require('../models/Group');
var _ = require('underscore');

module.exports = function groups(server) {

  var Passport = server.plugins.travelogue.passport;

  addGroup = function (request, reply) {
    reply.view('addGroup', {
      user      : request.session.user, 
      userid    : request.session.userid,
      moderator : request.session.moderator, 
      admin     : request.session.admin
    });
  };

  createGroup = function (request, reply) {
    var form = request.payload;
    var g = Group.create({
      type      : form.type,
      name      : form.name,
      image     : form.image,
      twitter   : form.twitter,
      website   : form.website,
      about     : form.about,
      createdBy : request.session.userid
    });
    g.save(function (err) {
      Group.load(g.key, function (err, group) {
        console.log('saved ' +  g.key);
        reply().code(201).redirect('/groups/' + g.slug);
      })
    });
  };

  getGroup = function (request, reply) {
    Group.getByIndex('slug', request.params.group, function(err, value) {
      console.log('req', request.params.group);
      if (Array.isArray(value) && value.length === 1 && value[0] !== undefined) { group = value[0] };
      if (err) {
        console.log('err', err);
        reply.view('404');
      }
      else {
        if (group.createdBy === request.session.userid) { var moderator = true }
        else { var moderator = request.session.moderator }
        reply.view('group', { 
          group     : group, 
          user      : request.session.user, 
          userid    : request.session.userid,
          moderator : moderator, 
          admin     : request.session.admin 
        });
      }
    });
  };

  listGroups = function (request, reply) {
    Group.all(function(err, data) {
      var approved = _.where(data, { approved: true });
      var mine = _.where(data, { createdBy: request.session.userid });
      console.log('mine', mine);
      if(approved.length === 0) {
        reply.view('noGroups', { 
          user      : request.session.user, 
          userid    : request.session.userid,
          moderator : request.session.moderator, 
          admin     : request.session.admin 
        });
      }
      else {
        reply.view('listGroups', { 
          groups    : approved, 
          mine      : mine,
          user      : request.session.user, 
          userid    : request.session.userid,
          moderator : request.session.moderator, 
          admin     : request.session.admin  
        });
      }
    });
  };

  deleteGroup = function (request, reply) {
    Group.delete(request.params.group, callback);
    var callback = reply.view('deleted').redirect('/groups');
  };

};