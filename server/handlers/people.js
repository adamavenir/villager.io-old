var models = require('../models').models;
var _ = require('underscore');
var async = require('async');


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
                models.User.getByIndex('approved', true, function(err, approved, page) {
                    if(me === false && page.count === 0) {
                        reply.view('people/noPeople', {
                            userid    : session.userid,
                            fullName  : session.fullName,
                            avatar    : session.avatar,
                            moderator : session.moderator,
                            admin     : session.admin
                        });
                    }
                    else {
                        reply.view('people/listPeople', {
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
            models.User.getByIndex('approved', true, function(err, approved, page) {
                if (page.count === 0) {
                    reply.view('people/noPeople');  
                } else {
                    reply.view('people/listPeople', {
                        people : approved
                    });
                }
            });
        }
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
                    reply.view('people/person', {
                        person    : value,
                        userid    : session.userid,
                        fullName  : session.fullName,
                        avatar    : session.avatar,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                } else {
                    reply.view('people/person', { person: value });
                }
            }
        });
    }
};

exports.add = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        reply.view('people/addPerson', {
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
        var p = models.User.create({
            fullName  : form.fullName,
            email     : form.email,
            twitter   : form.twitter,
            website   : form.website,
            company   : form.company,
            about     : form.about,
            creator   : session.userid,
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

exports.edit = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        models.User.get(request.params.key, function (err, person) {
            reply.view('people/editPerson', {
                person    : person,
                userid    : session.userid,
                fullName  : session.fullName,
                avatar    : session.avatar,
                moderator : session.moderator,
                admin     : session.admin
            });
        });
    }
};

exports.update = {
    auth: 'session',
    handler: function (request, reply) {
        var form = request.payload;
        models.User.update(request.params.key, form, function (err) {
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
                models.User.get(request.params.key, done);
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
            models.User.update(request.params.key, { approved: true }, function () {
                // console.log('approved:', person.key);
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
            models.User.update(request.params.key, { admin: true, moderator: true, approved: true }, function () {
                // console.log('made admin:', person.key);
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
            models.User.update(request.params.key, { moderator: true, approved: true }, function () {
                // console.log('made moderator:', person.key);
                reply().code(200).redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    }
};
