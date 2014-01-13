var levelup     = require('levelup');
var mappedIndex = require('level-mapped-index');
var sublevel    = require('level-sublevel');
var range       = require('level-range');
var concat      = require('concat-stream');
var routes      = require('./routes');
var slugger     = require('slugger');
var gravatar    = require('gravatar');

db = levelup('./level.db', { valueEncoding: 'json' });

exports.addPersonForm = function (request, reply) {
  reply.view('add', { foo: 'bar' });
};

exports.index = function (request, reply) {

  var read  = range(db, '%s', 'people!');

  var write = concat( function (data) { 
    // if (data == undefined) {
      // reply.view('empty');
      // console.log('yep, undefined');
    // }
    // else {
      console.log('data', data[0].value.name);
      reply.view('index', data[0]);
    // }
  });

  read.pipe(write);

};

exports.showPerson = function (request, reply) {

  var thisPerson = request.params.person;

  console.log('looking for', thisPerson);

  db.get('people!' + thisPerson, function(err, value) {
    if (err) {
      reply.view('404');
      return console.log('people!' + thisPerson, 'does not exist')
    }
    else {
      reply.view('person', value);  
    }
  });
  
};

exports.notFound = function (request, reply) {
  reply('404');
};

exports.newPerson = function (request, reply) {

    var form      = request.payload;
    var slug      = slugger(form.name);
    var gravatar  = gravatar(form.email, 100);
    var personKey = 'people!' + slug;

    var personValue = {
        'name'    : form.name,
        'email'   : form.email,
        'slug'    : slug,
        'gravatar': gravatar,
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