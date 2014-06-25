var Place = require('../models/Place');
var Log = require('../models/Log');
var User = require('../models/User');
//var _ = require('underscore');
var async = require('async');

module.exports = {

    addPlace: function (request, reply) {
        var session = request.auth.credentials;
        reply.view('addPlace', {
            userid    : session.userid,
            user      : session.user,
            moderator : session.moderator,
            admin     : session.admin
        });
    },

    createPlace: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        var p = Place.create({
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
            // var l = Log.create({ objType: 'place', editType: 'created', editorKey: session.userid, editorName: session.user.displayName, editorAvatar: session.user._json.profile_image_url });
            // l.save();
            if (err) { throw err; }
            Place.load(p.key, function (err, place) {
                if (err) { throw err; }
                reply().code(201).redirect('/places/' + place.slug);
            });
        });
    },

    getPlace: function (request, reply) {
        var session = request.auth.credentials;
        Place.findByIndex('slug', request.params.place, function(err, place) {
            var thismod;
            if (err) {
                reply.view('404');
            }
            else {
                if (place.creatorKey === session.userid) { thismod = true; }
                else { thismod = false; }
                reply.view('place', {
                    place     : place,
                    thismod   : thismod,
                    user      : session.user,
                    userid    : session.userid,
                    moderator : session.moderator,
                    admin     : session.admin
                });
            }
        });
    },

    listPlaces: function (request, reply) {
        var session = request.auth.credentials;
        if (session) {console.log('we have a session');}
        async.parallel({
            places: function (done) {
                Place.all(done);
            },
            sessionUser: function (done) {
                User.get(session.userid, done);
            }
        }, function (err, context) {
            console.log('places %j', context.places);
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
                console.log('there are places!');
                reply.view('listPlaces', {
                    places    : context.places[0],
                    //mine      : mine,
                    userid    : session.userid,
                    user      : context.sessionUser,
                    moderator : session.moderator,
                    admin     : session.admin
                });
            //}
        });
    },

    editPlace: function (request, reply) {
        var session = request.auth.credentials;
        Place.load(request.params.place, function(err, place) {
            reply.view('editPlace', {
                place     : place,
                userid    : session.userid,
                user      : session.user,
                moderator : session.moderator,
                admin     : session.admin
            });
        });
    },

    updatePlace: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        Place.update(request.params.place, {
            type    : form.type,
            name    : form.name,
            address : form.address,
            city    : form.city,
            image   : form.image,
            twitter : form.twitter,
            website : form.website,
            about   : form.about,
            creatorKey : session.userid
        },
        function(err) {
            var l = Log.create({ objType: 'place', editType: 'updated', editorKey: session.userid, editorName: session.user.displayName, editorAvatar: session.user._json.profile_image_url });
            l.save();
            if (err) { console.log('err', err); }
            else {
                reply().code(201).redirect('/places');
            }
        });
    },

    deletePlace: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            user: function (done) {
                User.get(session.userid, done);
            },
            place: function (done) {
                Place.get(request.params.placeKey, done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            context.place.delete(function (err) {
                if (err) { throw err; }
                var l = Log.create({ objType: 'person',
                                    editType: 'deleted',
                                    editorKey: session.userid,
                                    editorName: context.user.fullName,
                                    editorAvatar: context.user.avatar,
                                    editedKey: request.params.placeKey,
                                    editedName: request.params.placeName });
                l.save(function(err) {
                    if (err) { throw err; }
                    console.log('logging');
                });
                reply.view('deleted').redirect('/places');
            });
        });
    }

};