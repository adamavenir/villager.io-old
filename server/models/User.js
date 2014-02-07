var S = require('string');
var slugger = require('slugger');
var gravatar = require('gravatar');
var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');

var type = verymodel.VeryType;

var User = new VeryLevelModel(
  {
    fullName: {
      type: new type().isAlphanumeric().len(1,80),
      required: true
    },
    avatar: {
      processIn: function (avatar) {
        if (avatar) {
          return S(avatar).replaceAll('_normal', '_bigger').s;
        }
      },
      required: false
    },
    slug: { 
      derive: function () {
        return slugger(this.fullName, {alsoAllow: "&"});
      }, 
      index: true,
      private: false 
    },
    twitterId: {
      index: true
    },
    email: {
      type: new type().isEmail(),
      required: false
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
      type: new type().isAlphanumeric().len(1,16),
      required: false
    },
    site: {
      type: new type().isUrl(),
      required: false
    },
    company: {
      type: new type().isAlphanumeric()
    },
    bio: {
      type: new type().isAlphanumeric().len(0,160),
    },
    approved: {
      default: false,
      type: 'boolean',
      required: true,
      index: true
    },
    moderator: {
      default: false,
      type: 'boolean',
      required: true,
      index: true
    },
    admin: {
      default: false,
      type: 'boolean',
      required: true,
      index: true
    }
  },
  { 
    prefix: 'users!'
  }
);

module.exports = User;