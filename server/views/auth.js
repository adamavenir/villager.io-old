var models = require('../models').models;
var User = models.User;
var _ = require('underscore');

module.exports = {

    ///////////////// AUTH

    login: function (request, reply) {
        var access;
        var t = request.auth.credentials.profile;
        if (t.id === '2511636140') {
            console.log('Greetings, superadmin!');
            access = true;
        } else { access = false; }

        var user = User.create({
            fullName    : t.displayName,
            twitterId   : t.id,
            twitter     : t.username,
            avatar      : t.raw.profile_image_url,
            website     : t.raw.url,
            about       : t.raw.description,
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
                    var sessionObject = {userid: exists.key,
                                         fullName: exists.fullName,
                                         avatar: exists.avatar,
                                         admin: exists.admin,
                                         moderator: exists.moderator
                                        };
                    var session = _.extend(request.auth.credentials, sessionObject);
                    var send = function (session) {
                        request.auth.session.set(session);
                        reply.redirect('/profile/edit/' + user.key);
                    };
                    return send(session);
                });
            } else {
                // update user
                exists.loadData(user.toJSON());
                exists.save(function (err) {
                    if (err) { throw err; }
                    console.log('Twitter user ' + t.displayName + ' updated with key ' + exists.key);
                    var sessionObject = {userid: exists.key,
                                         fullName: exists.fullName,
                                         avatar: exists.avatar,
                                         admin: exists.admin,
                                         moderator: exists.moderator
                                        };
                    var session = _.extend(request.auth.credentials, sessionObject);
                    var send = function (session) {
                        request.auth.session.set(session);
                        console.log('cred=====', request.auth.credentials);
                        reply.redirect('/people');
                    };
                    return send(session);
                });
            }
        });
    },

    logout: function (request, reply) {
        var session = request.auth.credentials;
        request.auth.session.clear();
        // request.session._logOut();
        session.admin = session.userid = session.moderator = '';
        return reply().redirect('/');
    },

    session: function (request, reply) {
        var session = request.auth.credentials;
        // console.log('credentials', request.auth.credentials);
        var html = '<a href="/auth/twitter">Login with Twitter</a>';
        if (session) {
            html += '<br/><br/><pre><span style="background-color: #eee">session: ' + JSON.stringify(session, null, 2) + '</span></pre>';
        }
        reply(html);
    }

};