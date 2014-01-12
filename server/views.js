var levelgraph = require('levelgraph');

var db = levelgraph('./levelgraph.db');

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

    var emailTriple = { 
      subject   : form.name, 
      predicate : 'hasEmail',
      object    : form.email
    };

    var twitterTriple = {
      subject   : form.name,
      predicate : 'hasTwitter',
      object    : form.twitter
    };

    var bioTriple = {
      subject   : form.name,
      predicate : 'hasBio',
      object    : form.hasBio
    };

    var tripleSet = [ emailTriple, twitterTriple, bioTriple ];

    db.put(tripleSet, function (err) {
      if (err) return console.log('db error:', err);
      console.log('triples:', emailTriple, twitterTriple, bioTriple);
    });

    reply(tripleSet).code(201).header('Location', '/people/' + form.name);
};