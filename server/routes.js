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
  { method: 'GET',  path: '/add/person', handler: views.addPerson },
  { method: 'POST', path: '/add/person', handler: views.savePerson },
  { method: 'POST',  path: '/delete/person/{person}', handler: views.deletePerson },


  // PLACES
  { method: 'GET',  path: '/places', handler: views.listPlaces },
  { method: 'GET',  path: '/places/{place}', handler: views.getPlace },
  { method: 'GET',  path: '/add/place', handler: views.addPlace },
  { method: 'POST', path: '/add/place', handler: views.savePlace },
  { method: 'POST',  path: '/delete/place/{place}', handler: views.deletePlace },  

];