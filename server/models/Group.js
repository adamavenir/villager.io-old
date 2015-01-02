 var dulcimer = require('dulcimer');
var verymodel = require('verymodel');
var slugger = require('slugger');

var type = verymodel.VeryType;

var Group = new dulcimer.Model(
    {
        type: {
            foreignKey: 'group-category',
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
                    return '/groups/' + this.slug;
                }
            }
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
            foreignKeys: 'user'
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
        name: 'group',
        saveKey: 'true'
    }
);

module.exports = Group;
