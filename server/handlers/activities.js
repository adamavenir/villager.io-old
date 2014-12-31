//////////////////////////////////////////////  ACTIVITIES

exports.activities = {

    list:  {
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


//////////////////////////////////////////////  GROUPS