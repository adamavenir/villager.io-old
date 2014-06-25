var Hapi    = require('hapi');
var models = require('./server/models');
var routes  = require('./server/routes');
var level   = require('level');
var db      = level('./db', { valueEncoding: 'json' });
var config = require('getconfig');
//var TwitterStrategy = require('passport-twitter').Strategy;

var plugins = [
    {plugin: require('bell')},
    {plugin: require('good')},
    {plugin: require('hapi-auth-cookie')}
    ];

models.attachDB(db);

var serverOptions = {
    views: {
        path: 'templates',
        engines: { jade: require('jade') }
    }
};

var server = new Hapi.Server(config.hostname, config.port, serverOptions);

if (process.env.DEBUG) {
    server.on('internalError', function (event) {
        console.log('um', event);
    });
}

server.pack.register(plugins, function (err) {
    if (err) {
        throw err;
    }
    server.auth.strategy('twitter', 'bell', {
        provider: 'twitter',
        password: config.session.cookieOptions.password,
        clientId: config.auth.twitter.consumerKey,
        clientSecret: config.auth.twitter.consumerSecret,
        isSecure: false
    });

    server.auth.strategy('session', 'cookie', 'required', {
        password: config.session.cookieOptions.password,
        cookie: 'sid',
        redirectTo: '/auth/twitter',
        isSecure: false
    });

    server.route(routes(server));

    server.start(function (err) {
        if (err) { throw err; }
        console.log('triciti.es running on ', 'http://' + config.hostname + ':' + config.port);
    });

});