var Hapi      = require('hapi');
var config    = require('getconfig');
var jade      = require('jade');
var routes    = require('./server/routes');
var traverse  = require('traverse');
var _         = require('underscore');

var serverOptions = {
    views: {
        path: 'templates',
        engines: { jade: 'jade' }
    }
};

var server = new Hapi.Server('localhost', config.http.port, serverOptions);

var travelogue_config = config.auth;
traverse(travelogue_config).forEach(function () {
    if (this.key === 'callbackPath') {
        this.parent.node.callbackURL = config.http.externalURL + this.node;
    }
});

server.pack.require({
        yar: config.session,
        travelogue: travelogue_config,
    },
    function pluginsCallback(err) {
        var Passport = server.plugins.travelogue.passport;
        if (err) throw err;
        // add our login routes
        server.route(routes(Passport));

        server.start(function () {
            console.log('triciti.es listening at:', server.info.uri);
        });
        server.on('internalError', function internalError(event) {
            console.log('[server internalError]', event);
        });
    }
);