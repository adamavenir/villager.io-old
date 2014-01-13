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
  { method: 'GET',  path: '/people/{person}', handler: views.showPerson },
  { method: 'GET',  path: '/add/person', handler: views.addPersonForm },

  // POST ROUTES
  { method: 'POST', path: '/new/person', handler: views.newPerson }

];