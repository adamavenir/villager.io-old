var levelgraph  = require('levelgraph');
var gravatar    = require('gravatar');

var graphdb     = levelgraph('./levelgraph.db');

var triple, list;

exports.addPersonForm = function (request, reply) {
  reply.view('add', { foo: 'bar' });
};

exports.index = function (request, reply) {
  reply.view('index', { foofoo: 'barbar' });
};

exports.notFound = function (request, reply) {
  reply.view('404');
};

exports.newPerson = function (request, reply) {

    //console.log('howdy from newPerson');

    //console.log(request.payload);

    var form = request.payload;

    var img = gravatar.url(form.email, 100);

    if (form.email) {
      var emailTriple = { 
        subject   : form.name, 
        predicate : 'hasEmail',
        object    : form.email
      };
      var gravatarTriple = {
        subject   : form.name,
        predicate : 'hasGravatar',
        object    : img
      }
    };

    if (form.twitter) {
      var twitterTriple = {
        subject   : form.name,
        predicate : 'hasTwitter',
        object    : form.twitter
      };
    };
    
    if (form.bio) {
      var bioTriple = {
        subject   : form.name,
        predicate : 'hasBio',
        object    : form.bio
      };
    }

    var tripleSet = [ emailTriple, twitterTriple, bioTriple, gravatarTriple ];

    graphdb.put(tripleSet, function (err) {
      if (err) return console.log('levelgraph error:', err);
      console.log('triples:', tripleSet);
    });

    reply(tripleSet).code(201).header('Location', '/people/' + form.name);
};