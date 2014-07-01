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
      handler: views.pages.index,
      config: {
        auth: {
          mode: 'optional'
        }
      }
    },
    ////////////////////////////////// TINKER

    { method: 'GET',
      path: '/tinker',
      handler: views.pages.tinker
    },
    { method: 'POST',
      path: '/tinker/add-interest',
      handler: views.categories.addInterest
    },
    { method: 'POST',
      path: '/tinker/add-group-category',
      handler: views.categories.addGroupCategory
    },
    { method: 'POST',
      path: '/tinker/add-place-category',
      handler: views.categories.addPlaceCategory
    },
    { method: 'GET',
      path: '/tinker/delete/{categoryType}/{modelSlug}',
      handler: views.categories.delete
    },
    { method: 'GET',
      path: '/tinker/edit/{categoryType}/{modelSlug}',
      handler: views.categories.edit
    },
    { method: 'POST',
      path: '/tinker/update/{categoryType}/{modelKey}',
      handler: views.categories.update
    },

    ////////////////////////////////// LISTS

    { method: 'GET',
      path: '/lists',
      handler: views.lists.main
    },
    { method: 'POST',
      path: '/lists/add',
      handler: views.lists.addList
    },
    { method: 'GET',
      path: '/lists/edit/{listSlug}',
      handler: views.lists.editList
    },
    { method: 'POST',
      path: '/lists/update/{listKey}',
      handler: views.lists.updateList
    },
    { method: 'GET',
      path: '/lists/delete/{listKey}',
      handler: views.lists.deleteList
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

      handler: views.people.addPerson
    },
    { method: 'POST',
      path: '/people/add',

      handler: views.people.createPerson
    },
    { method: 'GET',
      path: '/profile/edit/{person}',

      handler: views.people.editPerson
    },
    { method: 'POST',
      path: '/profile/update/{person}',

      handler: views.people.updatePerson
    },
    { method: 'GET',
      path: '/people/delete/{personKey}/{personName}',

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

      handler: views.places.addPlace
    },
    { method: 'POST',
      path: '/places/add',

      handler: views.places.createPlace
    },
    { method: 'GET',
      path: '/places/edit/{placeSlug}',

      handler: views.places.editPlace
    },
    { method: 'POST',
      path: '/places/update/{placeKey}',

      handler: views.places.updatePlace
    },
    { method: 'GET',
      path: '/places/star/{placeKey}',
      handler: views.places.starPlace
    },
    { method: 'GET',
      path: '/places/delete/{placeKey}/{placeName}',

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

      handler: views.groups.addGroup
    },
    { method: 'POST',
      path: '/groups/add',

      handler: views.groups.createGroup
    },
    { method: 'GET',
      path: '/groups/edit/{groupSlug}',

      handler: views.groups.editGroup
    },
    { method: 'POST',
      path: '/groups/update/{groupKey}',

      handler: views.groups.updateGroup
    },
    { method: 'GET',
      path: '/groups/star/{groupKey}',
      handler: views.groups.starGroup
    },
    { method: 'GET',
      path: '/groups/delete/{groupKey}/{groupName}',

      handler: views.groups.deleteGroup
    },


    ////////////////////////////////// MODERATION
    { method: 'GET',
      path: '/pending',

      handler: views.moderation.listPending
    },
    { method: 'GET',
      path: '/people/approve/{person}',

      handler: views.moderation.approvePerson
    },
    { method: 'GET',
      path: '/places/approve/{place}',

      handler: views.moderation.approvePlace
    },
    { method: 'GET',
      path: '/groups/approve/{group}',

      handler: views.moderation.approveGroup
    },
    { method: 'GET',
      path: '/people/moderator/{person}',

      handler: views.moderation.moderatorPerson
    },
    { method: 'GET',
      path: '/people/admin/{person}',

      handler: views.moderation.adminPerson
    },

    ////////////////////////////////// AUTH

    { method: ['GET', 'POST'],
      path: '/auth/twitter',
      config: { auth: {
                 strategies: ['twitter'],
                 mode: 'optional'
               },
                plugins: {'hapi-auth-cookie': {redirectTo: false}}
              },
      handler: views.auth.login },
    { method: 'GET', path: '/session', handler: views.auth.session },
    { method: 'GET', path: '/logout', handler: views.auth.logout }

  ];

  return routes;

};

