var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');
var level = require('level');
// var config = require('getconfig');
var db = level('./db', { valueEncoding: 'json' });

var Place = new VeryLevelModel ({
  type: {
    type: VeryType().isIn('Restaurant', 'Coffee shop', 'Bar', 'Winery', 'Store', 'Company', 'Nonprofit', 'Venue', 'Public')
  },
  name: {
    required: true,
    type: VeryType().isAlphanumeric()
  },
  address: {
    required: false,
    type: VeryType().isAlphanumeric()
  },
  city: {
    required: false,
    type: VeryType().isAlphanumeric()
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
    type: VeryType().isUrl(),
  },
  image: {
    required: true,
    type: VeryType().isURL()
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
    type: VeryType().isAlphanumeric().len(0,160)
  },
  key: { 
    private: true,
    derive: function () {
      return 'places!' + slug;
    }
  },
});
