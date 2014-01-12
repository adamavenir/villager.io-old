var levelup = require('levelup');

var db = levelup('./level.db', { valueEncoding: 'json' });

console.log('hi from views');

var people = [{
        id: 1,
        name: 'Pete Example',
        email:    'pete@example.com',
        twitter:  'pete_example,',
        intro:    "Hey, I'm Pete."
    },
    {
        id: 2,
        name: 'Joe',
        email:    'joe@example.com',
        twitter:  'joe_example',
        intro:    "Hey, I'm Joe."
    }
];

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

    var person = {
        id: people[people.length - 1].id + 1,
        name:     form.name,
        email:    form.email,
        twitter:  form.twitter,
        intro:    form.intro          
    };

    var personKey = people[people.length - 1].id + 1

    db.put(
      personKey, 
      {
        name:     form.name,
        email:    form.email,
        twitter:  form.twitter,
        intro:    form.intro          
      }
      , function (err) {
          db.get(personKey, function (err, value) {
            console.log(personKey, value)
            db.close()
          })
        }
    );

    reply(person).code(201).header('Location', '/people/' + person.id);
};