var _ = require('underscore');
var models = require('../models').models;
var User = models.User;

module.exports = {

    login: function (request, reply) {
        var access, newSession;
        var t = request.auth.credentials.profile;
        console.log('signed in as', t.username);

        if (t.id === '1568') {
            console.log('Greetings, superadmin!');
            access = true;
        } else { access = false; }

        var profile = {
            fullName    : t.displayName,
            twitterId   : t.id,
            twitter     : t.username,
            avatar      : t.raw.profile_image_url.replace('_normal', ''),
            website     : t.raw.entities.url.urls[0].expanded_url,
            about       : t.raw.description,
            hasLoggedIn : true,
            approved    : access,
            admin       : access,
            moderator   : access,
        };

        var user = User.create(profile);

        User.findByIndex('twitterId', t.id, function (err, exists) {
            request.auth.session.clear();
            console.log('looking up', t.id);
            if (err || !exists) {
                // new user
                user.save(function (err) {
                    if (err) { throw err; }
                    console.log('Twitter user ' + t.displayName + ' created with key ' + user.key);
                    newSession = _.extend(profile, {
                        userid: user.key
                    });
                    request.auth.session.clear();
                    request.auth.session.set(newSession);
                    reply().code(201).redirect('/profile/edit/' + user.key);
                });
            } else {
                // update user
                exists.loadData(user.toJSON());
                exists.save(function (err) {
                    if (err) { throw err; }
                    console.log('Twitter user ' + t.displayName + ' updated with key ' + exists.key);
                    newSession = _.extend(profile, {
                        userid: exists.key,
                        admin: exists.admin,
                        moderator: exists.moderator
                    });
                    request.auth.session.clear();
                    request.auth.session.set(newSession);
                    reply().code(201).redirect('/people');
                });
            }
        });

    },

    logout: function (request, reply) {
        request.auth.session.clear();
        request.session.admin = request.session.userid = request.session.moderator = '';
        reply().redirect('/');
    },

    session: function (request, reply) {
        if (request.auth.isAuthenticated) {
            reply('<h1>Session</h1><pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
        }
        else {
            reply('<h1>Session</h1>' + '<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>' + '<p>You should <a href="/login">log in</a>.</p>');
        }
        
    } 

};