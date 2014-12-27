var models = require('../models').models;
var async = require('async');
var _ = require('underscore');
var itemReply = require('./helpers').itemReply;
var listReply = require('./helpers').listReply;


exports.list = {
    auth: { strategy: 'session', mode: 'try' },
    handler: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            lists: function (done) {
                models.List.all(done);
            }
        }, function (err, context) {
            if (err) { throw err; }

            // show only items that have been approved
            var approved = _.where(context.lists[0], { approved: true });

            // if we have a session
            if (session && session.userid) {

                // also show my items that haven't been approved yet
                var mine = _.where(context.lists[0], { 
                    creator: session.userid, 
                    approved: false 
                });

                // if there are no approved lists or my unapproved lists
                if(mine.length + approved.length === 0) {
                    reply.view('items/noItems', listReply('list', null, null, session));
                }
                // reply with approved and mine
                else {
                    reply.view('items/listItems', listReply('list', approved, mine, session));
                }
            }
            else {
                // if there are no approved items
                if (approved.length === 0) {
                    reply.view('items/noItems');
                }
                // else show the list of approved lists
                else {
                    reply.view('items/listItems', listReply('list', approved));
                }
            }
        });
    }
};

exports.get = {
    auth: { strategy: 'session', mode: 'try' },
    handler: function (request, reply) {
        var session = request.auth.credentials;

        models.List.findByIndex('slug', request.params.list, function(err, list) {

            console.log(JSON.stringify(list, null, 2));

            var thismod, iStarred;

            // if there's no such item, return a 404
            if (err) { reply.view('404'); }

            // if we have a session
            else if (session.userid) {

                // get foreignkeys for creator
                list.getForeign('creator', function (err, creator) {

                    if (err) { throw err; }

                    // if I created this list, I'm a moderator of it.
                    if (creator && creator.key === session.userid) { 
                        thismod = true;
                    } else { thismod = false; }

                    // if I starred it
                    if (list.hasKey('starredBy', session.userid)) {
                        iStarred = true;
                        reply.view('items/item', itemReply('list', list, session, thismod, iStarred));
                    // if I didn't star it
                    } else { 
                        iStarred = false; 
                        reply.view('items/item', itemReply('list', list, session, thismod, iStarred));
                    }
                });

            // if I don't have a session, give a standard page
            } else {
                reply.view('items/item', itemReply('list', list));
            }
            
        });
    }
};

exports.add = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        reply.view('lists/addlist', {
            userid    : session.userid,
            fullName  : session.fullName,
            avatar    : session.avatar,
            moderator : session.moderator,
            admin     : session.admin
        });
    }
};

exports.create = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        var list = models.List.create({
            type    : form.type,
            name    : form.name,
            about   : form.about
        });
        console.log(session.userid);
        // get my user
        models.User.get(session.userid, function (err, user) {
            if (err) { throw err; }
            console.log('got user', JSON.stringify(user, null, 2));
            // save the list
            list.save(function (err) {
                if (err) { throw err; }
                console.log('saved list', list.name);
                // add my user as a foreign key
                list.addForeign('creator', user, function (err) {
                    console.log('added foreign user', user.name);
                    if (err) { throw err; }
                    // return the new list page as confirmation
                    reply().code(201).redirect('/lists/' + list.slug);
                });
            });
        });
    }
};

exports.edit = {
    auth: 'session',
    handler: function (request, reply) {
        console.log('hi, edit handler here');
        var session = request.auth.credentials;
        models.List.get(request.params.listKey, function (err, list) {
            console.log(JSON.stringify(list,null,2));
            // console.log('list is%j', context.list);
            if (err) { throw err; }
            reply.view('lists/editList', listReply('list', list, session));
        });
    }
};

exports.update = {
    auth: 'session',
    handler: function (request, reply) {
        var form = request.payload;
        models.List.update(request.params.listKey, {
            type    : form.type,
            name    : form.name,
            about   : form.about
        }, function (err) {
            if (err) { throw err; }
            else { reply().code(201).redirect('/lists'); }
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
            list: function (done) {
                models.List.get(request.params.listKey, done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            context.list.delete(function (err) {
                if (err) { throw err; }
                reply.view('deleted').redirect('/lists');
            });
        });
    }
};

exports.star = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.List.get(request.params.listKey, function (err, list) {
            // get an array of the users which already starred the list
            var starredIds = list.starredBy.map(function (user) {
                return user.key;
            });
            // if the user already starred it remove it
            if (_.contains(starredIds, session.userid)) {
                list.starredBy = _.without(list.starredBy, session.userid);
                for (var i = 0; i < list.starredBy.length; i++) {
                    if (list.starredBy[i].key === session.userid) {
                        list.starredBy.splice(i, 1);
                        break;
                    }
                }
            }
            // otherwise we add it
            else {
                list.starredBy.push(session.userid);
            }
            list.save(function () {
                // console.log('list is%j', list);
                reply().redirect('/lists/' + list.slug);
            });
        });
    }
};

exports.mute = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        if (session.moderator) {
            models.List.update(request.params.list, { approved: true }, function () {
                //console.log('approved:', list.key);
                reply.redirect('/lists');
            });
        }
        else { reply.redirect('/'); }
    }
};

exports.addplace = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.List.get(request.params.listKey, function (err, list) {
            // get an array of the users which already starred the list
            var starredIds = list.starredBy.map(function (user) {
                return user.key;
            });
            // if the user already starred it remove it
            if (_.contains(starredIds, session.userid)) {
                list.starredBy = _.without(list.starredBy, session.userid);
                for (var i = 0; i < list.starredBy.length; i++) {
                    if (list.starredBy[i].key === session.userid) {
                        list.starredBy.splice(i, 1);
                        break;
                    }
                }
            }
            // otherwise we add it
            else {
                list.starredBy.push(session.userid);
            }
            list.save(function () {
                // console.log('list is%j', list);
                reply().redirect('/lists/' + list.slug);
            });
        });
    }
};

exports.addgroup = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.List.get(request.params.listKey, function (err, list) {
            // get an array of the users which already starred the list
            var starredIds = list.starredBy.map(function (user) {
                return user.key;
            });
            // if the user already starred it remove it
            if (_.contains(starredIds, session.userid)) {
                list.starredBy = _.without(list.starredBy, session.userid);
                for (var i = 0; i < list.starredBy.length; i++) {
                    if (list.starredBy[i].key === session.userid) {
                        list.starredBy.splice(i, 1);
                        break;
                    }
                }
            }
            // otherwise we add it
            else {
                list.starredBy.push(session.userid);
            }
            list.save(function () {
                // console.log('list is%j', list);
                reply().redirect('/lists/' + list.slug);
            });
        });
    }
};