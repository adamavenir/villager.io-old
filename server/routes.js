var views = require('./views');

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
      handler: views.pages.index,
      config: {
        auth: {
          strategy: 'session',
          mode: 'try'
        }
      }
    },
    ////////////////////////////////// TINKER

    { method: 'GET',
      path: '/tinker',
      config: { auth: 'session' }, 
      handler: views.pages.tinker
    },
    { method: 'POST',
      path: '/tinker/add-interest',
      config: { auth: 'session' }, 
      handler: views.categories.addInterest
    },
    { method: 'POST',
      path: '/tinker/add-group-category',
      config: { auth: 'session' }, 
      handler: views.categories.addGroupCategory
    },
    { method: 'POST',
      path: '/tinker/add-place-category',
      config: { auth: 'session' }, 
      handler: views.categories.addPlaceCategory
    },
    { method: 'GET',
      path: '/tinker/delete/{categoryType}/{modelSlug}',
      config: { auth: 'session' }, 
      handler: views.categories.delete
    },
    { method: 'GET',
      path: '/tinker/edit/{categoryType}/{modelSlug}',
      config: { auth: 'session' }, 
      handler: views.categories.edit
    },
    { method: 'POST',
      path: '/tinker/update/{categoryType}/{modelKey}',
      config: { auth: 'session' }, 
      handler: views.categories.update
    },

    ////////////////////////////////// LISTS

    { method: 'GET',
      path: '/lists',
      config: { 
        auth: { 
          strategy: 'session',
          mode: 'try'
        },
        handler: views.lists.listLists 
      }
    },
    { method: 'POST',
      path: '/lists/add',
      config: { auth: 'session' },
      handler: views.lists.addList
    },
    { method: 'GET',
      path: '/lists/edit/{listSlug}',
      config: { auth: 'session' },
      handler: views.lists.editList
    },
    { method: 'POST',
      path: '/lists/update/{listKey}',
      config: { auth: 'session' },
      handler: views.lists.updateList
    },
    { method: 'GET',
      path: '/lists/delete/{listKey}',
      config: { auth: 'session' },
      handler: views.lists.deleteList
    },

    ////////////////////////////////// PEOPLE

    { method: 'GET',  
      path: '/people', 
      config: { 
        auth: { 
          strategy: 'session',
          mode: 'try'
        },
        handler: views.people.listPeople 
      }
    },
    { method: 'GET',
      path: '/people/{person}',
      config: { 
        auth: { 
          strategy: 'session',
          mode: 'try' 
        },
        handler: views.people.getPerson
      } 
    },
    { method: 'GET',
      path: '/people/add',
      config: { auth: 'session' }, 
      handler: views.people.addPerson
    },
    { method: 'POST',
      path: '/people/add',

      handler: views.people.createPerson
    },
    { method: 'GET',
      path: '/profile/edit/{person}',
      config: { auth: 'session' }, 
      handler: views.people.editPerson
    },
    { method: 'POST',
      path: '/profile/update/{person}',
      config: { auth: 'session' }, 
      handler: views.people.updatePerson
    },
    { method: 'GET',
      path: '/people/delete/{personKey}/{personName}',
      config: { auth: 'session' }, 
      handler: views.people.deletePerson
    },

    ////////////////////////////////// PLACES
    { method: 'GET',  
      path: '/places',
      config: { 
        auth: { 
          strategy: 'session',
          mode: 'try'
        },
        handler: views.places.listPlaces
      }
    },
    { method: 'GET',
      path: '/places/{place}', 
      config: { 
        auth: { 
          strategy: 'session',
          mode: 'try' 
        },
        handler: views.places.getPlace
      }
    },
    { method: 'GET',
      path: '/places/add',
      config: { auth: 'session' }, 
      handler: views.places.addPlace
    },
    { method: 'POST',
      path: '/places/add',
      config: { auth: 'session' }, 
      handler: views.places.createPlace
    },
    { method: 'GET',
      path: '/places/edit/{placeSlug}',
      config: { auth: 'session' }, 
      handler: views.places.editPlace
    },
    { method: 'POST',
      path: '/places/update/{placeKey}',
      config: { auth: 'session' }, 
      handler: views.places.updatePlace
    },
    { method: 'GET',
      path: '/places/star/{placeKey}',
      handler: views.places.starPlace
    },
    { method: 'GET',
      path: '/places/delete/{placeKey}/{placeName}',
      config: { auth: 'session' }, 
      handler: views.places.deletePlace
    },


    ////////////////////////////////// GROUPS
    { method: 'GET',  
      path: '/groups', 
      config: { 
        auth: { 
          strategy: 'session',
          mode: 'try'
        },
        handler: views.groups.listGroups
      }
    },
    { method: 'GET',
      path: '/groups/{group}',
      config: { 
        auth: { 
          strategy: 'session',
          mode: 'try'
        },
        handler: views.groups.getGroup
      }
    },
    { method: 'GET',
      path: '/groups/add',
      config: { auth: 'session' }, 
      handler: views.groups.addGroup
    },
    { method: 'POST',
      path: '/groups/add',
      config: { auth: 'session' }, 
      handler: views.groups.createGroup
    },
    { method: 'GET',
      path: '/groups/edit/{groupSlug}',
      config: { auth: 'session' }, 
      handler: views.groups.editGroup
    },
    { method: 'POST',
      path: '/groups/update/{groupKey}',
      config: { auth: 'session' }, 
      handler: views.groups.updateGroup
    },
    { method: 'GET',
      path: '/groups/star/{groupKey}',
      handler: views.groups.starGroup
    },
    { method: 'GET',
      path: '/groups/delete/{groupKey}/{groupName}', 
      config: { auth: 'session' }, 
      handler: views.groups.deleteGroup
    },


    ////////////////////////////////// MODERATION

    { method: 'GET',  
      path: '/pending', 
      config: { 
        auth: { 
          strategy: 'session',
          mode: 'try'
        },
        handler: views.moderation.listPending
      }
    },
    { method: 'GET',
      path: '/people/approve/{person}',
      config: { auth: 'session' },
      handler: views.moderation.approvePerson
    },
    { method: 'GET',
      path: '/places/approve/{place}',
      config: { auth: 'session' },
      handler: views.moderation.approvePlace
    },
    { method: 'GET',
      path: '/groups/approve/{group}',
      config: { auth: 'session' },
      handler: views.moderation.approveGroup
    },
    { method: 'GET',
      path: '/people/moderator/{person}',
      config: { auth: 'session' },
      handler: views.moderation.moderatorPerson
    },
    { method: 'GET',
      path: '/people/admin/{person}',
      config: { auth: 'session' },
      handler: views.moderation.adminPerson

    },

    ////////////////////////////////// AUTH

    { 
      method: ['GET', 'POST'], 
      path: '/auth/twitter', 
      config: { 
        auth: 'twitter',
        handler: views.auth.login
      },  
    },
    { 
      method: 'GET', 
      path: '/session', 
      handler: views.auth.session 
    },
    { 
      method: 'GET', 
      path: '/logout',
      handler: views.auth.logout 
    }

  ];

  return routes;

};

