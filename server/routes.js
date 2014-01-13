var views     = require('./views');
var Types     = require('hapi').types;

module.exports = [

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

  // GET ROUTES

  { method: 'GET',  path: '/', handler: views.index },
  { method: 'GET',  path: '/people', handler: views.listPeople },
  { method: 'GET',  path: '/people/{person}', handler: views.getPerson },
  { method: 'GET',  path: '/add/person', handler: views.addPerson },
  { method: 'GET',  path: '/delete/person/{person}', handler: views.deletePerson },

  // POST ROUTES
  { method: 'POST', path: '/add/person', handler: views.savePerson }

];