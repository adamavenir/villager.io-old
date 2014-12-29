exports.logout = {
    handler: function (request, reply) {
        request.auth.session.clear();
        reply().redirect('/');
    }
};