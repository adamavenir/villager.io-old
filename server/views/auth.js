var models = require('../models').models;
var User = models.User;
var async = require('async');
var _ = require('underscore');

module.exports = {

    ///////////////// AUTH

    login: function (request, reply) {
        request.server.plugins.travelogue.passport.authenticate('twitter')(request, reply);
        var html = '<a href="/auth/twitter">Login with Twitter</a>';
        if (request.session) {
            html += "<br/><br/><pre><span style='background-color: #eee'>session: " + JSON.stringify(request.session, null, 2) + "</span></pre>";
        }
        reply(html);
    },

    authenticated: function (request, reply) {
        var t = request.session.user;

        if (t.id === '1568') {
            console.log('Greetings, superadmin!');
            var access = true;
        } else { var access = false; }

        var user = User.create({
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

        User.findByIndex('twitterId', t.id, function (err, exists) {
            console.log('looking up', t.id);
            if (err || !exists) {
                // new user
                user.save(function (err) {
                    console.log('Twitter user ' + t.displayName + ' created with key ' + user.key);
                    request.session.userid = user.key;
                    reply().code(201).redirect('/profile/edit/' + user.key);
                })
            } else {
                // update user
                exists.loadData(user.toJSON());
                exists.save(function (err) {
                    console.log('Twitter user ' + t.displayName + ' updated with key ' + exists.key);
                    request.session.userid = exists.key;
                    request.session.admin = exists.admin;
                    request.session.moderator = exists.moderator;
                    reply().code(201).redirect('/people');
                })
            }
        });

    },


    // authenticated: function (request, reply) {
    //     var t = request.session.user;

    //     console.log(t.id);

    //     User.findByIndex('twitterId', t.id, function (err, user) {
    //         console.log('looking up user...');

    //         if (err) { console.log('err', err); };

    //         // check if the user already exists by handle, then log in
    //         if (err === 'no index for value') {
    //             console.log('I do not seem to have a Twitter ID...')
    //             User.findByIndex('twitter', t.username, function (err, user) {

    //                 if (user) {
    //                     console.log('But, yes, I have a Twitter handle!');
    //                     request.session.userid = user.key;
    //                     console.log('user.key', user.key);
    //                     request.session.admin = user.admin;
    //                     request.session.moderator = user.moderator;
    //                     User.update(user.key, { 
    //                         hasLoggedIn : true,
    //                         fullName    : t.displayName,
    //                         twitterId   : t.id,
    //                         twitter     : t.username,
    //                         avatar      : t._json.profile_image_url,
    //                         website     : t._json.entities.url.urls[0].expanded_url,
    //                         about       : t._json.description
    //                     }, function (err) {
    //                         reply().code(201).redirect('/profile/edit/' + user.key);
    //                     });  
    //                 }
    //                 else {
    //                     console.log('No Twitter handle either...');
    //                     createUser();
    //                 }
    //             });
    //         }

    //         // Got an ID, log in
    //         if (user) {
    //             if (err) { console.log('err', err); };
    //             console.log('I have signed in before, because I have an ID!');
    //             User.update(user.key, { 
    //                 hasLoggedIn : true,
    //                 twitter     : t.username,
    //                 avatar      : t._json.profile_image_url
    //             }, function (err) {
    //                 request.session.userid = user.key;
    //                 console.log('user.key', user.key);
    //                 request.session.admin = user.admin;
    //                 request.session.moderator = user.moderator;
    //                 console.log('updating user', t.displayName);
    //                 reply().code(201).redirect('/people');
    //             });       
    //         }

    //         // otherwise, create a new user
    //         createUser = function (err) {
    //             if (err) { console.log('err', err); };
    //             if (t.id === '1568') {
    //                 console.log('Hi, Adam');
    //                 var access = true;
    //             }
    //             else { var access = false; }
    //             var u = User.create({
    //                 fullName    : t.displayName,
    //                 twitterId   : t.id,
    //                 twitter     : t.username,
    //                 avatar      : t._json.profile_image_url,
    //                 website     : t._json.entities.url.urls[0].expanded_url,
    //                 about       : t._json.description,
    //                 hasLoggedIn : true,
    //                 approved    : access,
    //                 admin       : access,
    //                 moderator   : access,
    //             });
    //             u.save(function (err) {
    //                 console.log('creating user', t.displayName);
    //                 reply().code(201).redirect('/profile/edit/' + u.key);
    //                 request.session.userid = u.key;
    //                 console.log('request.session.userid', request.session.userid);
    //                 console.log('u.key', u.key);
    //                 request.session.admin = request.session.moderator = access;
    //             });
    //         }

    //     })
    // },

    logout: function (request, reply) {
        request.session._logOut();
        request.session.admin = request.session.userid = request.session.moderator = "";
        reply().redirect('/');
    },

    twitterAuth: function (request, reply) {
        request.server.plugins.travelogue.passport.authenticate('twitter')(request, reply);
    },

    twitterCallback: function (request, reply) {
        request.server.plugins.travelogue.passport.authenticate('twitter', {
            failureRedirect: '/login',
            successRedirect: '/authenticated',
            failureFlash: true
        })(request, reply, function () {
            reply().redirect('/authenticated');
        });
    },

    session: function (request, reply) {
        request.server.plugins.travelogue.passport.authenticate('twitter')(request, reply);
        var html = '<a href="/auth/twitter">Login with Twitter</a>';
        if (request.session) {
            html += "<br/><br/><pre><span style='background-color: #eee'>session: " + JSON.stringify(request.session, null, 2) + "</span></pre>";
        }
        reply(html);
    }  

}