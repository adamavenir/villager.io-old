var dulcimer = require('dulcimer');
var slugger = require('slugger');

// var type = verymodel.VeryType;

var Log = new dulcimer.Model (
    {
        editTime: {
            processIn: function() {
                return Date.now();
            },
            required: true
        },
        objType: {
            required: true,
            index: true
        },
        editType: {
            required: true,
            index: true
        },
        editedKey: {
            required: true,
            index: true
        },
        editedName: {
            required: true
        },
        editedSlug: {
            derive: function() {
                return slugger(this.editedName);
            }
        },
        editorKey: {
            required: true
        },
        editorName: {
            // processIn: function(editorKey) {
            //   User.load(editorKey, function(err, user) {
            //     if(err) { console.log(err) }
            //     console.log(user.fullName);
            //     return user.fullName
            //   })
            // }
        },
        editorAvatar: {
            // processIn: function(editorKey) {
            //   User.load(editorKey, function(err, user) {
            //     if(err) { console.log(err) }
            //     console.log(user.avatar);
            //     return user.avatar
            //   })
            // }
        },
        editorSlug: {
            derive: function() {
                return slugger(this.editorName);
            }
        }
    }, 
    {
        name: 'log'
    }
);

module.exports = Log;
