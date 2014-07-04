var dulcimer = require('dulcimer');
var slugger = require('slugger');

var List = new dulcimer.Model({
	name:{
		required: true
	},
	what: {
		type: 'enum',
		values: ['groups', 'people', 'places']
	},
	slug: {
        derive: function () {
            return slugger(this.name);
        },
        index: true,
        private: false
    },
    description: {
    },
    image: {
    },
    groups: {
    	foreignCollection: 'group',
        default: []
    },
    places: {
    	foreignCollection: 'place',
        default: []
    },
    people: {
    	foreignCollection: 'user',
        default: []
    }

},
{name: 'list'});

module.exports = List;