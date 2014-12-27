var slugger = require('slugger');
var dulcimer = require('dulcimer');
var verymodel = require('verymodel');

var type = verymodel.VeryType;

var Event = new dulcimer.Model(
    {
        type: {
            foreignKey: 'event-category'
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
        email: {
            type: new type().isEmail(),
            required: false
        },
        phone: {
            type: new type().isAlphanumeric(),
            required: false
        },
        eventDate: {
            processIn: function(eventDate) {
                return Date.create(eventDate);
            }
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
            default: [],
            foreignCollection: 'user',
            required: true
        },
        rsvps: {
            default: [],
            foreignCollection: 'user',
            required: true
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
        moderators: {
            default: [],
            foreignCollection: 'user',
            required: true
        },
        creator: {
            foreignKey: 'user'
        }
    },
    {
        name: 'event'
    }
);

module.exports = Event;