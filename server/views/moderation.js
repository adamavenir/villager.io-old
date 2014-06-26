var models = require('../models').models;
var _ = require('underscore');
var async = require('async');

module.exports = {

    listPending: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            user: function (done) {
                models.User.get(session.userid, done);
            },
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
                    reply.view('noPending', {
                        user      : context.user,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                }
                else {
                    reply.view('listPending', {
                        people    : pendingPeople,
                        places    : pendingPlaces,
                        groups    : pendingGroups,
                        user      : context.user,
                        userid    : session.userid,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                }
            }
            else { reply.redirect('/'); }
        });
    },

    approvePerson: function (request, reply) {
        var session = request.auth.credentials;
        if (session.moderator) {
            models.User.update(request.params.person, { approved: true }, function (person) {
                console.log('approved:', person.key);
                reply.redirect('/people');
            });
        }
        else { reply.redirect('/'); }
    },

    approvePlace: function (request, reply) {
        var session = request.auth.credentials;
        if (session.moderator) {
            models.Place.update(request.params.place, { approved: true }, function () {
                //console.log('approved:', place.key);
                reply.redirect('/places');
            });
        }
        else { reply.redirect('/'); }
    },

    approveGroup: function (request, reply) {
        var session = request.auth.credentials;
        if (session.moderator) {
            models.Group.update(request.params.group, { approved: true }, function (err, group) {
                console.log('approved:', group.key);
                reply.redirect('/groups');
            });
        }
        else { reply.redirect('/'); }
    },

    adminPerson: function (request, reply) {
        var session = request.auth.credentials;
        if (session.admin) {
            models.User.update(request.params.person, { admin: true, moderator: true, approved: true }, function (person) {
                console.log('made admin:', person.key);
                reply().code(200).redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    },

    moderatorPerson: function (request, reply) {
        var session = request.auth.credentials;
        if (session.admin) {
            models.User.update(request.params.person, { moderator: true, approved: true }, function (person) {
                console.log('made moderator:', person.key);
                reply().code(200).redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    },

};