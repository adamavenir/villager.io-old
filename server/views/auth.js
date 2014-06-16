var models = require('../models').models;
var User = models.User;

module.exports = {

    ///////////////// AUTH

    login: function (request, reply) {
        request.server.plugins.travelogue.passport.authenticate('twitter')(request, reply);
        var html = '<a href="/auth/twitter">Login with Twitter</a>';
        if (request.session) {
            html += '<br/><br/><pre><span style="background-color: #eee">session: ' + JSON.stringify(request.session, null, 2) + '</span></pre>';
        }
        reply(html);
    },

    authenticated: function (request, reply) {
        var access;
        var t = request.session.user;

        if (t.id === '1568') {
            console.log('Greetings, superadmin!');
            access = true;
        } else { access = false; }

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
                    if (err) { throw err; }
                    console.log('Twitter user ' + t.displayName + ' created with key ' + user.key);
                    request.session.userid = user.key;
                    reply().code(201).redirect('/profile/edit/' + user.key);
                });
            } else {
                // update user
                exists.loadData(user.toJSON());
                exists.save(function (err) {
                    if (err) { throw err; }
                    console.log('Twitter user ' + t.displayName + ' updated with key ' + exists.key);
                    request.session.userid = exists.key;
                    request.session.admin = exists.admin;
                    request.session.moderator = exists.moderator;
                    reply().code(201).redirect('/people');
                });
            }
        });

    },

    logout: function (request, reply) {
        request.session._logOut();
        request.session.admin = request.session.userid = request.session.moderator = '';
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
            html += '<br/><br/><pre><span style="background-color: #eee">session: ' + JSON.stringify(request.session, null, 2) + '</span></pre>';
        }
        reply(html);
    }  

};