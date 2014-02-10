var Place = require('../models/Place');
var _ = require('underscore');

module.exports = function places(server) {

  var Passport = server.plugins.travelogue.passport;

  addPlace = function (request, reply) {
    reply.view('addPlace', {
      userid    : request.session.userid,
      user      : request.session.user, 
      moderator : request.session.moderator, 
      admin     : request.session.admin
    });
  };

  createPlace = function (request, reply) {
    var form = request.payload;
    var p = Place.create({
      type    : form.type,
      name    : form.name,
      address : form.address,
      city    : form.city,
      image   : form.image,
      twitter : form.twitter,
      website : form.website,
      about   : form.about,
      creatorKey : request.session.userid
    });
    p.save(function (err) {
      Place.load(p.key, function (err, place) {
        reply().code(201).redirect('/places/' + p.slug);
      })
    });
  };

  getPlace = function (request, reply) {
    Place.findByIndex('slug', request.params.place, function(err, place) {
      if (err) {
        reply.view('404');
      }
      else {
        if (place.creatorKey === request.session.userid) { var thismod = true }
        else { var thismod = false }
        reply.view('place', { 
          place     : place, 
          thismod   : thismod, 
          user      : request.session.user, 
          userid    : request.session.userid,
          moderator : request.session.moderator,
          admin     : request.session.admin 
        });
      }
    });
  };

  listPlaces = function (request, reply) {
    Place.all(function(err, data) {
      var approved = _.where(data, { approved: true });
      var mine = _.where(data, { creatorKey: request.session.userid, approved: false });
      if(mine.length + approved.length === 0) {
        reply.view('noPlaces', { 
          user      : request.session.user, 
          userid    : request.session.userid,
          moderator : request.session.moderator, 
          admin     : request.session.admin 
        });
      }
      else {
        reply.view('listPlaces', { 
          places    : approved,
          mine      : mine,
          user      : request.session.user, 
          userid    : request.session.userid,
          moderator : request.session.moderator, 
          admin     : request.session.admin
        });
      }
    });
  };

  deletePlace = function (request, reply) {
    Place.delete(request.params.place, callback);
    var callback = reply.view('deleted').redirect('/places');
  };

};