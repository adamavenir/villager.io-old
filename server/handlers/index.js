module.exports = {
    admin: require('./admin'),
    auth: require('./auth'),
    authTwitter: require('./authTwitter'),
    authTwilio: require('./authTwilio'),
    categories: require('./categories'),
    events:     require('./items').events,
    groups:     require('./items').groups,
    lists:      require('./items').lists,
    places:     require('./items').places,
    activities: require('./items').activities,
    pages:      require('./pages'),
    people:     require('./people')
};