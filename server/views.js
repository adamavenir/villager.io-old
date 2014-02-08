var Place = require('./models/Place');
var User = require('./models/User');
var _ = require('underscore');

module.exports = function views(server) {

  var Passport = server.plugins.travelogue.passport;

  ///////////////// INDEX

  index = function (request, reply) {
    reply.view('index', { user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });
  };

  ///////////////// AUTH

  login = function (request, reply) {
    Passport.authenticate('twitter')(request, reply);
    var html = '<a href="/auth/twitter">Login with Twitter</a>';
    if (request.session) {
      html += "<br/><br/><pre><span style='background-color: #eee'>session: " + JSON.stringify(request.session, null, 2) + "</span></pre>";
    }
    reply(html);
  };

  authenticated = function (request, reply) {
    User.getByIndex('twitterId', request.session.user.id, function (err, user) {
      // if this user exists, log in
      if (Array.isArray(user) && user.length === 1) {
        user = user[0];
        request.session.userid = user.__verymeta.data.key;
        request.session.admin = user.__verymeta.data.admin;
        request.session.moderator = user.__verymeta.data.moderator;
        reply().code(201).redirect('/people');
      }
      // otherwise, create a new user
      else {
        if (request.session.user.id === '1568') {
          console.log('Hi, Adam');
          var access = true;
        }
        else {
          var access = false;
        }
        var u = User.create({
          fullName : request.session.user.displayName,
          twitterId : request.session.user.id,
          twitter : request.session.user.username,
          avatar: request.session.user._json.profile_image_url,
          approved : access,
          admin : access,
          moderator : access,
        });
        u.save(function (err) {
          reply().code(201).redirect('/people');
          request.session.userid = u.__verymeta.data.key;
          request.session.admin = request.session.moderator = access;
        });
      }
    })
  };

  logout = function (request, reply) {
    request.session._logOut();
    request.session.admin = request.session.moderator = "";
    reply().redirect('/');
  };

  twitterAuth = function (request, reply) {
    Passport.authenticate('twitter')(request, reply);
  };

  twitterCallback = function (request, reply) {
    Passport.authenticate('twitter', {
      failureRedirect: '/login',
      successRedirect: '/authenticated',
      failureFlash: true
    })(request, reply, function () {
      reply().redirect('/authenticated');
    });
  };

  session = function (request, reply) {
    Passport.authenticate('twitter')(request, reply);
    var html = '<a href="/auth/twitter">Login with Twitter</a>';
    if (request.session) {
      html += "<br/><br/><pre><span style='background-color: #eee'>session: " + JSON.stringify(request.session, null, 2) + "</span></pre>";
    }
    reply(html);
  };  

  ///////////////// PEOPLE

  formPerson = function (request, reply) {
    reply.view('formPerson', { user : request.session.user, moderator : request.session.moderator, admin : request.session.admin});
  };

  createPerson = function (request, reply) {
    var form = request.payload;
    var p = User.create({
      fullName  : form.fullName,
      email     : form.email,
      twitter   : form.twitter,
      site      : form.site,
      company   : form.company,
      bio       : form.bio
    });
    p.save(function (err) {
      User.load(p.key, function (err, person) {
        reply().code(201).redirect('/people/' + p.slug);
      })
    });
  };

  getPerson = function (request, reply) {
    User.getByIndex('slug', request.params.person, function(err, value) {
      if (err) {
        reply.view('404');
      }
      else {
        if (Array.isArray(value) && value.length === 1) { value = value[0] };
        reply.view('person', { person : value, user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });
      }
    });
  };

  listPeople = function (request, reply) {
    User.all(function(err, data) {
      var approved = _.where(data, { approved: true });
      if(approved.length === 0) {
        reply.view('noPeople');
      }
      else {
        reply.view('listPeople', { people : approved, user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });  
      }
    });
  };

  deletePerson = function (request, reply) {
    if (request.session.moderator) {
      User.delete(request.params.person, callback);
      var callback = reply.view('deleted').redirect('/people');
    }
    else { reply().code(401).redirect('/'); }
  };

  approvePerson = function (request, reply) {
    if (request.session.moderator) {
      User.update(request.params.person, { approved: true }, function (person) {
        console.log('approved:', request.params.person);
        reply().code(200).redirect('/people');
      })
    }
    else { reply().code(401).redirect('/'); }
  };

  approvePlace = function (request, reply) {
    if (request.session.moderator) {
      Place.update(request.params.place, { approved: true }, function (place) {
        console.log('approved:', request.params.place);
        reply().code(200).redirect('/places');
      })
    }
    else { reply().code(401).redirect('/'); }
  };

  adminPerson = function (request, reply) {
    if (request.session.admin) {
      User.update(request.params.person, { admin: true, moderator: true, approved: true }, function (person) {
        console.log('made admin:', request.params.person);
        reply().code(200).redirect('/people');
      })
    }
    else { reply().code(401).redirect('/'); }
  };

  moderatorPerson = function (request, reply) {
    if (request.session.admin) {
      User.update(request.params.person, { moderator: true, approved: true }, function (person) {
        console.log('made moderator:', request.params.person);
        reply().code(200).redirect('/people');
      })
    }
    else { reply().code(401).redirect('/'); }
  };

  ///////////////// PLACES

  formPlace = function (request, reply) {
    reply.view('formPlace');
  };

  createPlace = function (request, reply) {
    var form = request.payload;
    var p = Place.create({
      type    : form.type,
      name    : form.name,
      address : form.address,
      city    : form.city,
      image   : form.image,
      twitter : form.twitter,
      website : form.website,
      about   : form.about
    });
    p.save(function (err) {
      Place.load(p.key, function (err, place) {
        reply().code(201).redirect('/places/' + p.slug);
      })
    });
  };

  getPlace = function (request, reply) {
    Place.getByIndex('slug', request.params.place, function(err, value) {
      if (err) {
        reply.view('404');
      }
      else {
        if (Array.isArray(value) && value.length === 1) { value = value[0] };
        reply.view('place', { place : value, user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });
      }
    });
  };

  listPlaces = function (request, reply) {
    Place.all(function(err, data) {
      var approved = _.where(data, { approved: true });
      if(approved.length === 0) {
        reply.view('noPlaces', { user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });
      }
      else {
        reply.view('listPlaces', { places : approved });
      }
    });
  };

  listPending = function (request, reply) {

    User.all(function(err, people) {
      var pendingPeople = _.where(people, { approved: false });
      
      Place.all(function(err, places) {
        var pendingPlaces = _.where(places, { approved: false });

        if(pendingPeople.length + pendingPlaces.length === 0) {
          reply.view('noPending', { user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });
        }
        else {
          reply.view('listPending', { people : pendingPeople, places : pendingPlaces, user : request.session.user, moderator : request.session.moderator, admin : request.session.admin });
        }
      });
    });
  };    

  deletePlace = function (request, reply) {
    Place.delete(request.params.place, callback);
    var callback = reply.view('deleted').redirect('/places');
  };


  ///////////////// 404

  notFound = function (request, reply) {
    reply('404');
  };  

}