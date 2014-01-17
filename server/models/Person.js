var VeryModel = require('verymodel');
var slugger = require('slugger');
var gravatar = require('gravatar');
var level = require('level');

var Person = new VeryModel ({
  first_name: {
    required: true,
    type: VeryType().isAlphanumeric()
  },
  last_name: {
    required: true,
    type: VeryType().isAlphanumeric()
  },
  full_name: {
    type: VeryType().isAlphanumeric(),
    derive: function() { 
      return this.first_name + ' ' + this.last_name;
    }
  },
  email: {
    required: true,
    type: VeryType().isEmail()
  },
  slug: {
    derive: function() {
      return slugger(form.name);
    }
  },
  gravatar: {
    derive: function() {
      return gravatar.url(email, 100);
    }
  },
  twitter: {
    type: VeryType().isAlphanumeric().len(1,16)
    derive: function() {
      // TODO: normalize the twitter handle
      var handle = twitter;
      return handle;
    },
  },
  bio: {
    required: false,
    type: VeryType().isAlphanumeric().len(0,160)
  },
  key: { 
    private: true,
    derive: function () {
      return 'people!' + slug;
    }
  },
});


Person.load = function(db, key, cb) {
  db.get(key, function (value) {
    var inst = exports.Person.create(value)
    inst.key = key;
  });
}

Person.list = function () {
  
}

Person.extend({`
  save: function (cb) {
    db.put(this.key, this.toJSON(), cb);
  },
  del: function () {
  },
  getPlaces: function() {}
})


exports.Person = Person;
