var VeryModel = require('verymodel');
var slugger = require('slugger');
var gravatar = require('gravatar');
var level = require('level');

var Place = new VeryModel ({
  type: {
    type: VeryType().isIn('Restaurant', 'Coffee shop', 'Bar', 'Winery', 'Store', 'Company', 'Nonprofit', 'Venue', 'Public')
  },
  name: {
    required: true,
    type: VeryType().isAlphanumeric()
  },
  address: {
    required: true,
    type: VeryType().isAlphanumeric()
  },
  city: {
    required: true,
    type: VeryType().isAlphanumeric()
  },
  map: {
    type: VeryType().isURL(),
    // TODO get Google Maps URL
    derive: function() {
      return mapURL
    }
  },
  image: {
    required: true,
    type: VeryType().isURL()
  },
  twitter: {
    type: VeryType().isAlphanumeric().len(1,16)
    derive: function() {
      // TODO: normalize the twitter handle
      var handle = twitter;
      return handle;
    },
  },
  about: {
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
