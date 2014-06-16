var S = require('string');
var slugger = require('slugger');
var dulcimer = require('dulcimer');
var verymodel = require('verymodel');

var type = verymodel.VeryType;

var User = new dulcimer.Model(
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
                if (this.fullName) {
                    return slugger(this.fullName, {alsoAllow: '&'});  
                }
                else {
                    return this.twitter;
                }
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
                return twitter;
                    // .remove('@')
                    // .remove('http://twitter.com/')
                    // .remove('https://twitter.com/')
                    // .remove('twitter.com/');
            },
            type: new type().isAlphanumeric().len(1,16),
            index: true,
            required: false
        },
        website: {
            type: new type().isUrl(),
            required: false
        },
        company: {
            type: new type().isAlphanumeric()
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
        },
        hasLoggedIn: {
            default: false,
            type: 'boolean',
            required: true,
            index: true
        }
    },
    { 
        name: 'user'
    }
);

module.exports = User;