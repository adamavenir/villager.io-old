var sugar = require('sugar');
var slugger = require('slugger');
var dulcimer = require('dulcimer');
var verymodel = require('verymodel');
var async = require('async');
var _ = require('underscore');
var Group = require('./group');
var Place = require('./place');
var EventCategory = require('./categories/EventCategory');


// using Sugar so it stops triggering jshint saying it's not used
// Sugar overrides the native Date object, as I understand it,
// and thus jshint doesn't see it used despite it being defined. argh.
if (!sugar) { console.log ('not going to happen ever'); }

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
                    return '/events/' + this.slug;
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
            foreignKey: 'group',
            index: true
        },
        place: {
            foreignKey: 'place',
            index: true
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


// helper for fetching all possible related 
// data for add/edit forms
Event.getPossibleRelatedOptions = function (callback) {
    // fetch all our related data
    // in parallel
    async.parallel({
        categories: function (cb) {
            EventCategory.all(cb);
        },
        groups: function (cb) {
            Group.all(cb);
        },
        places: function (cb) {
            Place.all(cb);
        }
    }, function (err, res) {
        if (err) {
            return callback(err);
        }

        res.categories = res.categories[0];
        res.groups = res.groups[0];
        res.places = res.places[0];

        callback(null, res);
    });
};

Event.getGroupedEvents = function (groupByKey, callback) {
    Event.all({
        filter: function (event) {
            return !!event[groupByKey];
        }
    }, function (err, events) {
        if (err) {
            return callback(err);
        }

        var grouped = _.groupBy(events, function (event) {
            return event[groupByKey].key;
        });

        // create our master list
        var items = _.chain(events)
            // extract related item data from each event
            .map(function (event) {
                return event[groupByKey];
            })
            // filter out dupes
            .unique(function (item) {
                return item.key;
            })
            // link back up to known events
            .each(function (item) {
                item.events = grouped[item.key];
            })
            .value();

        callback(null, items);
    });
};

module.exports = Event;
