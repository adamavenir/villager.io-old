var Hapi    = require('hapi');
var jade    = require('jade');
// var routes  = require('./server/routes');
var views     = require('./server/views');
var level   = require('level');
var db      = level('./db', { valueEncoding: 'json' });
var models = require('./server/models')
var config = require('getconfig');
var TwitterStrategy = require('passport-twitter').Strategy;

var plugins = {
    yar: {
        cookieOptions: {
            password: 'worldofwalmart',
            isSecure: false
        }
    },
    travelogue: config // use '../../' instead of travelogue if testing this repo locally
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
    console.log('shit broke: ', err);
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
        console.log('um', event)
    });
};


var routes = [

  // GET STATIC FILES
  { method: 'GET',  path: '/{path*}',   
    handler: {
      directory: { 
        path: './public', 
        listing: false, 
        index: true 
      }
    }  
  },

  { method: 'GET',  path: '/', handler: views.index },

  // PEOPLE
  { method: 'GET',  path: '/people', handler: views.listPeople },
  { method: 'GET',  path: '/people/{person}', handler: views.getPerson },
  { method: 'GET',  path: '/people/add', handler: views.formPerson },
  { method: 'POST', path: '/people/add', handler: views.createPerson },
  { method: 'GET', path: '/people/delete/{person}', handler: views.deletePerson },

  // PLACES
  { method: 'GET',  path: '/places', handler: views.listPlaces },
  { method: 'GET',  path: '/places/{place}', handler: views.getPlace },
  { method: 'GET',  path: '/places/add', handler: views.formPlace },
  { method: 'POST', path: '/places/add', handler: views.createPlace },
  { method: 'POST',  path: '/places/delete/{place}', handler: views.deletePlace },  

  // AUTH

  { method: 'GET', path: '/login',
    config: {
      handler: function (request, reply) {
        Passport.authenticate('twitter')(request, reply);
        var html = '<a href="/auth/twitter">Login with Twitter</a>';
        if (request.session) {
          html += "<br/><br/><pre><span style='background-color: #eee'>session: " + JSON.stringify(request.session, null, 2) + "</span></pre>";
        }
        reply(html);
      }
    }
  },

  { method: 'GET', path: '/auth/twitter',
    config: {
      handler: function (request, reply) {
        Passport.authenticate('twitter')(request, reply);
      }
    }
  },  

  { method: 'GET', path: '/auth/twitter/callback',
    config: {
      handler: function (request, reply) {
        Passport.authenticate('twitter', {
          failureRedirect: '/login',
          successRedirect: '/',
          failureFlash: true
        })(request, reply, function () {
          reply().redirect('/');
        });
      }
    }
  },

  { method: 'GET', path: '/logout',
    config: {
      handler: function (request, reply) {
        request.session_logout();
      }
    }

  }

];

server.route(routes);

console.log('hapi listening on ', config.port);

server.start();