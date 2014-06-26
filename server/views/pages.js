var models = require('../models').models;
var async = require('async');

module.exports = {

    index: function (request, reply) {
        var session = request.auth.credentials;
        //console.log('\n====in pages.js request.auth%j', request.auth);
        if (session.userid) {
            models.Log.all(function(err, log) {
                if (err) { console.log(err); }
                models.User.get(session.userid, function (err, user) {
                    reply.view('index', {
                        log       : log,
                        user      : user,
                        userid    : session.userid,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                });
            });
        }
        else { reply.view('index'); }
    },

    tinker: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            interests: function (done) {
                models.Interest.all(done);
            },
            groupCategories: function (done) {
                models.GroupCategory.all(done);
            },
            placeCategories: function (done) {
                models.PlaceCategory.all(done);
            },
            user: function (done) {
                models.User.get(session.userid, done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            reply.view('tinker/tinker', context);
        });
    },

    notFound: function (request, reply) {
        reply('404');
    },

};