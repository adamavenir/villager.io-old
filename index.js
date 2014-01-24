var Hapi    = require('hapi');
var jade    = require('jade');
var routes  = require('./server/routes');
var level   = require('level');
var db      = level('./db', { valueEncoding: 'json' });
var models = require('./server/models')
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('getconfig');


var plugins = {
    yar: {
        cookieOptions: {
            password: 'worldofwalmart',
            isSecure: false
        }
    },
    travelogue: '../../' // use '../../' instead of travelogue if testing this repo locally
};

models.attachDB(db);

var serverOptions = {
    views: {
        path: 'templates',
        engines: { jade: 'jade' }
    }
};

var server = new Hapi.Server(config.hostname, config.port, serverOptions);
server.pack.require(plugins, function(err) {
  if (err) {
    throw err;
  }
});

var Passport = server.plugins.travelogue.passport;
Passport.use(new TwitterStrategy(config.twitter, function(accessToken, refreshToken, profile, done) {

  // TODO find or create user here..

  return done(null, profile);
}));

Passport.serializeUser(function(user, done) {
    done(null, user);
});

Passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

if (process.env.DEBUG) {
    server.on('internalError', function (event) {
        console.log(event)
    });
};

server.route(routes);

console.log('hapi listening on ', config.port);

server.start();