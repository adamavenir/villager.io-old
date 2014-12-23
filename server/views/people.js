var models = require('../models').models;
var User = models.User;
var Log = models.Log;
var _ = require('underscore');

module.exports = {

    addPerson: function (request, reply) {
        reply.view('addPerson', { 
            userid    : request.auth.credentials.userid,
            user      : request.auth.credentials.user, 
            moderator : request.auth.credentials.moderator, 
            admin     : request.auth.credentials.admin
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
            if (err) { throw err; }
            User.load(p.key, function (err, person) {
                if (err) { throw err; }
                reply().code(201).redirect('/people/' + person.slug);
                var l = Log.create({ 
                    objType: 'person', 
                    editType: 'created', 
                    editorKey: request.auth.credentials.userid, 
                    editorName: request.auth.credentials.fullName, 
                    editorAvatar: request.auth.credentials.avatar, 
                    editedKey: person.key, 
                    editedName: person.fullName 
                });
                l.save(function () { console.log('logging'); });
            });
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
                    userid    : request.auth.credentials.userid,
                    user      : request.auth.credentials.user, 
                    moderator : request.auth.credentials.moderator, 
                    admin     : request.auth.credentials.admin 
                });
            }
        });
    },

    listPeople: function (request, reply) {
        console.log('listPeople session', request.auth.isAuthenticated);
        console.log(JSON.stringify(request.auth.credentials, null, 2));
        User.get(request.auth.credentials.userid, function (err, user) {
            var me;
            if (err) { throw err; }
            if (user && user.approved === false) { me = user; } else { me = false; }
            User.all(function(err, data) {
                var approved = _.where(data, { approved: true });
                if(me === false && approved.length === 0) {
                    reply.view('noPeople', { 
                        userid    : request.auth.credentials.userid,
                        user      : request.auth.credentials.user, 
                        moderator : request.auth.credentials.moderator, 
                        admin     : request.auth.credentials.admin 
                    });
                }
                else {
                    reply.view('listPeople', { 
                        people    : approved, 
                        me        : me,
                        userid    : request.auth.credentials.userid,
                        user      : request.auth.credentials.user, 
                        moderator : request.auth.credentials.moderator, 
                        admin     : request.auth.credentials.admin 
                    });  
                }
            });
        });
    },

    editPerson: function (request, reply) {
        User.get(request.params.person, function(err, person) {
            reply.view('editPerson', { 
                person    : person,
                userid    : request.auth.credentials.userid,
                user      : request.auth.credentials.user, 
                moderator : request.auth.credentials.moderator, 
                admin     : request.auth.credentials.admin
            });
        });
    },

    updatePerson: function (request, reply) {
        var form = request.payload;
        User.update(request.params.person, {
            fullName  : form.fullName,
            email     : form.email,
            twitter   : form.twitter,
            website   : form.website,
            company   : form.company,
            about     : form.about
        }, function(err, p) {
            if (err) { throw err; }
            else {
                reply().code(201).redirect('/people');
                var l = Log.create({ 
                    objType: 'person', 
                    editType: 'updated', 
                    editorKey: request.auth.credentials.userid, 
                    editorName: request.auth.credentials.fullName, 
                    editorAvatar: request.auth.credentials.avatar, 
                    editedKey: p.key, 
                    editedName: p.fullName 
                });
                l.save(function(err) { 
                    if (err) { throw err; }
                    console.log('logging'); 
                });
            }
        });
    },

    deletePerson: function (request, reply) {
        if (request.auth.credentials.moderator) {
            User.delete(request.params.person, function(err) {
                if (err) { throw err; }
                var l = Log.create({ 
                    objType: 'person', 
                    editType: 'deleted', 
                    editorKey: request.auth.credentials.userid, 
                    editorName: request.auth.credentials.fullName, 
                    editorAvatar: request.auth.credentials.avatar, 
                    editedKey: request.params.person, 
                    editedName: '' 
                });
                l.save(function(err) { 
                    if (err) { throw err; }
                    console.log('logging'); 
                });
                reply.view('deleted').redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    }

};