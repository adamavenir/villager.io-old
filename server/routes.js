var auth = require('./handlers').auth;
var categories = require('./handlers').categories;
var groups = require('./handlers').groups;
var lists = require('./handlers').lists;
var pages = require('./handlers').pages;
var admin = require('./handlers').admin;
var people = require('./handlers').people;
var places = require('./handlers').places;
var activities = require('./handlers').activities;
var events = require('./handlers').events;

module.exports = function _routes() {

  var routes = [

    ////////////////////////////////// STATIC

    { method: 'GET', path: '/{path*}',
      handler: { directory: { path: './public', listing: false, index: true } } 
    },

    ////////////////////////////////// PAGES

    { method: 'GET',  path: '/', config: pages.index, },

    ////////////////////////////////// AUTH

    { method: ['GET', 'POST'], path: '/auth/twitter', config: auth.login },
    { method: 'GET', path: '/session', config: auth.session },
    { method: 'GET', path: '/logout', config: auth.logout },

    ////////////////////////////////// ADMIN

    { method: 'GET',  path: '/pending', config: admin.pendingList },
    { method: 'GET',  path: '/admin', config: admin.settings },
    { method: 'GET',  path: '/admin/{categoryType}/delete/{key}', config: categories.delete },
    { method: 'GET',  path: '/admin/{categoryType}/edit/{key}', config: categories.edit },
    { method: 'POST', path: '/admin/{categoryType}/update/{key}', config: categories.update },

    // move these  
    { method: 'POST', path: '/settings/add-group-category', config: categories.addGroupCategory },
    { method: 'POST', path: '/settings/add-place-category', config: categories.addPlaceCategory },

    ////////////////////////////////// PEOPLE

    { method: 'GET',  path: '/people', config: people.list },
    { method: 'GET',  path: '/people/{person}', config: people.get },
    { method: 'GET',  path: '/people/add', config: people.add },
    { method: 'POST', path: '/people/add', config: people.create },
    { method: 'GET',  path: '/profile/edit/{key}', config: people.edit },
    { method: 'POST', path: '/people/update/{key}', config: people.update },
    { method: 'GET',  path: '/people/delete/{key}', config: people.delete },
    { method: 'GET',  path: '/people/approve/{key}', config: people.approve },
    { method: 'GET',  path: '/people/moderator/{key}', config: people.moderator },
    { method: 'GET',  path: '/people/admin/{key}', config: people.admin },

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
    { method: 'GET',  path: '/groups/delete/{key}', config: groups.delete },

    ////////////////////////////////// ACTIVITIES

    { method: 'GET',  path: '/activities', config: activities.list },
    { method: 'GET',  path: '/activities/{slug}', config: activities.get },
    { method: 'GET',  path: '/activities/add', config: activities.add },
    { method: 'POST', path: '/activities/add', config: activities.create },
    { method: 'GET',  path: '/activities/edit/{key}', config: activities.edit },
    { method: 'POST', path: '/activities/update/{key}', config: activities.update },
    { method: 'GET',  path: '/activities/star/{key}', config: activities.star },
    { method: 'GET',  path: '/activities/approve/{key}', config: activities.approve },
    { method: 'GET',  path: '/activities/delete/{key}', config: activities.delete },

    ////////////////////////////////// EVENTS

    { method: 'GET',  path: '/events', config: events.list },
    { method: 'GET',  path: '/events/{slug}', config: events.get },
    { method: 'GET',  path: '/events/add', config: events.add },
    { method: 'POST', path: '/events/add', config: events.create },
    { method: 'GET',  path: '/events/edit/{key}', config: events.edit },
    { method: 'POST', path: '/events/update/{key}', config: events.update },
    { method: 'GET',  path: '/events/star/{key}', config: events.star },
    { method: 'GET',  path: '/events/approve/{key}', config: events.approve },
    { method: 'GET',  path: '/events/delete/{key}', config: events.delete },
    { method: 'GET',  path: '/events/at/{slug}', config: events.at },
    { method: 'GET',  path: '/events/by/{slug}', config: events.by },
    { method: 'GET',  path: '/events/at', config: events.atList },
    { method: 'GET',  path: '/events/by', config: events.byList },

    ////////////////////////////////// LISTS

    { method: 'GET',  path: '/lists', config: lists.list },
    { method: 'GET',  path: '/lists/{userSlug}/{slug}', config: lists.get },
    { method: 'GET',  path: '/lists/add', config: lists.add },
    { method: 'POST', path: '/lists/add', config: lists.create },
    { method: 'GET',  path: '/lists/edit/{key}', config: lists.edit },
    { method: 'POST', path: '/lists/update/{key}', config: lists.update },
    { method: 'GET',  path: '/lists/delete/{key}', config: lists.delete },
    { method: 'GET',  path: '/lists/star/{key}', config: lists.star },
    { method: 'GET',  path: '/lists/{user}/{listType}/add/{itemKey}', config: lists.select },
    { method: 'POST', path: '/lists/{user}/{listType}/add/{listKey}/{itemKey}', config: lists.addToList },
    { method: 'POST', path: '/lists/{user}/{listType}/remove/{listKey}/{itemKey}', config: lists.removeFromList }

  ];

  return routes;

};

