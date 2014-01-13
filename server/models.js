var verymodel = require('verymodel');

exports.Person = new verymodel.VeryModel({
  //definition
  key: {private: true},
  first_name: {},
  last_name: {},
  full_name: {derive: function() { return this.first_name + ' ' + this.last_name;}},
  email: {},
  slug: {},
  gravatar: {},
  twitter: {},
  bio: {}
});

exports.Person.load = function(db, key, cb) {
  db.get(key, function (value) {
    var inst = exports.Person.create(value)
    inst.key = key;
  });
}

exports.Person.list = function () {
  
}

Person.extend({
  save: function (cb) {
    db.put(this.key, this.toJSON(), cb);
  },
  del: function () {
  },
  getPlaces: function() {}
})
