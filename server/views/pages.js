module.exports = function views(server) {

  index = function (request, reply) {
    reply.view('index', { user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });
  };

  notFound = function (request, reply) {
    reply('404');
  };

};