var sugar = require('sugar');
var slugger = require('slugger');
var gravatar = require('gravatar');
var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');

var type = verymodel.VeryType;

var Group = new VeryLevelModel(
  {
    name: {
      type: new type().isAlphanumeric().len(1,80),
      required: true
    },
    slug: { 
      derive: function () {
        return slugger(this.name);
      }, 
      private: false 
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
    description: {
      type: new type().isAlphanumeric().len(0,160),
    },
    moderators: {
      
    }
  }, 
  { 
    prefix: 'groups!'
  }
);

module.exports = Group;