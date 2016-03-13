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