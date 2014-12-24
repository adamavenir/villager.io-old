var _ = require('underscore');
var models = require('../models').models;
var async = require('async');

module.exports = {

    addPlace: function (request, reply) {
        var session = request.auth.credentials;
        models.PlaceCategory.all(function (err, placeCategories) {
            reply.view('addPlace', {
                placeCategories: placeCategories,
                userid    : session.userid,
                fullName  : session.fullName,
                avatar    : session.avatar,
                moderator : session.moderator,
                admin     : session.admin
            });
        });
    },

    createPlace: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        var p = models.Place.create({
            type    : form.type,
            name    : form.name,
            address : form.address,
            city    : form.city,
            image   : form.image,
            twitter : form.twitter,
            website : form.website,
            about   : form.about,
            creatorKey : session.userid
        });
        p.save(function (err) {
            if (err) { throw err; }
            models.Place.load(p.key, function (err, place) {
                if (err) { throw err; }
                reply().code(201).redirect('/places/' + place.slug);
            });
        });
    },

    getPlace: function (request, reply) {
        var session = request.auth.credentials;
        models.Place.findByIndex('slug', request.params.place, function(err, place) {
            var thismod;
            //console.log('place is%j', _.pluck(place, 'starredBy'));
            if (err) {
                reply.view('404');
            }
            else {
                if (place.creatorKey === session.userid) { thismod = true; }
                else { thismod = false; }
                reply.view('place', {
                    place     : place,
                    thismod   : thismod,
                    fullName  : session.fullName,
                    avatar    : session.avatar,
                    userid    : session.userid,
                    moderator : session.moderator,
                    admin     : session.admin
                });
            }
        });
    },

    listPlaces: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            places: function (done) {
                models.Place.all(done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            //var approved = _.where(context.places[0], { approved: true });
            //console.log('approved places', approved);
            //var mine = _.where(context.places[0], { creatorKey: session.userid, approved: false });
            // if(mine.length + approved.length === 0) {
            //     reply.view('noPlaces', {
            //         userid    : session.userid,
            //         user      : context.sessionUser[0],
            //         moderator : session.moderator,
            //         admin     : session.admin
            //     });
            // }
            //else {
            if (session && session.userid) {
                reply.view('listPlaces', {
                    places    : context.places[0],
                    //mine      : mine,
                    userid    : session.userid,
                    fullName  : session.fullName,
                    avatar    : session.avatar,
                    moderator : session.moderator,
                    admin     : session.admin
                });
            }

            else {
                reply.view('listPlaces', {
                    places    : context.places[0],
                });
            }

            //}
        });
    },

    editPlace: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            place: function (done) {
                models.Place.findByIndex('slug', request.params.placeSlug, done);
            },
            placeCategories: function (done) {
                models.PlaceCategory.all(done);
            }
        }, function (err, context) {
            console.log('place is%j', context.place);
            if (err) { throw err; }
            context = _.extend(context, {
                userid    : session.userid,
                fullName  : session.fullName,
                avatar    : session.avatar,
                moderator : session.moderator,
                admin     : session.admin
            });
            reply.view('editPlace', context);
        });
    },

    updatePlace: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        models.Place.update(request.params.placeKey, {
            type    : form.type,
            name    : form.name,
            address : form.address,
            city    : form.city,
            image   : form.image,
            twitter : form.twitter,
            website : form.website,
            about   : form.about,
            creatorKey : session.userid
        }, function (err) {
            if (err) { throw err; }
            else { reply().code(201).redirect('/places'); }
        });
    },

    starPlace: function (request, reply) {
        var session = request.auth.credentials;
        models.Place.get(request.params.placeKey, function (err, place) {
            // get an array of the users which already starred the place
            var starredIds = place.starredBy.map(function (user) {
                return user.key;
            });
            // if the user already starred it remove it
            if (_.contains(starredIds, session.userid)) {
                place.starredBy = _.without(place.starredBy, session.userid);
                for (var i = 0; i < place.starredBy.length; i++) {
                    if (place.starredBy[i].key === session.userid) {
                        place.starredBy.splice(i, 1);
                        break;
                    }
                }
            }
            // otherwise we add it
            else {
                place.starredBy.push(session.userid);
            }
            place.save(function () {
                console.log('place is%j', place);
                reply().redirect('/places/' + place.slug);
            });
        });
    },

    deletePlace: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            user: function (done) {
                models.User.get(session.userid, done);
            },
            place: function (done) {
                models.Place.get(request.params.placeKey, done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            context.place.delete(function (err) {
                if (err) { throw err; }
                reply.view('deleted').redirect('/places');
            });
        });
    }

};