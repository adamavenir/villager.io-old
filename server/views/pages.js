var models = require('../models').models;
// var Log = require('../models/Log');

module.exports = {

    index: function (request, reply) {
        var session = request.auth.credentials;
        //console.log('\n====in pages.js request.auth%j', request.auth);
        if (session.userid) {
            models.Log.all(function(err, log) {
                if (err) { console.log(err); }
                models.User.get(session.userid, function (err, user) {
                    reply.view('index', {
                        log       : log,
                        user      : user,
                        userid    : session.userid,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                });
            });
        }
        else { reply.view('index'); }
    },

    notFound: function (request, reply) {
        reply('404');
    },

};