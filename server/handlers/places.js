var h = require('./helpers');

exports.list = {
    auth: { strategy: 'session', mode: 'try' },
    handler: h.makeListHandler('Place', 'place', 'places')
};

exports.get = {
    auth: { strategy: 'session', mode: 'try' },
    handler: h.makeGetHandler('Place', 'place', 'places')
};

exports.add = {
    auth: 'session',
    handler: h.makeAddHandler('Place', 'place', 'places')
};

exports.create = {
    auth: 'session',
    handler: h.makeCreateHandler('Place', 'place', 'places')
};

exports.edit = {
    auth: 'session',
    handler: h.makeEditHandler('Place', 'place', 'places')
};

exports.update = {
    auth: 'session',
    handler: h.makeUpdateHandler('Place', 'place', 'places')
};

exports.delete = {
    auth: 'session',
    handler: h.makeDeleteHandler('Place', 'place', 'places')
};

exports.star = {
    auth: 'session',
    handler: h.makeStarHandler('Place', 'place', 'places')
};

exports.approve = {
    auth: 'session',
    handler: h.makeApproveHandler('Place', 'place', 'places')
};