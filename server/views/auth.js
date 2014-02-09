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
    var t = request.session.user;

    // console.log(t.id);

    User.getByIndex('twitterId', t.id, function (err, users) {

      // check if the user already exists by handle, then log in
      if (err === 'no index for value') {
        // console.log('I do not seem to have a Twitter ID...')
        User.getByIndex('twitter', t.username, function (err, users) {

          if (Array.isArray(users) && users.length === 1 && users[0] !== undefined) {
            // console.log('But, yes, I have a Twitter handle!');
            var user = users[0];
            request.session.userid = user.key;
            console.log('user.key', user.key);
            request.session.admin = user.admin;
            request.session.moderator = user.moderator;
            User.update(user.key, { 
              hasLoggedIn : true,
              fullName    : t.displayName,
              twitterId   : t.id,
              twitter     : t.username,
              avatar      : t._json.profile_image_url,
              website     : t._json.entities.url.urls[0].expanded_url,
              about       : t._json.description
            }, function (err) {
              reply().code(201).redirect('/profile/edit/' + user.key);
            });  
          }
          else {
            // console.log('No Twitter handle either...');
            createUser();
          }
        });
      }

      // Got an ID, log in
      if (Array.isArray(users) && users.length === 1 && users[0] !== undefined && users[0].twitterId > 0) {
        // console.log('I have signed in before, because I have an ID!');
        var user = users[0];
        // console.log(user.__verymeta.data.fullName);
        User.update(user.key, { 
          hasLoggedIn : true,
          twitter     : t.username,
          avatar      : t._json.profile_image_url
        }, function (err) {
          request.session.userid = user.key;
          console.log('user.key', user.key);
          request.session.admin = user.admin;
          request.session.moderator = user.moderator;
          // console.log('updating user', t.displayName);
          reply().code(201).redirect('/people');
        });       
      }

      // otherwise, create a new user
      createUser = function (err) {
        // if (err) { console.log('err', err) }
        if (t.id === '1568') {
          console.log('Hi, Adam');
          var access = true;
        }
        else { var access = false; }
        var u = User.create({
          fullName    : t.displayName,
          twitterId   : t.id,
          twitter     : t.username,
          avatar      : t._json.profile_image_url,
          website     : t._json.entities.url.urls[0].expanded_url,
          about       : t._json.description,
          hasLoggedIn : true,
          approved    : access,
          admin       : access,
          moderator   : access,
        });
        u.save(function (err) {
          // console.log('creating user', t.displayName);
          reply().code(201).redirect('/profile/edit/' + u.key);
          request.session.userid = u.key;
          console.log('request.session.userid', request.session.userid);
          console.log('u.key', u.key);
          request.session.admin = request.session.moderator = access;
        });
      }

    })
  };

  logout = function (request, reply) {
    request.session._logOut();
    request.session.admin = request.session.userid = request.session.moderator = "";
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