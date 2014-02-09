var Place = require('../models/Place');
var _ = require('underscore');

module.exports = function places(server) {

  var Passport = server.plugins.travelogue.passport;

  addPlace = function (request, reply) {
    reply.view('addPlace', {
      userid : request.session.userid,
      user : request.session.user, 
      moderator : request.session.moderator, 
      admin : request.session.admin
    });
  };

  createPlace = function (request, reply) {
    var form = request.payload;
    var p = Place.create({
      type      : form.type,
      name      : form.name,
      address   : form.address,
      city      : form.city,
      image     : form.image,
      twitter   : form.twitter,
      website   : form.website,
      about     : form.about,
      createdBy : request.session.userid
    });
    p.save(function (err) {
      Place.load(p.key, function (err, place) {
        reply().code(201).redirect('/places/' + p.slug);
      })
    });
  };

  getPlace = function (request, reply) {
    Place.getByIndex('slug', request.params.place, function(err, value) {
      if (err) {
        reply.view('404');
      }
      else {
        if (Array.isArray(value) && value.length === 1) { place = value[0] };
        if (place.createdBy === request.session.userid) { var moderator = true }
        else { var moderator = request.session.moderator }
        reply.view('place', { 
          place : place, 
          user : request.session.user, 
          userid : request.session.userid,
          moderator : moderator, 
          admin : request.session.admin 
        });
      }
    });
  };

  listPlaces = function (request, reply) {
    Place.all(function(err, data) {
      var approved = _.where(data, { approved: true });
      if(approved.length === 0) {
        reply.view('noPlaces', { 
          user : request.session.user, 
          userid : request.session.userid,
          moderator : request.session.moderator, 
          admin : request.session.admin 
        });
      }
      else {
        reply.view('listPlaces', { 
          places : approved,
          user : request.session.user, 
          userid : request.session.userid,
          moderator : request.session.moderator, 
          admin : request.session.admin
        });
      }
    });
  };

  deletePlace = function (request, reply) {
    Place.delete(request.params.place, callback);
    var callback = reply.view('deleted').redirect('/places');
  };

};