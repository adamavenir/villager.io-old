var models = require('../models').models;
var async = require('async');

module.exports = {

	addInterest: function (request,reply) {
    	var form = request.payload;
    	var newInterest = models.Interest.create(form);
    	newInterest.save(function (err) {
    		if (err) { throw err; }
    		reply().redirect('/tinker');
	    });
	},

	delete: function (request, reply) {
		var categoryType = request.params.categoryType;
        var session = request.auth.credentials;
        async.parallel({
            user: function(done) { done(null, session.userid); },
            model: function (done) {
            	if (categoryType === 'interests') {
            		console.log('interests');
 	                models.Interest.findByIndex('slug', request.params.modelSlug, done);
            	}
            	else if (categoryType === 'group-category') {
   	                models.GroupCategory.findByIndex('slug', request.params.modelSlug, done);
            	}
            	else if (categoryType === 'place-category') {
		         	models.PlaceCategory.findByIndex('slug', request.params.modelSlug, done);
            	}
            	else {
            		done('Invalid category type', null);
            	}
            }
        }, function (err, context) {
            if (err) { throw err; }
            context.model.delete(function (err) {
                if (err) { throw err; }
                var l = models.Log.create({ objType: 'category',
                                    editType: 'deleted',
                                    editorKey: session.userid,
                                    editorName: context.user.fullName,
                                    editorAvatar: context.user.avatar,
                                    editedKey: request.params.placeKey,
                                    editedName: request.params.placeName });
                l.save(function(err) {
                    if (err) { throw err; }
                    console.log('logging');
                });
                reply.view('deleted').redirect('/tinker');
            });
        });
    },
    edit: function (request, reply) {
		var categoryType = request.params.categoryType;
        var session = request.auth.credentials;
        async.parallel({
            user: function(done) { done(null, session.userid); },
            model: function (done) {
            	if (categoryType === 'interests') {
            		console.log('interests');
 	                models.Interest.findByIndex('slug', request.params.modelSlug, done);
            	}
            	else if (categoryType === 'group-category') {
            		console.log('group-category');
   	                models.GroupCategory.findByIndex('slug', request.params.modelSlug, done);
            	}
            	else if (categoryType === 'place-category') {
            		console.log('place-category');
		         	models.PlaceCategory.findByIndex('slug', request.params.modelSlug, done);
            	}
            	else {
            		done('Invalid category type', null);
            	}
            }
        }, function (err, context) {
            if (err) { throw err; }
            console.log('context%j', context);
            context.categoryType = categoryType;
            reply.view('tinker/editing', context);
        });
    },
    update: function (request, reply) {
        var categoryType = request.params.categoryType;
        var form = request.payload;
        console.log('form is', form);
        console.log('categoryType', categoryType);
        if (form.name) {
        	if (categoryType === 'interests') {
        		models.Interest.update(request.params.modelKey, form, function () {
        			reply().redirect('/tinker');
        		});
			}
        	else if (categoryType === 'group-category') {
        		models.GroupCategory.update(request.params.modelKey, form, function () {
        			reply().redirect('/tinker');
        		});
        	}
        	else if (categoryType === 'place-category') {
	         	models.PlaceCategory.update(request.params.modelKey, form, function () {
        			reply().redirect('/tinker');
        		});
        	}
        }
        else {
        	console.log('error updating');
        }
    },
	addGroupCategory: function (request,reply) {
    	var form = request.payload;
    	var newCat = models.GroupCategory.create(form);
    	newCat.save(function (err) {
    		if (err) { throw err; }
    		reply().redirect('/tinker');
	    });
	},
	addPlaceCategory: function (request,reply) {
    	var form = request.payload;
    	var newCat = models.PlaceCategory.create(form);
    	newCat.save(function (err) {
    		if (err) { throw err; }
    		reply().redirect('/tinker');
	    });
	}
};