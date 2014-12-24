var models = require('../models').models;
var async = require('async');
var _ = require('underscore');

module.exports = {
    
    listLists: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            places: function (done) {
                models.Place.all(done);
            },
            groups: function (done) {
                models.Group.all(done);
            },
            people: function (done) {
                models.User.all(done);
            },
            lists: function (done) {
                models.List.all(done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            if (session && session.userid) {
                context = _.extend(context, {
                    userid    : session.userid,
                    fullName  : session.fullName,
                    avatar    : session.avatar,
                    moderator : session.moderator,
                    admin     : session.admin
                });
            }
            reply.view('lists', context);
        });
    },

    addList: function (request, reply) {
        var form = request.payload;
        console.log('form is', form);
        if (form.name) {
            var list = models.List.create(form);
            list.save(function (err) {
                if (err) {throw err;}
                reply().redirect('/lists/edit/' + list.slug);
            });
        }
    },

    editList: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            places: function (done) {
                models.Place.all(done);
            },
            groups: function (done) {
                models.Group.all(done);
            },
            people: function (done) {
                models.User.all(done);
            },
            list: function (done) {
                models.List.findByIndex('slug', request.params.listSlug, done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            if (context.list.what === 'groups') {
                context = _.omit(context, ['places', 'people']);
                context.listOptions = context.groups[0];
                delete context.groups;
            }
            else if (context.list.what === 'places') {
                context = _.omit(context, ['groups', 'people']);
                context.listOptions = context.places[0];
                delete context.places;
            }
            else if (context.list.what === 'people') {
                context = _.omit(context, ['places', 'groups']);
                context.listOptions = context.people[0];
                delete context.people;
            }
            else {
                console.log('invalid data type for list');
            }
            context.optionKeys = _.pluck(context.listOptions, 'key');
            context.optionsInList = _.pluck(context.list[context.list.what], 'key');
            context = _.extend(context, {
                userid    : session.userid,
                fullName  : session.fullName,
                avatar    : session.avatar,
                moderator : session.moderator,
                admin     : session.admin
            });
            console.log('context%j', context.optionsInList);
            reply.view('editList', context);
        });
    },

    updateList: function (request, reply) {
        var form = request.payload;
        console.log('form is', form);
        var listElements = form[form.what];
        console.log('listElements', listElements);
        console.log('isArray?', _.isArray(listElements));
        if (!(_.isArray(listElements))) {
            console.log('running');
            form[form.what] = [listElements];
        }
        console.log('form is', form);
        models.List.update(request.params.listKey, form, function (err, list) {
            if (err) { throw err; }
            console.log('list is%j', list);
            reply().redirect('/lists');
        });
    },

    deleteList: function (request, reply) {
        models.List.delete(request.params.listKey, function (err) {
            if (err) { throw err; }
            reply.view('deleted').redirect('/lists');
        });
    }
};