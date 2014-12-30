var slugger = require('slugger');
var dulcimer = require('dulcimer');
var verymodel = require('verymodel');

var type = verymodel.VeryType;

var EventSeries = new dulcimer.Model(
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
        events: {
            foreignKeys: 'event',
        },
        group: {
            foreignKey: 'group'
        },
        place: {
            foreignKey: 'place'
        },
        starredBy: {
            foreignKeys: 'user',
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
            foreignKeys: 'user',
        },
        creator: {
            foreignKey: 'user'
        }
    },
    {
        name: 'series',
        saveKey: 'true'
    }
);

module.exports = EventSeries;
