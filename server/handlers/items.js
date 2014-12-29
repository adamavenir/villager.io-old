var _ = require('underscore');
var models = require('../models').models;
var h = require('./helpers');

//////////////////////////////////////////////  PLACES

exports.places = {

    list:  {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeListHandler('Place', 'place', 'places')
    },

    get: {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeGetHandler('Place', 'place', 'places')
    },

    add: {
        auth: 'session',
        handler: h.makeAddHandler('Place', 'place', 'places')
    },

    create: {
        auth: 'session',
        handler: h.makeCreateHandler('Place', 'place', 'places')
    },

    edit: {
        auth: 'session',
        handler: h.makeEditHandler('Place', 'place', 'places')
    },

    update: {
        auth: 'session',
        handler: h.makeUpdateHandler('Place', 'place', 'places')
    },

    delete: {
        auth: 'session',
        handler: h.makeDeleteHandler('Place', 'place', 'places')
    },

    star: {
        auth: 'session',
        handler: h.makeStarHandler('Place', 'place', 'places')
    },

    approve: {
        auth: 'session',
        handler: h.makeApproveHandler('Place', 'place', 'places')
    },

};


//////////////////////////////////////////////  GROUPS

exports.groups = {

    list: {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeListHandler('Group', 'group', 'groups')
    },

    get: {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeGetHandler('Group', 'group', 'groups')
    },

    add: {
        auth: 'session',
        handler: h.makeAddHandler('Group', 'group', 'groups')
    },

    create: {
        auth: 'session',
        handler: h.makeCreateHandler('Group', 'group', 'groups')
    },

    edit: {
        auth: 'session',
        handler: h.makeEditHandler('Group', 'group', 'groups')
    },

    update: {
        auth: 'session',
        handler: h.makeUpdateHandler('Group', 'group', 'groups')
    },

    delete: {
        auth: 'session',
        handler: h.makeDeleteHandler('Group', 'group', 'groups')
    },

    star: {
        auth: 'session',
        handler: h.makeStarHandler('Group', 'group', 'groups')
    },

    approve: {
        auth: 'session',
        handler: h.makeApproveHandler('Group', 'group', 'groups')
    },

};

///////////////////////////////////////////// EVENTS

exports.events = {

    list: {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeListHandler('Event', 'event', 'events')
    },

    get: {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeGetHandler('Event', 'event', 'events')
    },

    add: {
        auth: 'session',
        handler: h.makeAddHandler('Event', 'event', 'events')
    },

    create: {
        auth: 'session',
        handler: h.makeCreateHandler('Event', 'event', 'events')
    },

    edit: {
        auth: 'session',
        handler: h.makeEditHandler('Event', 'event', 'events')
    },

    update: {
        auth: 'session',
        handler: h.makeUpdateHandler('Event', 'event', 'events')
    },

    delete: {
        auth: 'session',
        handler: h.makeDeleteHandler('Event', 'event', 'events')
    },

    star: {
        auth: 'session',
        handler: h.makeStarHandler('Event', 'event', 'events')
    },

    approve: {
        auth: 'session',
        handler: h.makeApproveHandler('Event', 'event', 'events')
    },

};

//////////////////////////////////////////////  LISTS

exports.lists = { 

    list: {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeListHandler('List', 'list', 'lists')
    },

    get: {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeGetHandler('List', 'list', 'lists')
    },

    add: {
        auth: 'session',
        handler: h.makeAddHandler('List', 'list', 'lists')
    },

    create: {
        auth: 'session',
        handler: h.makeCreateHandler('List', 'list', 'lists')
    },

    edit: {
        auth: 'session',
        handler: h.makeEditHandler('List', 'list', 'lists')
    },

    update: {
        auth: 'session',
        handler: h.makeUpdateHandler('List', 'list', 'lists')
    },

    delete: {
        auth: 'session',
        handler: h.makeDeleteHandler('List', 'list', 'lists')
    },

    star: {
        auth: 'session',
        handler: h.makeStarHandler('List', 'list', 'lists')
    },

    approve: {
        auth: 'session',
        handler: h.makeApproveHandler('List', 'list', 'lists')
    },

    addplace : {
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
                    reply().redirect('/lists/' + list.slug);
                });
            });
        }
    },

    addgroup: {
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
                    reply().redirect('/lists/' + list.slug);
                });
            });
        }
    }

};