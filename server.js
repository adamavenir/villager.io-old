var Hapi = require('hapi');
var Bell = require('bell');
var config = require('getconfig');
var Cookie = require('hapi-auth-cookie');
var routes = require('./server/routes');
var Dulcimer = require('dulcimer');
Dulcimer.connect({type: 'level', path: './db'});


var server = new Hapi.Server();

server.connection({ 
    host: config.hostname, 
    port: config.port 
});

server.views({
    engines: { jade: require('jade') },
    path: __dirname + '/templates'
});

server.register([Bell, Cookie], function (err) {

    if (err) {
        throw err;
    }

    server.auth.strategy('twitter', 'bell', {
        provider: 'twitter',
        password: config.auth.twitter.password,
        isSecure: false,
        clientId: config.auth.twitter.clientId,
        clientSecret: config.auth.twitter.clientSecret
    });

    server.auth.strategy('session', 'cookie', {
        password: config.session.cookieOptions.password,
        cookie: 'sid',
        redirectTo: '/login',
        redirectOnTry: false,
        isSecure: false
    });

    server.route(routes(server));

    server.start(function (err) {
        if (err) {
            console.log('error: ', err);
        }
        console.log('triciti.es running at:', server.info.uri);
    });
});

if (process.env.DEBUG) {
    server.on('internalError', function (event) {
        console.log('um', event);
    });
}
