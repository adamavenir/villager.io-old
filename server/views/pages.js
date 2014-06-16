var Log = require('../models/Log');

module.exports = {

    index: function (request, reply) {
        if (request.session.user) {
            Log.all(function(err, log) {
                if (err) { console.log(err); }
                reply.view('index', { 
                    log       : log,
                    user      : request.session.user, 
                    moderator : request.session.moderator, 
                    admin     : request.session.admin 
                });
            }) 
        }
        else { reply.view('index') }
    },

    notFound: function (request, reply) {
        reply('404');
    },

};