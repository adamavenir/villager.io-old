var views     = require('./views');
var Types     = require('hapi').types;

module.exports = function _routes(server, views) {

  var Passport = server.plugins.travelogue.passport;

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

    { method: 'GET',  
      path: '/', 
      handler: this.index 
    },

    // PEOPLE
    { method: 'GET',  
      path: '/people', 
      handler: this.listPeople 
    },
    { method: 'GET',
      path: '/people/{person}',
      handler: this.getPerson 
    },
    { method: 'GET',  
      path: '/people/add', 
      config: { auth: 'passport' }, 
      handler: this.formPerson 
    },
    { method: 'POST', 
      path: '/people/add', 
      config: { auth: 'passport' }, 
      handler: this.createPerson 
    },
    { method: 'GET', 
      path: '/people/delete/{person}', 
      config: { auth: 'passport' }, 
      handler: this.deletePerson 
    },

    // PLACES
    { method: 'GET',  
      path: '/places', 
      handler: this.listPlaces
    },
    { method: 'GET',
      path: '/places/{place}', 
      handler: this.getPlace 
    },
    { method: 'GET',  
      path: '/places/add', 
      config: { auth: 'passport' }, 
      handler: this.formPlace 
    },
    { method: 'POST', 
      path: '/places/add', 
      config: { auth: 'passport' }, 
      handler: this.createPlace 
    },
    { method: 'GET', 
      path: '/places/delete/{place}', 
      config: { auth: 'passport' }, 
      handler: this.deletePlace
    },

    // MODERATION
    { method: 'GET',  
      path: '/pending', 
      config: { auth: 'passport' },
      handler: this.listPending 
    },
    { method: 'GET', 
      path: '/pending/approve/{item}', 
      config: { auth: 'passport' }, 
      handler: this.approveItem
    },
    { method: 'GET', 
      path: '/people/moderator/{person}', 
      config: { auth: 'passport' }, 
      handler: this.moderatorPerson 
    },
    { method: 'GET', 
      path: '/people/admin/{person}', 
      config: { auth: 'passport' }, 
      handler: this.adminPerson 
    },

    // AUTH

    { method: 'GET', path: '/login', handler: this.login },
    { method: 'GET', path: '/authenticated', handler: this.authenticated },
    { method: 'GET', path: '/session', handler: this.session },
    { method: 'GET', path: '/auth/twitter', handler: this.twitterAuth },
    { method: 'GET', path: '/auth/twitter/callback', handler: this.twitterCallback },
    { method: 'GET', path: '/logout', handler: this.logout }

  ];

  return routes;

}

