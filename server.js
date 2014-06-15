var Hapi    = require('hapi');
var jade    = require('jade');
var models = require('./server/models')
var views   = require('./server/views');
var routes  = require('./server/routes');
var level   = require('level');
var db      = level('./db', { valueEncoding: 'json' });
var config = require('getconfig');
var TwitterStrategy = require('passport-twitter').Strategy;

var plugins = {
    yar: config.session,
    travelogue: config.auth
};

models.attachDB(db);

var serverOptions = {
    views: {
        path: 'templates',
        engines: { jade: 'jade' }
    }
};

var server = new Hapi.Server(config.hostname, config.port, serverOptions);

if (process.env.DEBUG) {
    server.on('internalError', function (event) {
        console.log('um', event)
    });
};

server.route(routes(server, views(server)));

server.pack.require(plugins, function(err) {
    if (err) {
        throw err;
    }

    server.auth.strategy('passport', 'passport', true);

    var Passport = server.plugins.travelogue.passport;

    Passport.use(new TwitterStrategy(config.auth.twitter, function (accessToken, refreshToken, profile, done) {   
        return done(null, profile);
    }));

    Passport.serializeUser(function(user, done) {
        done(null, user);
    });

    Passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    server.start(function (err) {
        if (err) { throw err; }
        console.log('triciti.es running on ', 'http://' + config.hostname + ':' + config.port);
    })

});