var sugar = require('sugar');
var slugger = require('slugger');
var gravatar = require('gravatar');
var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');
var level = require('level');

var db = level('./db', { valueEncoding: 'json' });

var type = verymodel.VeryType;

////// PERSON

var Person = new VeryLevelModel(
  {
    firstName: {
      type: new type().isAlphanumeric().len(1,80),
      required: true
    },
    lastName: {
      type: new type().isAlphanumeric().len(1,80),
      required: true
    },
    fullName: {
      derive: function () {
        return this.firstName + ' ' + this.lastName;
      }, 
      private: false
    },
    slug: { 
      derive: function () {
        return slugger(this.fullName);
      }, 
      private: false 
    },
    key: { 
      derive: function() {
        return Person.options.prefix + this.slug 
      }, 
      private: false 
    },
    email: {
      type: new type().isEmail(),
      required: true
    },
    gravatar: { 
      derive: function() {
        return gravatar.url(this.email, 100);
      }
    },
    twitter: {
      processIn: function(twitter) {
        return twitter
          .remove('@')
          .remove('http://twitter.com/')
          .remove('https://twitter.com/')
          .remove('twitter.com/');
        console.log(twitter);
      },
      type: new type().isAlphanumeric().len(1,16)
    },
    site: {
      type: new type().isUrl(),
      required: true
    },
    company: {
      type: new type().isAlphanumeric(),
    },
    bio: {
      type: new type().isAlphanumeric().len(0,160),
    },
    interests: {
      type: new type().isIn('fishing', 'pizza', 'hopscotch', 'dancing', 'prancing'),
    }
  }, 
  { 
    db: db, prefix: 'people!'
  }
);

////// PLACE

var Place = new VeryLevelModel ({
  type: {
    type: type().isIn('Restaurant', 'Coffee shop', 'Bar', 'Winery', 'Store', 'Company', 'Nonprofit', 'Venue', 'Public')
  },
  name: {
    required: true,
    type: type().isAlphanumeric()
  },
  address: {
    required: false,
    type: type().isAlphanumeric()
  },
  city: {
    required: false,
    type: type().isAlphanumeric()
  },
  map: {
    processIn: function(map) {
      if (map.length > 0) {
        return 'http://maps.google.com/?q=' + map;
        console.log('http://maps.google.com/?q=' + map);
      }
      else {
        return "";
        console.log('map blank');        
      }
    },
    type: type().isUrl(),
  },
  image: {
    required: true,
    type: type().isUrl()
  },
  website: {
    type: new type().isUrl(),
    required: true
  },
  twitter: {
    processIn: function(twitter) {
      return twitter
        .remove('@')
        .remove('http://twitter.com/')
        .remove('https://twitter.com/')
        .remove('twitter.com/');
      console.log(twitter);
    },
    type: new type().isAlphanumeric().len(1,16)
  },
  about: {
    required: false,
    type: type().isAlphanumeric().len(0,160)
  },
  key: { 
    private: true,
    derive: function () {
      return 'places!' + slug;
    }
  },
});


module.exports = {
  Person: Person,
  Place: Place
};