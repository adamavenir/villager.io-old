var sugar = require('sugar');
var slugger = require('slugger');
var gravatar = require('gravatar');
var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');
var User = require('../models/User');

var type = verymodel.VeryType;

var Group = new VeryLevelModel({
  type: {
    type: type().isIn('Music', 'Theatre', 'Art', 'Coworking', 'Educational', 'Social', 'Nonprofit', 'Support')
  },
  name: {
    type: new type().isAlphanumeric().len(1,80),
    required: true
  },
  slug: { 
    derive: function () {
      return slugger(this.name);
    }, 
    index: true,
    private: false 
  },
  image: {
    required: true,
    type: type().isUrl()
  },
  twitter: {
    processIn: function(twitter) {
      return twitter.remove('@').remove('http://twitter.com/').remove('https://twitter.com/').remove('twitter.com/');
      console.log(twitter);
    },
    type: new type().isAlphanumeric().len(1,16)
  },
  site: {
    type: new type().isUrl(),
    required: true
  },
  about: {
    type: new type().isAlphanumeric().len(0,160),
  },
  approved: {
    default: false,
    type: 'boolean',
    required: true,
    index: true
  },
  creatorKey: {
    index: true
  },
  creatorName: {
    derive: function() {
      User.load(this.creatorKey, function(err, user) {
        return user.fullName;
        console.log('fullName', user.fullName);
      })
    }
  },
  creatorSlug: {
    derive: function() {
      return slugger(this.creatorName);
    }
  },
  moderator: {
    index: true
  }
}, { prefix: 'groups!' });

module.exports = Group;