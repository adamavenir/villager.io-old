var models = require('../models').models;
var _ = require('underscore');
var async = require('async');

exports.pendingList = {
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
            },
            activities: function (done) {
                models.Activity.all(done);
            }
        }, function (err, context) {
            if (session.moderator === true) {
                var pendingPeople = _.where(context.people[0], { approved: false });
                var pendingPlaces = _.where(context.places[0], { approved: false });
                var pendingGroups = _.where(context.groups[0], { approved: false });
                var pendingEvents = _.where(context.events[0], { approved: false });
                var pendingActivities = _.where(context.activities[0], { approved: false });
                if(pendingPeople.length + pendingPlaces.length + pendingGroups.length + pendingEvents.length + pendingActivities.length === 0) {
                    reply.view('admin/noPending', {
                        fullName  : session.fullName,
                        userid    : session.userid,
                        avatar    : session.avatar,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                }
                else {
                    reply.view('admin/listPending', {
                        people    : pendingPeople,
                        places    : pendingPlaces,
                        groups    : pendingGroups,
                        events    : pendingEvents,
                        activities: pendingActivities,
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

exports.settings = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            groupCategories: function (done) {
                models.GroupCategory.all(done);
            },
            placeCategories: function (done) {
                models.PlaceCategory.all(done);
            },
            activityCategories: function (done) {
                models.ActivityCategory.all(done);
            },
            eventCategories: function (done) {
                models.PlaceCategory.all(done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            context = _.extend(context, {
                fullName  : session.fullName,
                avatar    : session.avatar,
                userid    : session.userid,
                moderator : session.moderator,
                admin     : session.admin
            });
            reply.view('admin/settings', context);
        });
    },
};