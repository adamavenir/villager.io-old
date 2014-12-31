var config = require('getconfig');
var slugger = require('slugger');
var models = require('./server/models');
var Dulcimer = require('dulcimer');

if (config.getconfig.env !== 'dev' && config.getconfig.env !== 'test') {
    console.log('Devs only');
    process.exit(1);
}

Dulcimer.connect({type: 'level', path: './db'});

//var _ = require('underscore');
var async = require('async');

models = models.models;

function seedUsers (done) {
	var users = [
		{fullName: 'Michael Garvin', twitter: 'wraithgar', email: 'gar@andyet.net', company: '&yet', approved: true, moderator: true, admin: true,},
		{fullName: 'Nathan Fritz', twitter: 'fritzy', email: 'nathan@andyet.net', company: '&yet', approved: true, moderator: true, admin: true,}
	];
	async.each(users, function seedUser(user, next) {
		models.User.findByIndex('slug', slugger(user.fullName), function (err, existingUser) {
			var newUser = models.User.create(user);
			if (err || !existingUser) {
				newUser.save( function (err) {
					console.log('User created', user.fullName);
					next(err);
				});
			} else {
				existingUser.loadData(newUser.toJSON());
				existingUser.save(function (err) {
					console.log('User updated', user.fullName);
					next(err);
				});
			}
		});
	}, done);
}

function seedPlaceCategories (done) {
	var placeCategories = [
		{name: 'Restaurant'},
		{name: 'Coffee Shop'},
		{name: 'Bar'},
		{name: 'Winery'},
		{name: 'Store'},
		{name: 'Company'},
		{name: 'Nonprofit'},
		{name: 'Venue'},
		{name: 'Public'},
	];
	async.each(placeCategories, function seedPlaceCategory(cat, next) {
		models.PlaceCategory.findByIndex('slug', slugger(cat.name), function (err, existingCat) {
			var newCat = models.PlaceCategory.create(cat);
			if (err || !existingCat) {
				newCat.save( function (err) {
					console.log('Place Category created', cat.name);
					next(err);
				});
			} else {
				existingCat.loadData(newCat.toJSON());
				existingCat.save(function (err) {
					console.log('Place Category updated', cat.name);
					next(err);
				});
			}
		});
	}, done);
}

function seedGroupCategories (done) {
	var groupCategories = [
		{name: 'Music'},
		{name: 'Art'},
		{name: 'Theatre'},
		{name: 'Coworking'},
		{name: 'Educational'},
		{name: 'Social'},
		{name: 'Nonprofit'},
		{name: 'Support'},
	];
	async.each(groupCategories, function seedGroupCategory(cat, next) {
		models.GroupCategory.findByIndex('slug', slugger(cat.name), function (err, existingCat) {
			var newCat = models.GroupCategory.create(cat);
			if (err || !existingCat) {
				newCat.save( function (err) {
					console.log('Group Category created', cat.name);
					next(err);
				});
			} else {
				existingCat.loadData(newCat.toJSON());
				existingCat.save(function (err) {
					console.log('Group Category updated', cat.name);
					next(err);
				});
			}
		});
	}, done);
}

function seedActivityCategories (done) {
    var activityCategories = [
        {name: 'Fun'},
        {name: 'Neat'},
        {name: 'Family'},
        {name: 'Cool'},
        {name: 'Old'},
        {name: 'Outdoors'},
        {name: 'Travel'}
    ];
    async.each(activityCategories, function seedActivityCategory(cat, next) {
        models.ActivityCategory.findByIndex('slug', slugger(cat.name), function (err, existingCat) {
            var newCat = models.ActivityCategory.create(cat);
            if (err || !existingCat) {
                newCat.save( function (err) {
                    console.log('Activity Category created', cat.name);
                    next(err);
                });
            } else {
                existingCat.loadData(newCat.toJSON());
                existingCat.save(function (err) {
                    console.log('Activity Category updated', cat.name);
                    next(err);
                });
            }
        });
    }, done);
}


function seedEventCategories (done) {
	var eventCategories = [
		{name: 'Music'},
		{name: 'Theatre'},
		{name: 'Education'},
		{name: 'Forum'},
		{name: 'Presentation'},
		{name: 'Pro Sports'},
		{name: 'High School Sports'},
		{name: 'Meetup'},
		{name: 'Meeting'},
		{name: 'Fundraiser'}
	];
	async.each(eventCategories, function seedEventCategory(cat, next) {
		models.EventCategory.findByIndex('slug', slugger(cat.name), function (err, existingCat) {
			var newCat = models.EventCategory.create(cat);
			if (err || !existingCat) {
				newCat.save( function (err) {
					console.log('Event Category created', cat.name);
					next(err);
				});
			} else {
				existingCat.loadData(newCat.toJSON());
				existingCat.save(function (err) {
					console.log('Event Category updated', cat.name);
					next(err);
				});
			}
		});
	}, done);
}

function seedAll (err) {
	if (err) { throw err; }
    async.series([
        function (done) {
            seedEventCategories(done);
        }, function (done) {
            seedUsers(done);
        }, function (done) {
        	seedPlaceCategories(done);
        }, function (done) {
        	seedGroupCategories(done);
        }, function (done) {
        	seedActivityCategories(done);
        }
    ], function (err) {
        if (err) { throw err; }
    });
}

module.exports = seedAll();