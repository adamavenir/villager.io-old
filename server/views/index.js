module.exports = function views(server) {
  auth = require('./auth')(server);
  moderation = require('./moderation')(server);
  pages = require('./pages')(server);
  people = require('./people')(server);
  places = require('./places')(server);
  groups = require('./groups')(server);
}