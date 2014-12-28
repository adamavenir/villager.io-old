var _ = require('underscore');
var models = require('../models').models;
var async = require('async');
var itemReply = require('./helpers').itemReply;
var listReply = require('./helpers').listReply;

exports.list = {
    auth: { strategy: 'session', mode: 'try' },
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.Place.all(function (err, items) {
            if (err) { throw err; }

            // show only items that have been approved
            var approved = _.where(items[0], { approved: true });

            // if we have a session
            if (session && session.userid) {

                // also show my items that haven't been approved yet
                var mine = _.where(items[0], { 
                    creator: session.userid, 
                    approved: false 
                });

                // if there are no approved places or my unapproved places
                if(mine.length + approved.length === 0) {
                    reply.view('items/noItems', listReply('place', null, null, session));
                }
                // reply with approved and mine
                else {
                    reply.view('items/listItems', listReply('place', approved, mine, session));
                }
            }
            else {
                // if there are no approved items
                if (approved.length === 0) {
                    reply.view('items/noItems');
                }
                // else show the list of approved places
                else {
                    reply.view('items/listItems', listReply('place', approved));
                }
            }
        });
    }
};

exports.get = {
    auth: { strategy: 'session', mode: 'try' },
    handler: function (request, reply) {
        var session = request.auth.credentials;

        models.Place.findByIndex('slug', request.params.place, function(err, place) {
            var thismod, iStarred;

            // if there's no such item, return a 404
            if (err) { reply.view('404'); }

            // if we have a session
            if (session.userid) {

                if (err) { throw err; }

                // if I created this place, I'm a moderator of it.
                if (place.creator.key === session.userid) { 
                    thismod = true;
                } else { thismod = false; }

                // if I starred it
                if (place.hasKey('starredBy', session.userid)) {
                    iStarred = true;
                    reply.view('items/item', itemReply('place', place, session, thismod, iStarred));
                // if I didn't star it
                } else { 
                    iStarred = false; 
                    reply.view('items/item', itemReply('place', place, session, thismod, iStarred));
                }

            // if I don't have a session, give a standard page
            } else {
                reply.view('items/item', itemReply('place', place));
            }
            
        });
    }
};

exports.add = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.PlaceCategory.all(function (err, placeCategories) {
            reply.view('items/addPlace', {
                placeCategories: placeCategories,
                userid    : session.userid,
                fullName  : session.fullName,
                avatar    : session.avatar,
                moderator : session.moderator,
                admin     : session.admin
            });
        });
    }
};

exports.create = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        var place = models.Place.create({
            type    : form.type,
            name    : form.name,
            address : form.address,
            city    : form.city,
            image   : form.image,
            twitter : form.twitter,
            website : form.website,
            about   : form.about,
            creator : session.userid
        });
        // save the place
        place.save(function (err) {
            if (err) { throw err; }
            // return the new place page as confirmation
            reply().code(201).redirect('/places/' + place.slug);
        });
    }
};

exports.edit = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.Place.get(request.params.placeKey, function (err, place) {
            if (err) { throw err; }
            models.PlaceCategory.all( function (err, categories) {
                if (err) { throw err; }
                reply.view('items/editPlace', itemReply('place', place, session, null, null, categories));
            }); 
        });
    }
};

exports.update = {
    auth: 'session',
    handler: function (request, reply) {
        var form = request.payload;
        models.Place.update(request.params.placeKey, {
            type    : form.type,
            name    : form.name,
            address : form.address,
            city    : form.city,
            image   : form.image,
            twitter : form.twitter,
            website : form.website,
            about   : form.about
        }, function (err) {
            if (err) { throw err; }
            else { reply().code(201).redirect('/places'); }
        });
    }
};

exports.delete = {
    auth: 'session',
    handler: function (request, reply) {
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

exports.star = {
    auth: 'session',
    handler: function (request, reply) {
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
                // console.log('place is%j', place);
                reply().redirect('/places/' + place.slug);
            });
        });
    }
};

exports.approve = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        if (session.moderator) {
            models.Place.update(request.params.place, { approved: true }, function () {
                //console.log('approved:', place.key);
                reply.redirect('/places');
            });
        }
        else { reply.redirect('/'); }
    }
};