var sugar = require('sugar');
var slugger = require('slugger');
var gravatar = require('gravatar');
var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');
var level = require('level');
var db = level('./level.db', { valueEncoding: 'json' });

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
      return 'person!' + this.slug 
      }, private: false 
    },
    email: {
      required: true,
      type: new verymodel.VeryType().isEmail()
    },
    gravatar: {
      derive: function() {
        return gravatar.url(this.email, 100);
      }
    },
    twitter: {
      type: new verymodel.VeryType().isAlphanumeric().len(1,16)
    },
    site: {
      required: true,
      type: new verymodel.VeryType().isUrl()
    },
    company: {
      required: false,
      type: new verymodel.VeryType().isAlphanumeric()
    },
    bio: {
      required: false,
      type: new verymodel.VeryType().isAlphanumeric().len(0,160)
    },
    interests: {
      required: false,
      type: new verymodel.VeryType().isIn('fishing', 'pizza', 'hopscotch', 'dancing', 'prancing')
    }
  }, 
  { 
    db: db, prefix: ''
  }
);

module.exports = Person;