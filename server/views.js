var Person      = require('./models/Person');
var slugger     = require('slugger');

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
      // console.log('person value:', person.toJSON());
      // console.log('person key', person.key);
      reply(p.key + JSON.stringify(person)).code(201).redirect('/people/' + p.slug);
    })
  });
};

exports.getPerson = function (request, reply) {
  var thisPerson = request.params.person;
  console.log('Looking up key: "people!' + thisPerson + '"');
  Person.load('people!' + thisPerson, function(err, value) {
    reply.view('person', value);
    if (err) {
      console.log('get err:', err);
      console.log('get val:', value);
      reply.view('404');
      console.log('The key "people!' + thisPerson + '" does not exist.')
    }
    else {
      reply.view('person', value);
    }
  });
};

exports.listPeople = function (request, reply) {
  Person.all(function(err, data) {
    if(err) {
      console.log('listPeople err:', err);
      reply.view('noPeople');
    }
    else {
      console.log('listPeople data', JSON.stringify(data));
      reply.view('listPeople', { people : data});  
    }
  });
};

exports.deletePerson = function (request, reply) {
  var p = request.params.person;
  console.log('deleting', key);
  Person.delete(p, callback);
  var callback = reply.view('deleted').redirect('/people/');
};


///////////////// 404

exports.notFound = function (request, reply) {
  reply('404');
};