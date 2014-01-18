var Person      = require('./models/Person');
var slugger     = require('slugger');

///////////////// INDEX

exports.index = function (request, reply) {
  reply.view('index');
};


// ///////////////// PEOPLE

exports.formPerson = function (request, reply) {
  reply.view('formPerson');
};

exports.createPerson = function (request, reply) {

  var form = request.payload;

  var p = Person.create({
    first_name  : form.first_name,
    last_name   : form.last_name
  });

  console.log('p to JSON', p.first_name);

  p.save(function (err) {
    Person.load(p.key, function (err, person) {
      console.log(person.toJSON());
      console.log(person.key);
      reply(person.key + person.toJSON()).code(201).redirect('/people/' + p.key);
    })
  });

};

///////////////// 404

exports.notFound = function (request, reply) {
  reply('404');
};