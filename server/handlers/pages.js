exports.index = {
    auth: { strategy: 'session', mode: 'try' },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated && request.auth.credentials.userid) {
            var session = request.auth.credentials;
            reply.view('index', {
                fullName  : session.fullName,
                avatar    : session.avatar,
                userid    : session.userid,
                moderator : session.moderator,
                admin     : session.admin
            });
        }
        else { reply.view('index'); }
    }
};

exports.notFound = {
    handler: function (request, reply) {
        reply('404');
    },
};