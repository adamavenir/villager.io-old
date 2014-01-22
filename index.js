var Hapi    = require('hapi');
var jade    = require('jade');
var routes  = require('./server/routes');
var level   = require('level');
var db      = level('./db', { valueEncoding: 'json' });
var models = require('./server/models')

models.attachDB(db);

var serverOptions = {
    views: {
        path: 'templates',
        engines: { jade: 'jade' }
    }
};

var server = new Hapi.Server('localhost', 8000, serverOptions);

server.route(routes);

console.log('hapi listening on 8000');

server.start();