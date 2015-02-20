var h = require('./helpers');
var _ = require('underscore');
var models = require('../models').models;

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

//////////////////////////////////////////////  ACTIVITIES

exports.activities = {

    list: {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeListHandler('Activity', 'activity', 'activities')
    },

    get: {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeGetHandler('Activity', 'activity', 'activities')
    },

    add: {
        auth: 'session',
        handler: h.makeAddHandler('Activity', 'activity', 'activities')
    },

    create: {
        auth: 'session',
        handler: h.makeCreateHandler('Activity', 'activity', 'activities')
    },

    edit: {
        auth: 'session',
        handler: h.makeEditHandler('Activity', 'activity', 'activities')
    },

    update: {
        auth: 'session',
        handler: h.makeUpdateHandler('Activity', 'activity', 'activities')
    },

    delete: {
        auth: 'session',
        handler: h.makeDeleteHandler('Activity', 'activity', 'activities')
    },

    star: {
        auth: 'session',
        handler: h.makeStarHandler('Activity', 'activity', 'activities')
    },

    approve: {
        auth: 'session',
        handler: h.makeApproveHandler('Activity', 'activity', 'activities')
    },

};

///////////////////////////////////////////// EVENTS

exports.events = {

    list: {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeListHandler('Event', 'event', 'events'),
    },

    get: {
        auth: { strategy: 'session', mode: 'try' },
        handler: h.makeGetHandler('Event', 'event', 'events')
    },

    add: {
        auth: 'session',
        handler: function (request, reply) {
            models.Event.getPossibleRelatedOptions(function (err, result) {
                if (err) { 
                    throw err; 
                }
                reply.view('items/addEvent', _.extend(result, request.auth.credential));
            });
        }
    },

    create: {
        auth: 'session',
        handler: h.makeCreateHandler('Event', 'event', 'events')
    },

    edit: {
        auth: 'session',
        handler: function (request, reply) {
            models.Event.get(request.params.key, function (err, event) {
                if (err) { 
                    throw err; 
                }
                if (!event) {
                    return reply.view('404');
                }
                
                // fetch all our available options
                models.Event.getPossibleRelatedOptions(function (err, result) {
                    if (err) { 
                        throw err; 
                    }
                    reply.view('items/editEvent', _.extend(result, request.auth.credential, {item: event}));
                });
            });
        }
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

    at: {
        auth: 'session',
        handler: function (request, reply) {
            models.Place.findByIndex('slug', request.params.slug, function (err, place) {
                if (err) {
                    reply.view('404');
                    return;
                }
                models.Event.getByIndex('place', place.key, function (err, events) {
                    //TODO: make this right
                    if (err || events.length === 0) {
                        reply('no events');
                    } else {
                        reply.view('eventsByPlace', {place: place, events: events});
                    }
                });
            });
        }
    },

    by: {
        auth: 'session',
        handler: function (request, reply) {
            models.Group.findByIndex('slug', request.params.slug, function (err, group) {
                if (err) {
                    throw err;
                }

                if (!group) {
                    return reply.view('404');
                }

                models.Event.getByIndex('group', group.key, function (err, events) {
                    //TODO: make this right
                    if (err || events.length === 0) {
                        reply('no events');
                    } else {
                        reply.view('eventsByGroup', {group: group, events: events});
                    }
                });
            });
        }
    },

    atList: {
    },

    byList: {
    }

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

    select: {
        auth: 'session',
        handler: h.makeListSelectHandler()
    },

    addToList: {
        auth: 'session',
        handler: h.makeAddToListHandler()
    },

    removeFromList: {
        auth: 'session',
        handler: h.makeRemoveFromListHandler()
    },

};
