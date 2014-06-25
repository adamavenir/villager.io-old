var Group = require('../models/Group');
var Log = require('../models/Log');
var User = require('../models/User');
var _ = require('underscore');
var async = require('async');

module.exports = {

    addGroup: function (request, reply) {
        var session = request.auth.credentials;
        reply.view('addGroup', {
            userid    : session.userid,
            moderator : session.moderator,
            admin     : session.admin
        });
    },

    createGroup: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        console.log('form is%j', form);
        var g = Group.create({
            type    : form.type,
            name    : form.name,
            image   : form.image,
            twitter : form.twitter,
            website : form.website,
            about   : form.about,
            creatorKey : session.userid
        });
        User.get(session.userid, function (err, user) {
            g.save(function (err) {
                if (err) { throw err; }
                var l = Log.create({ objType: 'group',
                                     editType: 'created',
                                     editorKey: session.userid,
                                     editorName: user.fullName,
                                     editorAvatar: user.avatar
                                 });
                l.save( function () { console.log('logging'); });
                Group.load(g.key, function (err, group) {
                    console.log('saved ' +  group.key);
                    reply().code(201).redirect('/groups/' + group.slug);
                });
            });
        });
    },

    getGroup: function (request, reply) {
        var session = request.auth.credentials;
        Group.findByIndex('slug', request.params.group, function(err, group) {
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
    },

    listGroups: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            groups: function (done) {
                Group.all(done);
            },
            user: function (done) {
                User.get(session.userid, done);
            }
        }, function (err, context) {
            var approved = _.where(context.groups[0], { approved: true });
            var mine = _.where(context.groups[0], { creatorKey: session.userid, approved: false });
            if(mine.length + approved.length === 0) {
                reply.view('noGroups', {
                    user      : context.user,
                    userid    : session.userid,
                    moderator : session.moderator,
                    admin     : session.admin
                });
            }
            else {
                reply.view('listGroups', {
                    groups    : approved,
                    mine      : mine,
                    user      : context.user,
                    userid    : session.userid,
                    moderator : session.moderator,
                    admin     : session.admin
                });
            }
        });
    },

    editGroup: function (request, reply) {
        var session = request.auth.credentials;
        Group.load(request.params.group, function(err, group) {
            reply.view('editGroup', {
                group     : group,
                userid    : session.userid,
                moderator : session.moderator,
                admin     : session.admin
            });
        });
    },

    updateGroup: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        var p = Group.update(request.params.group, {
            type    : form.type,
            name    : form.name,
            image   : form.image,
            twitter : form.twitter,
            website : form.website,
            about   : form.about,
            creatorKey : session.userid
        },
        function(err) {
            var l = Log.create({ objType: 'group', editType: 'updated', editorKey: session.userid, editorName: session.user.displayName, editorAvatar: session.user._json.profile_image_url, editedKey: p.key, editedName: p.name });
            l.save();
            if (err) { throw err; }
            else {
                reply().code(201).redirect('/groups');
            }
        });
    },

    deleteGroup: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            user: function (done) {
                User.get(session.userid, done);
            },
            group: function (done) {
                Group.get(request.params.groupKey, done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            context.group.delete(function (err) {
                if (err) { throw err; }
                var l = Log.create({ objType: 'group',
                                    editType: 'deleted',
                                    editorKey: session.userid,
                                    editorName: context.user.fullName,
                                    editorAvatar: context.user.avatar,
                                    editedKey: request.params.groupKey,
                                    editedName: request.params.groupName });
                l.save(function(err) {
                    if (err) { throw err; }
                    console.log('logging');
                });
                reply.view('deleted').redirect('/groups');
            });
        });
    },

};