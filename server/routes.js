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

  { method: 'GET',  path: '/', handler: views.index },

  // PEOPLE
  { method: 'GET',  path: '/people', handler: views.listPeople },
  { method: 'GET',  path: '/people/{person}', handler: views.getPerson },
  { method: 'GET',  path: '/people/add', handler: views.formPerson },
  { method: 'POST', path: '/people/add', handler: views.createPerson },

  // PLACES
  // { method: 'GET',  path: '/places', handler: views.listPlaces },
  // { method: 'GET',  path: '/places/{place}', handler: views.getPlace },
  // { method: 'GET',  path: '/places/add', handler: views.formPlace },
  // { method: 'POST', path: '/places/add', handler: views.createPlace },
  // { method: 'POST',  path: '/places/delete/{place}', handler: views.deletePlace },  

  // DELETE
  { method: 'GET', path: '/{prefix}/delete/{person}', handler: views.delete },

];