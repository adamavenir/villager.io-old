var auth = require('./handlers').auth;
var categories = require('./handlers').categories;
var groups = require('./handlers').groups;
var lists = require('./handlers').lists;
var pages = require('./handlers').pages;
var pending = require('./handlers').pending;
var people = require('./handlers').people;
var places = require('./handlers').places;
var events = require('./handlers').events;

module.exports = function _routes() {

  var routes = [

    ////////////////////////////////// STATIC

    { method: 'GET', path: '/{path*}',
      handler: { directory: { path: './public', listing: false, index: true } } 
    },

    ////////////////////////////////// HOME 

    { method: 'GET',  path: '/', config: pages.index, },

    ////////////////////////////////// TINKER

    { method: 'GET',  path: '/tinker', config: pages.tinker },
    { method: 'GET',  path: '/tinker/delete/{categoryType}/{modelSlug}', config: categories.delete },
    { method: 'GET',  path: '/tinker/edit/{categoryType}/{modelSlug}', config: categories.edit },
    { method: 'POST', path: '/tinker/update/{categoryType}/{modelKey}', config: categories.update },

    // move these  
    { method: 'POST', path: '/tinker/add-group-category', config: categories.addGroupCategory },
    { method: 'POST', path: '/tinker/add-place-category', config: categories.addPlaceCategory },

    ////////////////////////////////// PEOPLE

    { method: 'GET',  path: '/people', config: people.list },
    { method: 'GET',  path: '/people/{person}', config: people.get },
    { method: 'GET',  path: '/people/add', config: people.add },
    { method: 'POST', path: '/people/add', config: people.create },
    { method: 'GET',  path: '/profile/edit/{personKey}', config: people.edit },
    { method: 'POST', path: '/people/update/{personKey}', config: people.update },
    { method: 'GET',  path: '/people/delete/{personKey}/{personName}', config: people.delete },
    { method: 'GET',  path: '/people/approve/{person}', config: people.approve },
    { method: 'GET',  path: '/people/moderator/{person}', config: people.moderator },
    { method: 'GET',  path: '/people/admin/{person}', config: people.admin },

    ////////////////////////////////// PLACES

    { method: 'GET',  path: '/places', config: places.list },
    { method: 'GET',  path: '/places/{slug}', config: places.get },
    { method: 'GET',  path: '/places/add', config: places.add },
    { method: 'POST', path: '/places/add', config: places.create },
    { method: 'GET',  path: '/places/edit/{key}', config: places.edit },
    { method: 'POST', path: '/places/update/{key}', config: places.update },
    { method: 'GET',  path: '/places/star/{key}', config: places.star },
    { method: 'GET',  path: '/places/approve/{key}', config: places.approve },
    { method: 'GET',  path: '/places/delete/{key}', config: places.delete },

    ////////////////////////////////// GROUPS

    { method: 'GET',  path: '/groups', config: groups.list },
    { method: 'GET',  path: '/groups/{slug}', config: groups.get },
    { method: 'GET',  path: '/groups/add', config: groups.add },
    { method: 'POST', path: '/groups/add', config: groups.create },
    { method: 'GET',  path: '/groups/edit/{key}', config: groups.edit },
    { method: 'POST', path: '/groups/update/{key}', config: groups.update },
    { method: 'GET',  path: '/groups/star/{key}', config: groups.star },
    { method: 'GET',  path: '/groups/approve/{key}', config: groups.approve },
    { method: 'GET',  path: '/groups/delete/{key}/{slug}', config: groups.delete },

    ////////////////////////////////// EVENTS

    { method: 'GET',  path: '/events', config: events.list },
    { method: 'GET',  path: '/events/{slug}', config: events.get },
    { method: 'GET',  path: '/events/add', config: events.add },
    { method: 'POST', path: '/events/add', config: events.create },
    { method: 'GET',  path: '/events/edit/{key}', config: events.edit },
    { method: 'POST', path: '/events/update/{key}', config: events.update },
    { method: 'GET',  path: '/events/star/{key}', config: events.star },
    { method: 'GET',  path: '/events/approve/{key}', config: events.approve },
    { method: 'GET',  path: '/events/delete/{key}/{slug}', config: events.delete },

    ////////////////////////////////// LISTS

    { method: 'GET',  path: '/lists', config: lists.list },
    { method: 'GET',  path: '/lists/{slug}', config: lists.get },
    { method: 'GET',  path: '/lists/add', config: lists.add },
    { method: 'POST', path: '/lists/add', config: lists.create },
    { method: 'GET',  path: '/lists/edit/{key}', config: lists.edit },
    { method: 'POST', path: '/lists/update/{key}', config: lists.update },
    { method: 'GET',  path: '/lists/delete/{key}', config: lists.delete },
    { method: 'GET',  path: '/lists/star/{key}', config: lists.star },
    // { method: 'POST', path: '/lists/addplace/{key}', config: lists.addplace },
    // { method: 'POST', path: '/lists/addgroup/{key}', config: lists.addgroup },
    // { method: 'GET',  path: '/lists/mute/{key}', config: lists.mute },

    ////////////////////////////////// PENDING

    { method: 'GET',  path: '/pending', config: pending.list },

    ////////////////////////////////// AUTH

    { method: ['GET', 'POST'], path: '/auth/twitter', config: auth.login },
    { method: 'GET', path: '/session', config: auth.session },
    { method: 'GET', path: '/logout', config: auth.logout }

  ];

  return routes;

};

