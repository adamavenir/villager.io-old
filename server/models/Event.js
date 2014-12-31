var sugar = require('sugar');
var slugger = require('slugger');
var dulcimer = require('dulcimer');
var verymodel = require('verymodel');

var type = verymodel.VeryType;

var Event = new dulcimer.Model(
    {
        type: {
            foreignKey: 'event-category',
            private: false
        },
        name: {
            type: new type().isAlphanumeric().len(1,80),
            required: true
        },
        slug: { 
            derive: function () {
                return slugger(this.name);
            }, 
            index: true,
            private: false 
        },
        url: {
            derive: function () {
                if (this.slug) {
                    return '/events/' + this.slug
                }
            }
        },
        email: {
            type: new type().isEmail(),
            required: false
        },
        phone: {
            type: new type().isAlphanumeric(),
            required: false
        },
        date: {
            processIn: function(date) {
                return Date.future(date);
            }
        },
        humanDate: {
            derive: function() {
                return Date.create(this.date).format('{Month} {d}, {yyyy}');
            }
        },
        time: {
            type: new type().isAlphanumeric(),
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
            type: new type().isAlphanumeric().len(0,160),
        },
        group: {
            foreignKey: 'group'
        },
        place: {
            foreignKey: 'place'
        },
        organizers: {
            foreignKeys: 'user',
        },
        rsvps: {
            foreignKeys: 'user',
        },
        starredBy: {
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
        listedBy: {
            foreignKeys: 'user',
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
            default: true,
            type: 'boolean',
            required: true,
            index: true
        },
        moderators: {
            default: [],
            foreignCollection: 'user',
            required: true
        },
        creator: {
            foreignKey: 'user',
            private: false,
            index: true
        }
    },
    {
        name: 'event',
        saveKey: 'true'
    }
);

module.exports = Event;
