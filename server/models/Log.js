var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');
var level = require('level');
var User = require('../models/User');

var type = verymodel.VeryType;

var Log = new VeryLevelModel ({
  editTime: {
    processIn: function() {
      return Date.now();
    },
    required: true,
    index: true
  },
  objType: {
    required: true,
    index: true
  },
  editType: {
    required: true,
    index: true
  },
  editorKey: {
    required: true
  },
  editorName: {
    processIn: function(editorKey) {
      User.load(editorKey, function(err, user) {
        if(err) { console.log(err) }
        console.log(user.fullName);
        return user.fullName
      })
    }
  },
  editorAvatar: {
    processIn: function(editorKey) {
      User.load(editorKey, function(err, user) {
        if(err) { console.log(err) }
        console.log(user.avatar);
        return user.avatar
      })
    }
  }
}, {prefix: 'log!'});

module.exports = Log;
