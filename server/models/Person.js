var sugar = require('sugar');
var slugger = require('slugger');
var gravatar = require('gravatar');
var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');
var level = require('level');
var db = level('./db', { valueEncoding: 'json' });

var type = verymodel.VeryType;

var Person = new VeryLevelModel(
  {
    firstName: {},
    lastName: {},
    fullName: {derive: function () {
      return this.firstName + ' ' + this.lastName;
      }, private: false
    },
    experience: {},
    title: {},
    slug: { derive: function () {
      return slugger(this.fullName);
      }, private: false 
    },
    key: { derive: function() {
      return Person.options.prefix + this.slug 
      }, private: false 
    },
    email: {
      required: true,
      type: new type().isEmail()
    },
    gravatar: {
      derive: function() {
        return gravatar.url(this.email, 100);
      }
    },
    twitter: {
      required: true,
      type: new type().is
    },
    // twitter: {
    //   derive: function() {
    //     if (this.twitter.startsWith('@')) {
    //       var handle = this.twitter.remove('@');
    //     }
    //     else {
    //       var handle = this.twitter;
    //     }
    //     return handle;
    //   },
    //   type: new type().isAlphanumeric().len(1,16)
    // },
    site: {
      required: true,
      type: new type().isUrl()
    },
    company: {
      required: false,
      type: new type().isAlphanumeric()
    },
    bio: {
      required: false,
      type: new type().isAlphanumeric().len(0,160)
    },
    interests: {
      required: false,
      type: new type().isIn('fishing', 'pizza', 'hopscotch', 'dancing', 'prancing')
    }
  }, 
  { 
    db: db, prefix: 'people!'
  }
);

module.exports = Person;