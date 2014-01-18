var VeryLevelModel = require('verymodel-level');
var slugger = require('slugger');
var gravatar = require('gravatar');
var level = require('level');
var db = level('./level.db', { valueEncoding: 'json' });

var Person = new VeryLevelModel(
  {
    first_name: {},
    last_name: {},
    full_name: {derive: function () {
      return this.first_name + ' ' + this.last_name;
      }, private: false
    },
    experience: {},
    title: {},
    key: { derive: function () {
      return slugger(this.full_name);
    }, private: false
  },
  }, 
  { 
    db: db,
    prefix: 'person!'
  }
);

// var Person = new VeryLevelModel ({
//   first_name: {
//     required: true,
//     // type: new VeryType().isAlphanumeric()
//   },
//   last_name: {
//     required: true,
//     // type: new VeryType().isAlphanumeric()
//   },
//   full_name: {
//     // type: new VeryType().isAlphanumeric(),
//     derive: function() { 
//       return this.first_name + ' ' + this.last_name;
//     }
//   },
//   email: {
//     required: true,
//     type: VeryType().isEmail()
//   },
//   slug: {
//     derive: function() {
//       return slugger(form.name);
//     }
//   },
//   gravatar: {
//     derive: function() {
//       return gravatar.url(email, 100);
//     }
//   },
//   twitter: {
//     type: VeryType().isAlphanumeric().len(1,16)
//     derive: function() {
//       // TODO: normalize the twitter handle
//       var handle = twitter;
//       return handle;
//     },
//   },
//   site: {
//     required: true,
//     type: VeryType().isURL()
//   },
//   company: {
//     required: false,
//     type: VeryType().isAlphanumeric()
//   },
//   bio: {
//     required: false,
//     type: VeryType().isAlphanumeric().len(0,160)
//   },
//   interests: {
//     required: false,
//     type: VeryType().isIn('fishing', 'dancing', 'pizza', 'hopscotch', 'dancing', 'prancing')
//   },
//   key: { 
//     private: true
//     }
//   }, 
//   { db: db, prefix: 'person!'}
// );

module.exports = Person;