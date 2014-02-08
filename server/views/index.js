function views(server) {
  
  index = function (request, reply) {
    reply.view('index', { user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });
  };

  notFound = function (request, reply) {
    reply('404');
  };

};

views.prototype.auth = require('./auth');
views.prototype.moderation = require('./moderation');
views.prototype.pages = require('./pages');
views.prototype.people = require('./people');
views.prototype.places = require('./places');

module.exports = views;

// module.exports = function _views(server) {

//   var Passport = server.plugins.travelogue.passport;

//   return views;

// }

// var views = {
//   auth: require('./auth'),
//   moderation: require('./moderation'),
//   pages: require('./pages'),
//   people: require('./people'),
//   places: require('./places')
// };

// module.exports = views;