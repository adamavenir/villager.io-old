var models = require('../models').models;
var _ = require('underscore');
var async = require('async');

exports.addGroup = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.GroupCategory.all(function (err, groupCategories) {
            reply.view('addGroup', {
                userid    : session.userid,
                fullName  : session.fullName,
                avatar    : session.avatar,
                moderator : session.moderator,
                admin     : session.admin,
                groupCategories : groupCategories
            });
        });
    }
};

exports.listGroups = {
    auth: { strategy: 'session', mode: 'try' }
    handler: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            groups: function (done) {
                models.Group.all(done);
            }
        }, function (err, context) {
            var approved = _.where(context.groups[0], { approved: true });
            if (session && session.userid) {
                var mine = _.where(context.groups[0], { creatorKey: session.userid, approved: false });
                if(mine.length + approved.length === 0) {
                    reply.view('noGroups', {
                        fullName  : session.fullName,
                        avatar    : session.avatar,
                        userid    : session.userid,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                }
                else {
                    reply.view('listGroups', {
                        groups    : approved,
                        mine      : mine,
                        fullName  : session.fullName,
                        avatar    : session.avatar,
                        userid    : session.userid,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                }
            }
            else {
                if (approved.length === 0) {
                    reply.view('noGroups');
                }
                else {
                    reply.view('listGroups', {
                        groups : approved
                    });
                }
            }
        });
    }
};

exports.getGroup = {
    auth: { strategy: 'session', mode: 'try' }
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.Group.findByIndex('slug', request.params.group, function(err, group) {
            console.log('req', request.params.group);
            if (err) {
                console.log('err', err);
                reply.view('404');
            }
            else {
                var thismod;
                if (group.creatorKey === session.userid) { thismod = true; }
                else { thismod = false; }
                reply.view('group', {
                    group     : group,
                    thismod   : thismod,
                    userid    : session.userid,
                    moderator : session.moderator,
                    admin     : session.admin
                });
            }
        });
    }
};

exports.createGroup = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        console.log('form is%j', form);
        var g = models.Group.create({
            type    : form.type,
            name    : form.name,
            image   : form.image,
            twitter : form.twitter,
            website : form.website,
            about   : form.about,
            creatorKey : session.userid
        });
        g.save(function (err) {
            if (err) { throw err; }
            models.Group.load(g.key, function (err, group) {
                console.log('saved ' +  group.key);
                reply().code(201).redirect('/groups/' + group.slug);
            });
        });
    }
};

exports.editGroup = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            group: function (done) {
                models.Group.findByIndex('slug', request.params.groupSlug, done);
            },
            groupCategories: function (done) {
                models.GroupCategory.all(done);
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
            reply.view('editGroup', context);
        });
    }
};

exports.updateGroup = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        models.Group.update(request.params.groupKey, {
            type    : form.type,
            name    : form.name,
            image   : form.image,
            twitter : form.twitter,
            website : form.website,
            about   : form.about,
            creatorKey : session.userid
        }, function (err) {
            if (err) { throw err; }
            reply().code(201).redirect('/groups');
        });
    }
};

exports.starGroup = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.Group.get(request.params.groupKey, function (err, group) {
            // get an array of the users which already starred the group
            var starredIds = group.starredBy.map(function (user) {
                return user.key;
            });
            // if the user already starred it remove it
            if (_.contains(starredIds, session.userid)) {
                group.starredBy = _.without(group.starredBy, session.userid);
                for (var i = 0; i < group.starredBy.length; i++) {
                    if (group.starredBy[i].key === session.userid) {
                        group.starredBy.splice(i, 1);
                        break;
                    }
                }
            }
            // otherwise we add it
            else {
                group.starredBy.push(session.userid);
            }
            group.save(function () {
                reply().redirect('/groups/' + group.slug);
            });
        });
    }
};

exports.deleteGroup = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            user: function (done) {
                models.User.get(session.userid, done);
            },
            group: function (done) {
                models.Group.get(request.params.groupKey, done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            context.group.delete(function (err) {
                if (err) { throw err; }
                reply.view('deleted').redirect('/groups');
            });
        });
    }
};