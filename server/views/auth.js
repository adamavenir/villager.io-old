var User = require('../models/User');
var _ = require('underscore');

module.exports = function auth(server) {

  var Passport = server.plugins.travelogue.passport;

  ///////////////// AUTH

  login = function (request, reply) {
    Passport.authenticate('twitter')(request, reply);
    var html = '<a href="/auth/twitter">Login with Twitter</a>';
    if (request.session) {
      html += "<br/><br/><pre><span style='background-color: #eee'>session: " + JSON.stringify(request.session, null, 2) + "</span></pre>";
    }
    reply(html);
  };

  authenticated = function (request, reply) {
    User.getByIndex('twitterId', request.session.user.id, function (err, user) {
      // if this user exists, log in
      if (Array.isArray(user) && user.length === 1) {
        user = user[0];
        request.session.userid = user.__verymeta.data.key;
        request.session.admin = user.__verymeta.data.admin;
        request.session.moderator = user.__verymeta.data.moderator;
        reply().code(201).redirect('/people');
      }
      // otherwise, create a new user
      else {
        if (request.session.user.id === '1568') {
          console.log('Hi, Adam');
          var access = true;
        }
        else {
          var access = false;
        }
        var u = User.create({
          fullName : request.session.user.displayName,
          twitterId : request.session.user.id,
          twitter : request.session.user.username,
          avatar: request.session.user._json.profile_image_url,
          approved : access,
          admin : access,
          moderator : access,
        });
        u.save(function (err) {
          reply().code(201).redirect('/people');
          request.session.userid = u.__verymeta.data.key;
          request.session.admin = request.session.moderator = access;
        });
      }
    })
  };

  logout = function (request, reply) {
    request.session._logOut();
    request.session.admin = request.session.moderator = "";
    reply().redirect('/');
  };

  twitterAuth = function (request, reply) {
    Passport.authenticate('twitter')(request, reply);
  };

  twitterCallback = function (request, reply) {
    Passport.authenticate('twitter', {
      failureRedirect: '/login',
      successRedirect: '/authenticated',
      failureFlash: true
    })(request, reply, function () {
      reply().redirect('/authenticated');
    });
  };

  session = function (request, reply) {
    Passport.authenticate('twitter')(request, reply);
    var html = '<a href="/auth/twitter">Login with Twitter</a>';
    if (request.session) {
      html += "<br/><br/><pre><span style='background-color: #eee'>session: " + JSON.stringify(request.session, null, 2) + "</span></pre>";
    }
    reply(html);
  };  

}