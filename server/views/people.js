var models = require('../models').models;
var _ = require('underscore');
var async = require('async');

module.exports = {

    addPerson: function (request, reply) {
        var session = request.auth.credentials;
        models.Interest.all(function (err, interests) {
            reply.view('addPerson', {
                userid    : session.userid,
                fullName  : session.fullName,
                avatar    : session.avatar,
                interests : interests,
                moderator : session.moderator,
                admin     : session.admin
            });
        });
    },

    createPerson: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        var p = models.User.create({
            fullName  : form.fullName,
            email     : form.email,
            twitter   : form.twitter,
            website   : form.website,
            company   : form.company,
            about     : form.about,
            interests : form.interests,
            approved  : true
        });
        models.User.get(session.userid, function (err, user) {
            p.save(function (err) {
                if (err) { throw err; }
                models.User.load(p.key, function (err, person) {
                    if (err) { throw err; }
                    reply().code(201).redirect('/people/' + person.slug);
                    var l = models.Log.create({ 
                        objType: 'person',
                        editType: 'created',
                        editorKey: session.userid,
                        editorName: user.fullName,
                        editorAvatar: user.avatar,
                        editedKey: person.key,
                        editedName: person.fullName 
                    });
                    l.save(function () { console.log('logging'); });
                });
            });
        });
    },

    getPerson: function (request, reply) {
        var session = request.auth.credentials;
        models.User.findByIndex('slug', request.params.person, function(err, value) {
            if (err) {
                reply.view('404');
            }
            else {
                reply.view('person', {
                    person    : value,
                    userid    : session.userid,
                    fullName  : session.fullName,
                    avatar    : session.avatar,
                    moderator : session.moderator,
                    admin     : session.admin
                });
            }
        });
    },

    listPeople: function (request, reply) {
        var session = request.auth.credentials;
        // console.log('\n in listPeople request.auth  is',request.auth);
        models.User.get(session.userid, function (err, user) {
            var me;
            if (err) { throw err; }
            if (user && user.approved === false) { me = user; } else { me = false; }
            models.User.all(function(err, data) {
                var approved = _.where(data, { approved: true });
                if(me === false && approved.length === 0) {
                    reply.view('noPeople', {
                        userid    : session.userid,
                        fullName  : session.fullName,
                        avatar    : session.avatar,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                }
                else {
                    reply.view('listPeople', {
                        people    : approved,
                        me        : me,
                        userid    : session.userid,
                        fullName  : session.fullName,
                        avatar    : session.avatar,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                }
            });
        });
    },

    editPerson: function (request, reply) {
        var session = request.auth.credentials;
        models.User.get(request.params.person, function (err, person) {
            models.Interest.all(function (err, interests) {
                person.interests = _.pluck(person.interests, 'key');
                reply.view('editPerson', {
                    interests : interests,
                    person    : person,
                    userid    : session.userid,
                    fullName  : session.fullName,
                    avatar    : session.avatar,
                    moderator : session.moderator,
                    admin     : session.admin
                });
            });
        });
    },

    updatePerson: function (request, reply) {
        var session = request.auth.credentials;
        var form = request.payload;
        console.log('form is', form);
        models.User.update(request.params.person, {
            fullName  : form.fullName,
            email     : form.email,
            twitter   : form.twitter,
            website   : form.website,
            company   : form.company,
            about     : form.about,
            interests : form.interests
        }, function(err, p) {
            if (err) { throw err; }
            else {
                reply().code(201).redirect('/people');
                models.User.get(session.userid, function (err, sessionUser) {
                    var l = models.Log.create({ 
                        objType: 'person',
                        editType: 'updated',
                        editorKey: session.userid,
                        editorName: sessionUser.fullName,
                        editorAvatar: sessionUser.avatar,
                        editedKey: p.key,
                        editedName: p.fullName 
                    });
                    l.save(function(err) {
                        if (err) { throw err; }
                        console.log('logging');
                    });
                });
            }
        });
    },

    deletePerson: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            person: function (done) {
                models.User.get(request.params.personKey, done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            // Note: Deleting the current session user is a very bad thing
            // In this iteration of the code it is possible and causes
            // lots of problems. Thus I disallow deletion of any admin
            // here until the overall auth system is improved - heather
            if (session.moderator && !context.person.admin) {
                context.person.delete(function (err) {
                    if (err) { throw err; }
                    var l = models.Log.create({ 
                        objType: 'person',
                        editType: 'deleted',
                        editorKey: session.userid,
                        editorName: session.fullName,
                        editorAvatar: session.avatar,
                        editedKey: request.params.personKey,
                        editedName: request.params.personName 
                    });
                    l.save(function(err) {
                        if (err) { throw err; }
                        console.log('logging');
                    });
                    reply.view('deleted').redirect('/people');
                });
            }
            else { reply().code(401).redirect('/'); }
        });
    }
};