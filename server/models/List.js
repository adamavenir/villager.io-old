var dulcimer = require('dulcimer');
var verymodel = require('verymodel');
var slugger = require('slugger');

var type = verymodel.VeryType;

var List = new dulcimer.Model(
    {
        name: {
            required: true
        },
        type: {
            type: 'enum',
            values: ['groups', 'places'],
            default: 'places',
            private: false,
            index: true,
            required: true
        },
        slug: {
            derive: function () {
                return slugger(this.name);
            },
            index: true,
            private: false
        },
        about: {
            required: false,
            type: type().isAlphanumeric().len(0,160)
        },
        image: {
            required: false,
            type: type().isUrl()
        },
        groups: {
            foreignCollection: 'group',
            default: []
        },
        places: {
            foreignCollection: 'place',
            default: []
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
            default: true,
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
        name: 'list',
        saveKey: 'true'
    }
);

module.exports = List;