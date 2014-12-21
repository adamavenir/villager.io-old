var Log = require('../models/Log');

module.exports = {

    index: function (request, reply) {
        if (request.auth.session) {
            Log.all(function(err, log) {
                if (err) { console.log(err); }
                reply.view('index', { 
                    log       : log,
                    user      : request.auth.session.user, 
                    moderator : request.auth.session.moderator, 
                    admin     : request.auth.session.admin 
                });
            });
        }
        else { reply.view('index'); }
    },

    notFound: function (request, reply) {
        reply('404');
    },

};