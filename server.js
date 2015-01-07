var Hapi = require('hapi');
var Bell = require('bell');
var config = require('./config-helper');
var Cookie = require('hapi-auth-cookie');
var BSS = require('building-static-server');
var routes = require('./server/routes');
var Dulcimer = require('dulcimer');

Dulcimer.connect({ 
    type: config.DBTYPE, 
    path: config.DBPATH 
});

var server = new Hapi.Server();

server.connection({ 
    host: config.HOSTNAME, 
    port: config.PORT 
});

server.views({
    engines: { jade: require('jade') },
    path: __dirname + '/templates'
});

server.register([Bell, Cookie], function (err) {

    if (err) { throw err; }

    server.auth.strategy('twitter', 'bell', {
        provider: 'twitter',
        password: config.TWITTERPASSWORD,
        isSecure: false,
        clientId: config.TWITTERID,
        clientSecret: config.TWITTERSECRET
    });

    server.auth.strategy('session', 'cookie', {
        password: config.COOKIEPASSWORD,
        cookie: 'sid',
        redirectTo: config.REDIRECTLOGIN,
        redirectOnTry: false,
        isSecure: config.COOKIESECURE
    });

    server.route(routes(server));

    var init = function (err) {
        if (err) { throw err; }
        if (!module.parent) {
            server.start(function (err) {
                if (err) { console.log('error: ', err); }
                console.log('triciti.es running at:', server.info.uri);
            });
        }
    };

    if (config.getconfig.env === 'dev') {
        server.register(BSS, init);
    }
    else {
        init();
    }

});

if (process.env.DEBUG) {
    server.on('internalError', function (event) {
        console.log('um', event);
    });
}

module.exports = server;
