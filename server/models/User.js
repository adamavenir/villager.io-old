var S = require('string');
var slugger = require('slugger');
var dulcimer = require('dulcimer');
var verymodel = require('verymodel');
var gravatar = require('gravatar');

var type = verymodel.VeryType;

var User = new dulcimer.Model(
    {
        fullName: {
            type: new type().isAlphanumeric().len(1,80),
            required: true
        },
        avatar: {
            derive: function () {
                if (this.twavatar) { return this.twavatar;
                } else if (this.gravatar) { return this.gravatar;
                } else { return '/images/generic.gif'; }
            },
            default: function () {
                return '/images/generic.gif';
            },
            required: true
        },
        gravatar: {
            derive: function () {
                if (this.email) {
                    return gravatar.url(this.email, true);
                } else { return false; }
            },
            required: false
        },
        twavatar: {
            processIn: function (avatar) {
                if (avatar) {
                    return S(avatar).replaceAll('_normal', '_bigger').s;
                }
            },
            required: false
        },
        username: {
            type: new type().isAlphanumeric().len(1,80),
            required: false,
            index: true
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
        urlSlug: {
            derive: function () {
                if (this.username) {
                    return this.username;
                } else {
                    return this.slugName;
                }
            },
            index: true
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
                return S(twitter).replaceAll('@', '').replaceAll('http://twitter.com/', '').replaceAll('https://twitter.com/', '').replaceAll('twitter.com/', '').s;
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