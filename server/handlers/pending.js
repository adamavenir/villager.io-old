var models = require('../models').models;
var _ = require('underscore');
var async = require('async');

exports.list = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            people: function (done) {
                models.User.all(done);
            },
            places: function (done) {
                models.Place.all(done);
            },
            groups: function (done) {
                models.Group.all(done);
            }
        }, function (err, context) {
            if (session.moderator === true) {
                var pendingPeople = _.where(context.people[0], { approved: false });
                var pendingPlaces = _.where(context.places[0], { approved: false });
                var pendingGroups = _.where(context.groups[0], { approved: false });
                if(pendingPeople.length + pendingPlaces.length + pendingGroups.length === 0) {
                    reply.view('pending/noPending', {
                        fullName  : session.fullName,
                        userid    : session.userid,
                        avatar    : session.avatar,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                }
                else {
                    reply.view('pending/listPending', {
                        people    : pendingPeople,
                        places    : pendingPlaces,
                        groups    : pendingGroups,
                        fullName  : session.fullName,
                        avatar    : session.avatar,
                        userid    : session.userid,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                }
            }
            else { reply.redirect('/'); }
        });
    }
};