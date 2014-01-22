var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');
var level = require('level');

var type = verymodel.VeryType;

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
}, {prefix: 'places!'});

module.exports = Place;
