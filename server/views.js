var level       = require('level');
var range       = require('level-range');
var concat      = require('concat-stream');
var routes      = require('./routes');
var slugger     = require('slugger');
var gravatar    = require('gravatar');
var addKeyValue = require('./addkeyValue');

db = level('./level.db', { valueEncoding: 'json' });

exports.addPersonForm = function (request, reply) {
  reply.view('addPerson');
};

exports.newPerson = function (request, reply) {

    var form = request.payload;
    
    var pic = gravatar.url(form.email, 100);

    var buildData = function () {
      var slug  = slugger(form.name);
      var key   = 'people!' + slug;
      var uri   = '/people/' + slug;

      var value = {
          'name'    : form.name,
          'email'   : form.email,
          'slug'    : slug,
          'gravatar': pic,
          'twitter' : form.twitter,
          'bio'     : form.bio
      };

      addKeyValue(db, reply, key, value, uri);
    };

    buildData();

};

exports.index = function (request, reply) {

  var read  = range(db, '%s', 'people!');

  var write = concat( function (data) { 
    if (data.length === 0) {
      reply.view('empty');
    }
    else {
      console.log('data', data);
      var people = data;
      reply.view('index', people);
    }
  });

  read.pipe(write);

};

exports.showPerson = function (request, reply) {

  var thisPerson = request.params.person;

  console.log('looking up', thisPerson);

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