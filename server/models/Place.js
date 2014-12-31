var dulcimer = require('dulcimer');
var verymodel = require('verymodel');
var slugger = require('slugger');

var type = verymodel.VeryType;

var Place = new dulcimer.Model (
    {
        type: {
            foreignKey: 'place-category',
            private: false
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
        url: {
            derive: function () {
                if (this.slug) {
                    return '/places/' + this.slug
                }
            }
        },
        phone: {
            required: false,
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
            derive: function() {
                if (this.address && this.address.length > 0) {
                    return 'http://maps.google.com/?q=' + this.address + ' ' + this.city;
                }
                else {
                    return '';
                }
            },
            type: type().isUrl(),
        },
        image: {
            required: false,
            type: type().isUrl()
        },
        website: {
            type: type().isUrl(),
            required: false
        },
        about: {
            required: false,
            type: type().isAlphanumeric().len(0,160)
        },
        starredBy: {
            foreignKeys: 'user',
        },
        listedBy: {
            foreignKeys: 'user',
        },
        stars: {
            required: true,
            derive: function () {
                if (this.starredBy) {
                    return this.starredBy.length || 0;
                }
            },
        },
        lists: {
            required: true,
            derive: function () {
                if (this.listedBy) {
                    return this.listedBy.length || 0;
                }
            },
        },
        approved: {
            default: false,
            type: 'boolean',
            required: true,
            index: true
        },
        creator: {
            foreignKey: 'user',
            private: false,
            index: true
        }
    },
    {
        name: 'place',
        saveKey: 'true'
    }
);

module.exports = Place;
