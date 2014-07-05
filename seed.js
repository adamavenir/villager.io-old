var config = require('getconfig');
var slugger = require('slugger');

if (config.getconfig.env !== 'dev') {
    console.log('Devs only');
    process.exit(1);
}

var level = require('level');
var models = require('./server/models');
var db = level(config.db || './db', { valueEncoding: 'json' });
//var _ = require('underscore');
var async = require('async');

models.attachDB(db);

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

function seedInterests (done) {
	var interests = [
		{name: 'fishing', description: 'Just sitting there all day long...'},
		{name: 'pizza', description: 'Nothing better than cheese and carbs'},
		{name: 'hopscotch', description: 'ta da ta da'},
		{name: 'dancing', description: 'With the STARS!'},
		{name: 'prancing', description: 'along with the reindeer'}
	];
	async.each(interests, function seedInterest(interest, next) {
		models.Interest.findByIndex('slug', slugger(interest.name), function (err, existingInterest) {
			var newInterest = models.Interest.create(interest);
			if (err || !existingInterest) {
				newInterest.save( function (err) {
					console.log('Interest created', interest.name);
					next(err);
				});
			} else {
				existingInterest.loadData(newInterest.toJSON());
				existingInterest.save(function (err) {
					console.log('Interest updated', interest.name);
					next(err);
				});
			}
		});
	}, done);
}

function seedPlaceCategories (done) {
	var placeCategories = [
		{name: 'Restaurant', description: 'eateries & more'},
		{name: 'Coffee Shop', description: 'caffeine for you every day'},
		{name: 'Bar', description: 'for after work'},
		{name: 'Winery', description: 'for during work'},
		{name: 'Store', description: 'places to buy stuff'},
		{name: 'Company', description: 'in good company'},
		{name: 'Nonprofit', description: 'because we don\'t want to make a profit'},
		{name: 'Venue', description: 'have your events here!'},
		{name: 'Public', description: 'for everyone'},
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
		{name: 'Music', description: 'for the ears'},
		{name: 'Art', description: 'for the eyes'},
		{name: 'Theater', description: 'for the soul'},
		{name: 'Coworking', description: 'for during work'},
		{name: 'Educational', description: 'for the mind'},
		{name: 'Social', description: 'for the heart'},
		{name: 'Nonprofit', description: 'because we don\'t want to make a profit'},
		{name: 'Support', description: 'I\'m here for you'},
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

function seedAll (err) {
	if (err) { throw err; }
    async.series([
        function (done) {
            seedInterests(done);
        }, function (done) {
            seedUsers(done);
        }, function (done) {
        	seedPlaceCategories(done);
        }, function (done) {
        	seedGroupCategories(done);
        }
    ], function (err) {
        if (err) { throw err; }
    });
}

seedAll(null);
