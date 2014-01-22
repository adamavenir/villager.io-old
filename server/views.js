var Person = require('./models/Person');
var Place = require('./models/Place');

///////////////// INDEX

exports.index = function (request, reply) {
  reply.view('index');
};


///////////////// PEOPLE

exports.formPerson = function (request, reply) {
  reply.view('formPerson');
};

exports.createPerson = function (request, reply) {
  var form = request.payload;
  var p = Person.create({
    firstName : form.firstName,
    lastName  : form.lastName,
    email     : form.email,
    twitter   : form.twitter,
    site      : form.site,
    company   : form.company,
    bio       : form.bio,
    interests : form.interests
  });
  p.save(function (err) {
    Person.load(p.key, function (err, person) {
      reply().code(201).redirect('/people/' + p.slug);
    })
  });
};

exports.getPerson = function (request, reply) {
  var thisPerson = request.params.person;
  Person.load(Person.options.prefix + thisPerson, function(err, value) {
    if (err) {
      reply.view('404');
    }
    else {
      reply.view('person', value);
    }
  });
};

exports.listPeople = function (request, reply) {
  Person.all(function(err, data) {
    if(data.length === 0) {
      reply.view('noPeople');
    }
    else {
      reply.view('listPeople', { people : data});  
    }
  });
};

exports.deletePerson = function (request, reply) {
  var key = 'people!' + request.params.person;
  Person.delete(key, callback);
  var callback = reply.view('deleted').redirect('/people');
};


///////////////// PLACES

exports.formPlace = function (request, reply) {
  reply.view('formPlace');
};

exports.createPlace = function (request, reply) {
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

exports.getPlace = function (request, reply) {
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

exports.listPlaces = function (request, reply) {
  Place.all(function(err, data) {
    if(data.length === 0) {
      reply.view('noPlaces');
    }
    else {
      reply.view('listPlaces', { places : data});  
    }
  });
};

exports.deletePlace = function (request, reply) {
  var key = 'places!' + request.params.place;
  Place.delete(key, callback);
  var callback = reply.view('deleted').redirect('/places');
};


///////////////// 404

exports.notFound = function (request, reply) {
  reply('404');
};