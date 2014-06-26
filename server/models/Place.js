var dulcimer = require('dulcimer');
var verymodel = require('verymodel');
var slugger = require('slugger');

var type = verymodel.VeryType;

var Place = new dulcimer.Model (
    {
        type: {
            foreignKey: 'place-category'
        },
        name: {
            required: true,
            type: type().isAlphanumeric()
        },
        slug: {
            derive: function () {
                return slugger(this.name, {alsoAllow: '&'});
            },
            index: true,
            private: false
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
            processIn: function() {
                if (this.address.length > 0) {
                    return 'http://maps.google.com/?q=' + this.address + ' ' + this.city;
                }
                else {
                    return '';
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
        about: {
            required: false,
            type: type().isAlphanumeric().len(0,160)
        },
        starredBy: {
            default: [],
            foreignCollection: 'user',
            required: true
        },
        stars: {
            required: true,
            derive: function () {
                return this.starredBy.length || 0;
            },
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
        // creatorName: {
        //   derive: function(creatorKey) {
        //     User.getByIndex(creatorKey, function(err, user) {
        //       return user.fullName;
        //     })
        //   }
        // },
        moderator: {
            index: true
        }
    },
    {
        name: 'place'
    }
);

module.exports = Place;
