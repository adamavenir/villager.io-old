module.exports = {
    admin:      require('./admin'),
    auth:       require('./auth'),
    categories: require('./categories'),
    events:     require('./items').events,
    groups:     require('./items').groups,
    lists:      require('./items').lists,
    places:     require('./items').places,    
    pages:      require('./pages'),
    people:     require('./people')
};