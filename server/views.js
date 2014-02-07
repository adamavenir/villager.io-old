var Place = require('./models/Place');
var User = require('./models/User');

module.exports = function views(server) {

  var Passport = server.plugins.travelogue.passport;

  ///////////////// INDEX

  index = function (request, reply) {
    reply.view('index');
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
      if (err) {
        console.log('err', err)
      }
      if (user) {
        session.admin
        console.log(user.__verymeta.data.key, 'user exists, logging in...');
        request.session.userid = user.__verymeta.data.key;
        request.session.user.admin = user.__verymeta.data.admin;
        request.session.user.moderator = user.__verymeta.data.moderator;
        reply().code(201).redirect('/people');
      }
      else {
        var u = User.create({
          fullName : request.session.user.displayName,
          twitterId : request.session.user.id,
          twitter : request.session.user.username,
          avatar: request.session.user._json.profile_image_url
        });
        u.save(function (err) {
          console.log('saved', u.__verymeta.data.fullName);
          reply().code(201).redirect('/people');
          request.session.userid = u.__verymeta.data.key;
        });
      }
    })
  };

  logout = function (request, reply) {
    request.session._logOut();
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
    reply.view('formPerson', { user : request.session.user });
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
      console.log(request.params.person);
      if (err) {
        console.log('err', err);
        reply.view('404');
      }
      else {
        reply.view('person', { person : value, user : request.session.user });
      }
    });
  };

  listPeople = function (request, reply) {
    User.all(function(err, data) {
      if(data.length === 0) {
        reply.view('noPeople');
      }
      else {
        reply.view('listPeople', { people : data, user : request.session.user });  
      }
    });
  };

  deletePerson = function (request, reply) {
    var key = request.params.person;
    User.delete(key, callback);
    var callback = reply.view('deleted').redirect('/people');
  };

adminifyPerson = function (request, reply) {
    User.load(request.session.userid, function (err, user) {
      if (err) { console.log('err', err)}
      if (user.admin) {
        User.load(request.params.person, function (err, person) {
          if (err) { console.log('err', err) }
          else {
            var p = user.createChild(Person, {
              firstName : person.firstName,
              lastName  : person.lastName,
              email     : person.email,
              when      : "now"
            });

            p.save(function (err) {
              console.log('adminify', p.__verymeta.data.fullName)
              reply().code(201).redirect('/people');
              User.delete(request.params.person, callback);
              var callback = console.log('deleted', request.params.person)
            });
          }
        })
      }
      else { reply().code(401).redirect('/'); }
    })
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
    var thisPlace = request.params.place;
    Place.load(Place.options.prefix + thisPlace, function(err, value) {
      if (err) {
        reply.view('404');
      }
      else {
        reply.view('place', value);
      }
    });
  };

  listPlaces = function (request, reply) {
    Place.all(function(err, data) {
      if(data.length === 0) {
        reply.view('noPlaces');
      }
      else {
        reply.view('listPlaces', { places : data});  
      }
    });
  };

  deletePlace = function (request, reply) {
    var key = 'places!' + request.params.place;
    Place.de8lete(key, callback);
    var callback = reply.view('deleted').redirect('/places');
  };


  ///////////////// 404

  notFound = function (request, reply) {
    reply('404');
  };  

}