var config = require('getconfig');
var slugger = require('slugger');
var models = require('./server/models').models;
var Dulcimer = require('dulcimer');
var async = require('async');

if (config.getconfig.env !== 'dev' && config.getconfig.env !== 'test') {
    console.log('Not for production');
    process.exit(1);
}

Dulcimer.connect({ 
    type: config.db.type, 
    path: config.db.path 
});

var users = [
    {
        fullName: 'Michael Garvin', 
        twitter: 'wraithgar', 
        email: 'gar@andyet.net', 
        company: '&yet', 
        approved: true, 
        moderator: true, 
        admin: true,
    },
    {        fullName: 'Nathan Fritz',
        twitter: 'fritzy',
        email: 'nathan@andyet.net',
        company: '&yet',
        approved: true,
        moderator: true,
        admin: true
    },
    {
        fullName: 'Heather Seaman',
        twitterId: '2511636140',
        twitter: 'one000mph',
        twavatar: 'https://pbs.twimg.com/profile_images/539962260580335616/8WPRGt7j.jpeg',
        website: 'http://ike.io',
        about: 'Orthodox Renaissance Kid. Artificer. Node Hobbit at @andyet. Producer at @muxtc. Peddler of bombast.',
        approved: true,
        admin: false,
        moderator: true
    },
    {
        fullName: 'Isaac Lewis',
        twitterId: '217607250',
        twitter: '_crossdiver',
        twavatar: 'https://pbs.twimg.com/profile_images/468983792628011008/bmZ6KUyZ_400x400.jpeg',
        website: 'https://github.com/one000mph',
        about: 'AdventurerLearnerDiscipleProgrammerConnoisseurOfFineTeasMathLoverYogiYeti',
        approved: true,
        admin: false,
        moderator: false
    }
];


var items = [
    { 
        title: 'GroupCategory',
        name: 'Group',
        cats: ['Music', 'Art', 'Theatre', 'Coworking', 'Educational', 'Social', 'Nonprofit', 'Support']
    },
    { 
        title: 'EventCategory',
        name: 'Event',
        cats: ['Music', 'Theatre', 'Education', 'Forum', 'Presentation', 'Pro Sports', 'High School Sports', 'Meetup', 'Meeting', 'Fundraiser']
        
    },
    {
        title: 'PlaceCategory',
        name: 'Place',
        cats: ['Restaurant', 'Coffee Shop', 'Bar', 'Winery', 'Store', 'Company', 'Nonprofit', 'Venue', 'Public']
    },
    {
        title: 'ActivityCategory',
        name: 'Activity',
        cats: [ 'Fun', 'Neat', 'Family', 'Cool', 'Old', 'Outdoors', 'Travel' ]
    }
];

// var placeData = [
//     {

//     }
// ];

// var eventData = [
//     {

//     }
// ];

// var groupData = [
//     {

//     }
// ];

// var listData = [
//     {

//     }
// ];

// var activityData = [
//     {

//     }
// ];

var seedUsers = function (users, done) {
    async.each(users, function (user, next) {
        models.User.findByIndex('slug', slugger(user.fullName), function (err, exists) {
            var newUser = models.User.create(user);
            if (err || !exists) {
                newUser.save( function (err) {
                    console.log('User created', user.fullName);
                    next(err);    
                });
            } else {
                exists.loadData(newUser);
                exists.save(function (err) {
                    console.log('User updated', exists.fullName);
                    next(err);
                });
            }
        });
    }, done);
};

// var seedItemData = function (items, done) {

// }

var seedCategories = function (items, done) {
    async.each(items, function (item, nextItem) {
        // iterate through the item
        async.each(item.cats, function (cat, nextCat) {
            models[item.title].findByIndex('slug', slugger(cat.name), function (err, exists) {
                var newCat = models[item.title].create({ name: cat });
                if (err || !exists) {
                    newCat.save( function (err) {
                        console.log(item.title + ' category created:', cat);
                        nextCat(err);
                    });
                } else {
                    exists.loadData(newCat);
                    exists.save(function (err) {
                        console.log(item.title + ' category updated:', cat);
                        nextCat(err);
                    });
                }
            });
        }, nextItem);
    }, done);
};


function seedAll (err) {
    if (err) { throw err; }
    async.series([
        function (done) {
            seedUsers(users, done);
        },
        function (done) {
            seedCategories(items, done);
        }
    ], function (err) {
        if (err) { throw err; }
    });
}

// TODO: add function to delete all seeded data

module.exports = seedAll();