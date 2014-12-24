var models = require('../models').models;
var _ = require('underscore');
var async = require('async');

exports.add = {
    auth: 'session',
    handler: function (request, reply) {
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
    }
};

exports.create = {
    auth: 'session',
    handler: function (request, reply) {
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
        p.save(function (err) {
            if (err) { throw err; }
            models.User.load(p.key, function (err, person) {
                if (err) { throw err; }
                reply().code(201).redirect('/people/' + person.slug);
            });
        });
    }
};

exports.get = {
    auth: { strategy: 'session', mode: 'try' },
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.User.findByIndex('slug', request.params.person, function(err, value) {
            if (err) {
                reply.view('404');
            }
            else {
                if (session && session.userid) {
                    reply.view('person', {
                        person    : value,
                        userid    : session.userid,
                        fullName  : session.fullName,
                        avatar    : session.avatar,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                } else {
                    reply.view('person', { person: value });
                }
            }
        });
    }
};

exports.list = {
    auth: { strategy: 'session', mode: 'try' },
    handler: function (request, reply) {
        var session = request.auth.credentials;
        // console.log('\n in listPeople request.auth  is',request.auth);
        if (session && session.userid) {
            models.User.get(session.userid, function (err, user) {
                var me;
                if (err) { throw err; }
                if (user && user.approved === false) { 
                    me = user; 
                } else { 
                    me = false; 
                }
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
        } else {
            models.User.all(function(err, data) {
                var approved = _.where(data, { approved: true });
                if (approved.length === 0) {
                    reply.view('listPeople');  
                } else {
                    reply.view('listPeople', {
                        people : approved
                    });
                }
            });
        }
    }
};

exports.edit = {
    auth: 'session',
    handler: function (request, reply) {
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
    }
};

exports.update = {
    auth: 'session',
    handler: function (request, reply) {
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
        }, function (err) {
            if (err) { throw err; }
            else {
                reply().code(201).redirect('/people');
            }
        });
    }
};

exports.delete = {
    auth: 'session',
    handler: function (request, reply) {
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
                    reply.view('deleted').redirect('/people');
                });
            }
            else { reply().code(401).redirect('/'); }
        });
    }
};

exports.approve = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        if (session.moderator) {
            models.User.update(request.params.person, { approved: true }, function (person) {
                console.log('approved:', person.key);
                reply.redirect('/people');
            });
        }
        else { reply.redirect('/'); }
    }
};

exports.admin = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        if (session.admin) {
            models.User.update(request.params.person, { admin: true, moderator: true, approved: true }, function (person) {
                console.log('made admin:', person.key);
                reply().code(200).redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    }
};

exports.moderator = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        if (session.admin) {
            models.User.update(request.params.person, { moderator: true, approved: true }, function (person) {
                console.log('made moderator:', person.key);
                reply().code(200).redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    }
};