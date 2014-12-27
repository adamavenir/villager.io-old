var _ = require('underscore');
var models = require('../models').models;
var async = require('async');
var itemReply = require('./helpers').itemReply;
var listReply = require('./helpers').listReply;

exports.list = {
    auth: { strategy: 'session', mode: 'try' },
    handler: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            events: function (done) {
                models.Event.all(done);
            }
        }, function (err, context) {
            if (err) { throw err; }

            // show only items that have been approved
            var approved = _.where(context.events[0], { approved: true });

            // if we have a session
            if (session && session.userid) {

                // also show my items that haven't been approved yet
                var mine = _.where(context.events[0], { 
                    creator: session.userid, 
                    approved: false 
                });

                // if there are no approved events or my unapproved events
                if(mine.length + approved.length === 0) {
                    reply.view('items/noItems', listReply('event', null, null, session));
                }
                // reply with approved and mine
                else {
                    reply.view('items/listItems', listReply('event', approved, mine, session));
                }
            }
            else {
                // if there are no approved items
                if (approved.length === 0) {
                    reply.view('items/noItems');
                }
                // else show the list of approved events
                else {
                    reply.view('items/listItems', listReply('event', approved));
                }
            }
        });
    }
};

exports.get = {
    auth: { strategy: 'session', mode: 'try' },
    handler: function (request, reply) {
        var session = request.auth.credentials;

        models.Event.findByIndex('slug', request.params.event, function(err, event) {
            var thismod, iStarred;

            // if there's no such item, return a 404
            if (err) { reply.view('404'); }

            // if we have a session
            if (session.userid) {

                // get foreignkeys for creator
                event.getForeign('creator', function (err, creator) {

                    if (err) { throw err; }

                    // if I created this event, I'm a moderator of it.
                    if (creator && creator.key === session.userid) { 
                        thismod = true;
                    } else { thismod = false; }

                    // if I starred it
                    if (event.hasKey('starredBy', session.userid)) {
                        iStarred = true;
                        reply.view('items/item', itemReply('event', event, session, thismod, iStarred));
                    // if I didn't star it
                    } else { 
                        iStarred = false; 
                        reply.view('items/item', itemReply('event', event, session, thismod, iStarred));
                    }
                });

            // if I don't have a session, give a standard page
            } else {
                reply.view('items/item', itemReply('event', event));
            }
            
        });
    }
};

exports.add = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.EventCategory.all(function (err, eventCategories) {
            reply.view('items/addEvent', {
                eventCategories: eventCategories,
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
        // TODO: explicitly map form to model
        var event = models.Event.create(form);
        console.log(session.userid);
        // get my user
        models.User.get(session.userid, function (err, user) {
            if (err) { throw err; }
            console.log('got user', JSON.stringify(user, null, 2));
            // save the event
            event.save(function (err) {
                if (err) { throw err; }
                console.log('saved event', event.name);
                // add my user as a foreign key
                event.addForeign('creator', user, function (err) {
                    console.log('added foreign user', user.name);
                    if (err) { throw err; }
                    // return the new event page as confirmation
                    reply().code(201).redirect('/events/' + event.slug);
                });
            });
        });
    }
};

exports.edit = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            event: function (done) {
                models.Event.findByIndex('slug', request.params.eventSlug, done);
            },
            eventCategories: function (done) {
                models.EventCategory.all(done);
            }
        }, function (err, context) {
            // console.log('event is%j', context.event);
            if (err) { throw err; }
            context = _.extend(context, {
                userid    : session.userid,
                fullName  : session.fullName,
                avatar    : session.avatar,
                moderator : session.moderator,
                admin     : session.admin
            });
            reply.view('items/editEvent', context);
        });
    }
};

exports.update = {
    auth: 'session',
    handler: function (request, reply) {
        var form = request.payload;
        models.Event.update(request.params.eventKey, {
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
            else { reply().code(201).redirect('/events'); }
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
            event: function (done) {
                models.Event.get(request.params.eventKey, done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            context.event.delete(function (err) {
                if (err) { throw err; }
                reply.view('deleted').redirect('/events');
            });
        });
    }
};

exports.star = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.Event.get(request.params.eventKey, function (err, event) {
            // get an array of the users which already starred the event
            var starredIds = event.starredBy.map(function (user) {
                return user.key;
            });
            // if the user already starred it remove it
            if (_.contains(starredIds, session.userid)) {
                event.starredBy = _.without(event.starredBy, session.userid);
                for (var i = 0; i < event.starredBy.length; i++) {
                    if (event.starredBy[i].key === session.userid) {
                        event.starredBy.splice(i, 1);
                        break;
                    }
                }
            }
            // otherwise we add it
            else {
                event.starredBy.push(session.userid);
            }
            event.save(function () {
                // console.log('event is%j', event);
                reply().redirect('/events/' + event.slug);
            });
        });
    }
};

exports.approve = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        if (session.moderator) {
            models.Event.update(request.params.event, { approved: true }, function () {
                //console.log('approved:', event.key);
                reply.redirect('/events');
            });
        }
        else { reply.redirect('/'); }
    }
};