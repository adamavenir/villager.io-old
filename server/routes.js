var views     = require('./views');
var Types     = require('hapi').types;

module.exports = function _routes(server, views) {

  var routes = [

    ////////////////////////////////// STATIC
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

    ////////////////////////////////// PEOPLE
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
      // config: { auth: 'passport' }, 
      handler: this.addPerson 
    },
    { method: 'POST', 
      path: '/people/add', 
      // config: { auth: 'passport' }, 
      handler: this.createPerson 
    },
    { method: 'GET',  
      path: '/profile/edit/{person}', 
      // config: { auth: 'passport' }, 
      handler: this.editPerson 
    }, 
    { method: 'POST', 
      path: '/profile/update/{person}', 
      // config: { auth: 'passport' }, 
      handler: this.updatePerson 
    },       
    { method: 'GET', 
      path: '/people/delete/{personKey}/{personName}', 
      // config: { auth: 'passport' }, 
      handler: this.deletePerson 
    },

    ////////////////////////////////// PLACES
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
      // config: { auth: 'passport' }, 
      handler: this.addPlace 
    },
    { method: 'POST', 
      path: '/places/add', 
      // config: { auth: 'passport' }, 
      handler: this.createPlace 
    },
    { method: 'GET',  
      path: '/places/edit/{place}', 
      // config: { auth: 'passport' }, 
      handler: this.editPlace 
    }, 
    { method: 'POST', 
      path: '/place/update/{place}', 
      // config: { auth: 'passport' }, 
      handler: this.updatePlace 
    },           
    { method: 'GET', 
      path: '/places/delete/{placeKey}/{placeName}', 
      // config: { auth: 'passport' }, 
      handler: this.deletePlace
    },


    ////////////////////////////////// GROUPS
    { method: 'GET',  
      path: '/groups', 
      handler: this.listGroups
    },
    { method: 'GET',
      path: '/groups/{group}', 
      handler: this.getGroup 
    },
    { method: 'GET',  
      path: '/groups/add', 
      // config: { auth: 'passport' }, 
      handler: this.addGroup
    },
    { method: 'POST', 
      path: '/groups/add', 
      // config: { auth: 'passport' }, 
      handler: this.createGroup
    },
    { method: 'GET',  
      path: '/groups/edit/{group}', 
      // config: { auth: 'passport' }, 
      handler: this.editGroup
    }, 
    { method: 'POST', 
      path: '/groups/update/{group}', 
      // config: { auth: 'passport' }, 
      handler: this.updateGroup
    },       
    { method: 'GET', 
      path: '/groups/delete/{groupKey}/{groupName}', 
      // config: { auth: 'passport' }, 
      handler: this.deleteGroup
    },


    ////////////////////////////////// MODERATION
    { method: 'GET',  
      path: '/pending', 
      // config: { auth: 'passport' },
      handler: this.listPending 
    },
    { method: 'GET', 
      path: '/people/approve/{person}', 
      // config: { auth: 'passport' }, 
      handler: this.approvePerson
    },
    { method: 'GET', 
      path: '/places/approve/{place}', 
      // config: { auth: 'passport' }, 
      handler: this.approvePlace
    },    
    { method: 'GET', 
      path: '/groups/approve/{group}', 
      // config: { auth: 'passport' }, 
      handler: this.approveGroup
    },        
    { method: 'GET', 
      path: '/people/moderator/{person}', 
      // config: { auth: 'passport' }, 
      handler: this.moderatorPerson 
    },
    { method: 'GET', 
      path: '/people/admin/{person}', 
      // config: { auth: 'passport' }, 
      handler: this.adminPerson 
    },

    ////////////////////////////////// AUTH

    { method: 'GET', path: '/login', config: { auth: false }, handler: this.login },
    { method: 'GET', path: '/authenticated', handler: this.authenticated },
    { method: 'GET', path: '/session', handler: this.session },
    { method: 'GET', path: '/auth/twitter', config: { auth: false }, handler: this.twitterAuth },
    { method: 'GET', path: '/auth/twitter/callback', config: { auth: false }, handler: this.twitterCallback },
    { method: 'GET', path: '/logout', handler: this.logout }

  ];

  return routes;

}

