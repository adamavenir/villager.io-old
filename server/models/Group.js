var dulcimer = require('dulcimer');
var verymodel = require('verymodel');
var slugger = require('slugger');

var type = verymodel.VeryType;

var Group = new dulcimer.Model(
    {
        type: {
            foreignKey: 'group-category'
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
        phone: {
            required: false,
            type: type().isAlphanumeric()
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
        creator: {
            foreignKey: 'user',
            private: false
        }
    },
    {
        name: 'group'
    }
);

module.exports = Group;