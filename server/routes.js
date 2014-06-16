var views     = require('./views');

module.exports = function _routes() {

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
      handler: views.pages.index 
    },

    ////////////////////////////////// PEOPLE
    { method: 'GET',  
      path: '/people', 
      handler: views.people.listPeople 
    },
    { method: 'GET',
      path: '/people/{person}',
      handler: views.people.getPerson 
    },
    { method: 'GET',  
      path: '/people/add', 
      // config: { auth: 'passport' }, 
      handler: views.people.addPerson 
    },
    { method: 'POST', 
      path: '/people/add', 
      // config: { auth: 'passport' }, 
      handler: views.people.createPerson 
    },
    { method: 'GET',  
      path: '/profile/edit/{person}', 
      // config: { auth: 'passport' }, 
      handler: views.people.editPerson 
    }, 
    { method: 'POST', 
      path: '/profile/update/{person}', 
      // config: { auth: 'passport' }, 
      handler: views.people.updatePerson 
    },       
    { method: 'GET', 
      path: '/people/delete/{personKey}/{personName}', 
      // config: { auth: 'passport' }, 
      handler: views.people.deletePerson 
    },

    ////////////////////////////////// PLACES
    { method: 'GET',  
      path: '/places', 
      handler: views.places.listPlaces
    },
    { method: 'GET',
      path: '/places/{place}', 
      handler: views.places.getPlace 
    },
    { method: 'GET',  
      path: '/places/add', 
      // config: { auth: 'passport' }, 
      handler: views.places.addPlace 
    },
    { method: 'POST', 
      path: '/places/add', 
      // config: { auth: 'passport' }, 
      handler: views.places.createPlace 
    },
    { method: 'GET',  
      path: '/places/edit/{place}', 
      // config: { auth: 'passport' }, 
      handler: views.places.editPlace 
    }, 
    { method: 'POST', 
      path: '/place/update/{place}', 
      // config: { auth: 'passport' }, 
      handler: views.places.updatePlace 
    },           
    { method: 'GET', 
      path: '/places/delete/{placeKey}/{placeName}', 
      // config: { auth: 'passport' }, 
      handler: views.places.deletePlace
    },


    ////////////////////////////////// GROUPS
    { method: 'GET',  
      path: '/groups', 
      handler: views.groups.listGroups
    },
    { method: 'GET',
      path: '/groups/{group}', 
      handler: views.groups.getGroup 
    },
    { method: 'GET',  
      path: '/groups/add', 
      // config: { auth: 'passport' }, 
      handler: views.groups.addGroup
    },
    { method: 'POST', 
      path: '/groups/add', 
      // config: { auth: 'passport' }, 
      handler: views.groups.createGroup
    },
    { method: 'GET',  
      path: '/groups/edit/{group}', 
      // config: { auth: 'passport' }, 
      handler: views.groups.editGroup
    }, 
    { method: 'POST', 
      path: '/groups/update/{group}', 
      // config: { auth: 'passport' }, 
      handler: views.groups.updateGroup
    },       
    { method: 'GET', 
      path: '/groups/delete/{groupKey}/{groupName}', 
      // config: { auth: 'passport' }, 
      handler: views.groups.deleteGroup
    },


    ////////////////////////////////// MODERATION
    { method: 'GET',  
      path: '/pending', 
      // config: { auth: 'passport' },
      handler: views.moderation.listPending 
    },
    { method: 'GET', 
      path: '/people/approve/{person}', 
      // config: { auth: 'passport' }, 
      handler: views.moderation.approvePerson
    },
    { method: 'GET', 
      path: '/places/approve/{place}', 
      // config: { auth: 'passport' }, 
      handler: views.moderation.approvePlace
    },    
    { method: 'GET', 
      path: '/groups/approve/{group}', 
      // config: { auth: 'passport' }, 
      handler: views.moderation.approveGroup
    },        
    { method: 'GET', 
      path: '/people/moderator/{person}', 
      // config: { auth: 'passport' }, 
      handler: views.moderation.moderatorPerson 
    },
    { method: 'GET', 
      path: '/people/admin/{person}', 
      // config: { auth: 'passport' }, 
      handler: views.moderation.adminPerson 
    },

    ////////////////////////////////// AUTH

    { method: 'GET', path: '/login', config: { auth: false }, handler: views.auth.login },
    { method: 'GET', path: '/authenticated', handler: views.auth.authenticated },
    { method: 'GET', path: '/session', handler: views.auth.session },
    { method: 'GET', path: '/auth/twitter', config: { auth: false }, handler: views.auth.twitterAuth },
    { method: 'GET', path: '/auth/twitter/callback', config: { auth: false }, handler: views.auth.twitterCallback },
    { method: 'GET', path: '/logout', handler: views.auth.logout }

  ];

  return routes;

};

