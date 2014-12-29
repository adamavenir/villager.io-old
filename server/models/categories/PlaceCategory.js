var dulcimer = require('dulcimer');
var verymodel = require('verymodel');
var slugger = require('slugger');

var type = verymodel.VeryType;

var PlaceCategory = new dulcimer.Model(
    {
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
        }
    },
    {
        name: 'place-category',
        saveKey: 'true'
    }
);

module.exports = PlaceCategory;