var config = require('getconfig');
var _ = require('underscore');
var models = require('../models').models;
var async = require('async');

var itemReply, listReply;

var getForm = function (request, modelName, create, next) {
    var formMap, form;
    if (modelName === 'place') {
        formMap = {
            type    : request.payload.type,
            name    : request.payload.name,
            address : request.payload.address,
            city    : request.payload.city,
            image   : request.payload.image,
            twitter : request.payload.twitter,
            website : request.payload.website,
            about   : request.payload.about
        };
    } else if (modelName === 'list') {
        formMap = {
            
        };
    } else if (modelName === 'event') {
        formMap = {
            
        };
    } else if (modelName === 'group') {
        formMap = {
            
        };
    }

    if (create) {
        form = _.extend(formMap, {creator: request.auth.credentials.userid});
    } else { form = formMap; }

    next(form);
};

exports.itemReply = itemReply = function (itemType, item, session, thismod, iStarred, categories) {
    var replyData, gmapsApi;
    thismod = !!thismod;
    iStarred = !!iStarred;

    if (itemType === 'place') {
        gmapsApi = config.api.googleMaps;
    } else { gmapsApi = null; }

    if (typeof session === 'undefined') { 
        replyData = {
            itemType  : itemType,
            item      : item,
            gmapsApi  : gmapsApi
        };
    } else {
        replyData = {
            itemType  : itemType,
            item      : item,
            thismod   : thismod,
            userid    : session.userid,
            fullName  : session.fullName,
            avatar    : session.avatar,
            moderator : session.moderator,
            admin     : session.admin,
            iStarred  : iStarred,
            categories: categories,
            gmapsApi  : gmapsApi
        };
    }
    return replyData;
};

exports.listReply = listReply = function (itemType, items, mine, session) {
    var replyData;
    if (typeof mine === 'undefined') {
        mine = false;
    }

    if (typeof session === 'undefined') { 
        replyData = {
            itemType  : itemType,
            items     : items,
            mine      : mine
        };
    } else {
        replyData = {
            itemType  : itemType,
            items     : items,
            mine      : mine,
            fullName  : session.fullName,
            avatar    : session.avatar,
            userid    : session.userid,
            moderator : session.moderator,
            admin     : session.admin
        };
    }
    return replyData;
};

exports.makeListHandler = function (modelNameTitle, modelName, modelNamePlural) {
    var handler = function (request, reply) {
        var session = request.auth.credentials;
        models[modelNameTitle].all(function (err, items) {
            if (err) { throw err; }

            // show only items that have been approved
            var approved = _.where(items, { approved: true });

            // if we have a session
            if (session && session.userid) {

                // also show my items that haven't been approved yet
                var mine = [];
                _.each(items, function (thisItem) {
                    if (thisItem && thisItem.creator.key === session.userid && thisItem.approved === false) {
                        mine.push(thisItem);
                    }
                });

                // if there are no approved item or my unapproved items
                if(mine.length + approved.length === 0) {
                    reply.view('items/noItems', listReply(modelName, null, null, session));
                }
                // reply with approved and mine
                else {
                    reply.view('items/listItems', listReply(modelName, approved, mine, session));
                }
            }
            else {
                // if there are no approved items
                if (approved.length === 0) {
                    reply.view('items/noItems');
                }
                // else show the list of approved items
                else {
                    reply.view('items/listItems', listReply(modelName, approved));
                }
            }
        });
    };
    return handler;
};

exports.makeGetHandler = function (modelNameTitle, modelName, modelNamePlural) {
    var handler = function (request, reply) {
        var session = request.auth.credentials;

        models[modelNameTitle].findByIndex('slug', request.params.slug, function(err, item) {
            var thismod, iStarred;

            // if there's no such item, return a 404
            if (err) { reply.view('404'); }

            // if we have a session
            if (session.userid) {

                if (err) { throw err; }

                // if I created this item, I'm a moderator of it.
                if (item.creator.key === session.userid) { 
                    thismod = true;

                // if I didn't create it, I'm not a moderator
                } else { thismod = false; }

                // if I starred it
                if (item.hasKey('starredBy', session.userid)) {
                    iStarred = true;
                    reply.view('items/item', itemReply(modelName, item, session, thismod, iStarred));

                // if I didn't star it
                } else { 
                    iStarred = false; 
                    reply.view('items/item', itemReply(modelName, item, session, thismod, iStarred));
                }

            // if I don't have a session, give a standard page
            } else {
                reply.view('items/item', itemReply(modelName, item));
            }

        });
    };
    return handler;
};

exports.makeAddHandler = function (modelNameTitle, modelName, modelNamePlural) {
    var handler = function (request, reply) {
        var session = request.auth.credentials;
        var modelCategory = modelNameTitle + 'Category';
        // get categories
        models[modelCategory].all(function (err, categories) {
            // return the add item form
            reply.view('items/add' + modelNameTitle, itemReply(modelName, null, session, null, null, categories));
        });
    };
    return handler;
};

exports.makeCreateHandler = function (modelNameTitle, modelName, modelNamePlural) {
    var handler = function (request, reply) {
        // set up form
        getForm(request, modelName, true, function (form) {
            var item = models[modelNameTitle].create(form);
            // save the item
            item.save(function (err) {
                if (err) { throw err; }
                // return the new item page as confirmation
                reply().code(201).redirect('/' + modelNamePlural + '/' + item.slug);
            });
        });
    };
    return handler;
};

exports.makeEditHandler = function (modelNameTitle, modelName, modelNamePlural) {
    var handler = function (request, reply) {
        var session = request.auth.credentials;
        var modelCategory = modelNameTitle + 'Category';
        models[modelNameTitle].get(request.params.key, function (err, item) {
            if (err) { throw err; }
            models[modelCategory].all(function (err, categories) {
                if (err) { throw err; }
                reply.view('items/edit' + modelNameTitle, itemReply(modelName, item, session, null, null, categories));
            }); 
        });
    };
    return handler;
};

exports.makeUpdateHandler = function (modelNameTitle, modelName, modelNamePlural) {
    var handler = function (request, reply) {
        getForm(request, modelName, false, function (form) {
            models[modelNameTitle].update(request.params.key, form, function (err) {
                if (err) { throw err; }
                else { reply().code(201).redirect('/' + modelNamePlural); }
            });
        });
    };
    return handler;
};

exports.makeDeleteHandler = function (modelNameTitle, modelName, modelNamePlural) {
    var handler = function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            user: function (done) {
                models.User.get(session.userid, done);
            },
            item: function (done) {
                models[modelNameTitle].get(request.params.key, done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            context.item.delete(function (err) {
                if (err) { throw err; }
                reply.view('deleted').redirect('/' + modelNamePlural);
            });
        });
    };
    return handler;
};

exports.makeStarHandler = function (modelNameTitle, modelName, modelNamePlural) {
    var handler = function (request, reply) {
        var session = request.auth.credentials;
        models[modelNameTitle].get(request.params.key, function (err, item) {
            // get an array of the users which already starred the item
            var starredIds = item.starredBy.map(function (user) {
                return user.key;
            });
            // if the user already starred it, remove their star
            if (_.contains(starredIds, session.userid)) {
                item.starredBy = _.without(item.starredBy, session.userid);
                for (var i = 0; i < item.starredBy.length; i++) {
                    if (item.starredBy[i].key === session.userid) {
                        item.starredBy.splice(i, 1);
                        break;
                    }
                }
            }
            // otherwise we add it
            else {
                item.starredBy.push(session.userid);
            }
            item.save(function () {
                // redirect to starred item's page
                reply().redirect('/' + modelNamePlural + '/' + item.slug);
            });
        });
    };
    return handler;
};

exports.makeApproveHandler = function (modelNameTitle, modelName, modelNamePlural) {
    var handler = function (request, reply) {
        var session = request.auth.credentials;
        if (session.moderator) {
            models[modelNameTitle].update(request.params.key, { approved: true }, function () {
                // redirect to list of pending items
                reply.redirect('/pending');
            });
        }
        else { reply.redirect('/'); }
    };
    return handler;
};