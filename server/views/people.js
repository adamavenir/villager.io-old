var models = require('../models').models;
var User = models.User;
var Log = models.Log;
var _ = require('underscore');

module.exports = {

    addPerson: function (request, reply) {
        reply.view('addPerson', { 
            userid    : request.session.userid,
            user      : request.session.user, 
            moderator : request.session.moderator, 
            admin     : request.session.admin
        });
    },

    createPerson: function (request, reply) {
        var form = request.payload;
        var p = User.create({
            fullName  : form.fullName,
            email     : form.email,
            twitter   : form.twitter,
            website   : form.website,
            company   : form.company,
            about     : form.about,
            approved  : true
        });
        p.save(function (err) {
            User.load(p.key, function (err, person) {
                reply().code(201).redirect('/people/' + p.slug);
                var l = Log.create({ objType: 'person', editType: 'created', editorKey: request.session.userid, editorName: request.session.user.displayName, editorAvatar: request.session.user._json.profile_image_url, editedKey: person.key, editedName: person.fullName });
                l.save(function(err) { console.log('logging')});
            })
        });
    },

    getPerson: function (request, reply) {
        User.findByIndex('slug', request.params.person, function(err, value) {
            if (err) {
                reply.view('404');
            }
            else {
                reply.view('person', { 
                    person    : value, 
                    userid    : request.session.userid,
                    user      : request.session.user, 
                    moderator : request.session.moderator, 
                    admin     : request.session.admin 
                });
            }
        });
    },

    listPeople: function (request, reply) {
        User.load(request.session.userid, function(err, user) {
            if (user && user.approved === false) { var me = user; } else { var me = false; }
            User.all(function(err, data) {
                var approved = _.where(data, { approved: true });
                if(me === false && approved.length === 0) {
                    reply.view('noPeople', { 
                        userid    : request.session.userid,
                        user      : request.session.user, 
                        moderator : request.session.moderator, 
                        admin     : request.session.admin 
                    });
                }
                else {
                    reply.view('listPeople', { 
                        people    : approved, 
                        me        : me,
                        userid    : request.session.userid,
                        user      : request.session.user, 
                        moderator : request.session.moderator, 
                        admin     : request.session.admin 
                    });  
                }
            });
        })
    },

    editPerson: function (request, reply) {
        User.load(request.params.person, function(err, person) {
            reply.view('editPerson', { 
                person    : person,
                userid    : request.session.userid,
                user      : request.session.user, 
                moderator : request.session.moderator, 
                admin     : request.session.admin
            });
        });
    },

    updatePerson: function (request, reply) {
        var form = request.payload;
        var p = User.update(request.params.person, {
            fullName  : form.fullName,
            email     : form.email,
            twitter   : form.twitter,
            website   : form.website,
            company   : form.company,
            about     : form.about
        }, function(err, p) {
            if (err) { console.log('err', err) }
            else {
                reply().code(201).redirect('/people');
                var l = Log.create({ objType: 'person', editType: 'updated', editorKey: request.session.userid, editorName: request.session.user.displayName, editorAvatar: request.session.user._json.profile_image_url, editedKey: p.key, editedName: p.fullName });
                l.save(function(err) { console.log('logging')});
            }
        });
    },

    deletePerson: function (request, reply) {
        if (request.session.moderator) {
            User.delete(request.params.person, function(err) {
                var l = Log.create({ objType: 'person', editType: 'deleted', editorKey: request.session.userid, editorName: request.session.user.displayName, editorAvatar: request.session.user._json.profile_image_url, editedKey: request.params.person, editedName: "" });
                l.save(function(err) { console.log('logging')});
                reply.view('deleted').redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    }

};