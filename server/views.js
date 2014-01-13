var levelup     = require('levelup');
var mappedIndex = require('level-mapped-index');
var sublevel    = require('level-sublevel');
var range       = require('level-range');
var concat      = require('concat-stream');
var routes      = require('./routes');
var slugger     = require('slugger');

db = levelup('./level.db', { valueEncoding: 'json' });

exports.addPersonForm = function (request, reply) {
  reply.view('add', { foo: 'bar' });
};

exports.index = function (request, reply) {

  var read  = range(db, '%s', 'people!')

  var write = concat( function (err, data) { 
    console.log('data', data);
    if (typeof data != 'undefined') {
      console.log('data', data[0].value.name);
      reply.view('index', data[0]);
    }
    else {
      reply.view('empty');
    }
  })

  read.pipe(write);

};

exports.showPerson = function (request, reply) {

  var thisPerson = request.params.person;

  console.log('thisPerson:', thisPerson);

  db.get('people!' + thisPerson, function(err, value) {
    if (err) {
      return console.log('people!' + thisPerson, 'does not exist');
      reply.view('empty');
    }
    reply.view('person', value);
  });
  
};

exports.notFound = function (request, reply) {
  reply('404');
};

exports.newPerson = function (request, reply) {

    var form = request.payload;

    var slug = slugger(form.name);

    var personKey = 'people!' + slug;

    var personValue = {
        'name'    : form.name,
        'email'   : form.email,
        'slug'    : slug,
        'twitter' : form.twitter,
        'bio'     : form.bio
    };

    console.log('personValue', personValue);

    db.put(
      personKey, 
      personValue,
      function (err) {
          db.get(personKey, function (err, value) {
            console.log(personKey, value)
          })
        }
    );

    reply(personKey + JSON.stringify(personValue)).code(201).redirect('/' + slug);
};