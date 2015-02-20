var config = require('../../config-helper');
var _ = require('underscore');
var models = require('../models').models;
var async = require('async');

var itemReply, listReply;

var getForm = function (request, modelName, create, next) {
    var formMap;
    var form = request.payload;

    if (modelName === 'place') {
        formMap = {
            type    : form.type,
            name    : form.name,
            address : form.address,
            city    : form.city,
            image   : form.image,
            twitter : form.twitter,
            website : form.website,
            about   : form.about
        };
    } else if (modelName === 'list') {
        formMap = {
            type    : form.type,
            name    : form.name,
            about   : form.about,
            image   : form.image
        };
    } else if (modelName === 'event') {
        formMap = {
            type    : form.type,
            place   : form.place,
            group   : form.group,
            name    : form.name,
            email   : form.email,
            phone   : form.phone,
            date    : form.date,
            time    : form.time,
            image   : form.image,
            website : form.website,
            about   : form.about,
        };
    } else if (modelName === 'group') {
        formMap = {
            type    : form.type,
            name    : form.name,
            image   : form.image,
            twitter : form.twitter,
            website : form.website,
            about   : form.about
        };
    }

    console.log(formMap);

    if (create) {
        form = _.extend(formMap, {creator: request.auth.credentials.userid});
    } else { form = formMap; }

    next(form);
};

exports.itemReply = itemReply = function (itemType, itemPlural, item, session, thismod, starredByMe, categories) {
    var replyData, gmapsApi;
    thismod = !!thismod;
    starredByMe = !!starredByMe;

    if (itemType === 'place') {
        gmapsApi = config.GOOGLEMAPSAPIKEY;
    } else { gmapsApi = null; }

    if (typeof session === 'undefined') { 
        replyData = {
            itemType  : itemType,
            itemPlural: itemPlural,
            item      : item,
            gmapsApi  : gmapsApi
        };
    } else {
        replyData = {
            itemType  : itemType,
            itemPlural: itemPlural,
            item      : item,
            thismod   : thismod,
            userid    : session.userid,
            fullName  : session.fullName,
            slug      : session.slug,
            avatar    : session.avatar,
            moderator : session.moderator,
            admin     : session.admin,
            starredByMe  : starredByMe,
            categories: categories,
            gmapsApi  : gmapsApi
        };
    }
    return replyData;
};

exports.listReply = listReply = function (itemType, itemPlural, items, session, mine) {
    var replyData;
    if (typeof mine === 'undefined') {
        mine = false;
    }

    if (typeof session === 'undefined') { 
        replyData = {
            itemType  : itemType,
            itemPlural: itemPlural,
            items     : items,
            mine      : mine
        };
    } else {
        replyData = {
            itemType  : itemType,
            itemPlural: itemPlural,
            items     : items,
            mine      : mine,
            fullName  : session.fullName,
            slug      : session.slug,
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
        // TODO: add pagination (err, items, page)
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
                    reply.view('items/noItems', listReply(modelName, modelNamePlural, null, session));
                }

                // reply with approved and mine
                else {
                    reply.view('items/listItems', listReply(modelName, modelNamePlural, approved, session, mine));
                }
            }
            else {

                // if there are no approved items
                if (approved.length === 0) {
                    reply.view('items/noItems', listReply(modelName, modelNamePlural, null));
                }

                // else show the list of approved items
                else {
                    reply.view('items/listItems', listReply(modelName, modelNamePlural, approved));
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
            var thismod;

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
                item.hasForeign('starredBy', session.userid, function (err, starredByMe) {
                    reply.view('items/get' + modelNameTitle, itemReply(modelName, modelNamePlural, item, session, thismod, starredByMe));
                });

            // if I don't have a session, give a standard page
            } else {
                reply.view('items/item', itemReply(modelName, modelNamePlural, item));
            }

        });
    };
    return handler;
};

exports.makeAddHandler = function (modelNameTitle, modelName, modelNamePlural) {
    var handler = function (request, reply) {
        var session = request.auth.credentials;

        if (modelName !== 'list') {
            var modelCategory = modelNameTitle + 'Category';

            // get categories
            models[modelCategory].all(function (err, categories) {
                // return the add item form
                reply.view('items/add' + modelNameTitle, itemReply(modelName, modelNamePlural, null, session, null, null, categories));
            });
        } else {
            reply.view('items/add' + modelNameTitle, itemReply(modelName, modelNamePlural, null, session, null, null, null));
        }
    };
    return handler;
};

exports.makeCreateHandler = function (modelNameTitle, modelName, modelNamePlural) {
    var handler = function (request, reply) {
        var session = request.auth.credentials;

        // set up form
        getForm(request, modelName, true, function (form) {
            var item = models[modelNameTitle].create(form);
            // save the item
            item.save(function (err) {
                if (err) { throw err; }

                // return the new item page as confirmation
                if (modelName === 'list') {
                    reply().code(201).redirect('/' + modelNamePlural + '/' + session.slug + '/' + item.slug);
                } else {
                    reply().code(201).redirect('/' + modelNamePlural + '/' + item.slug);
                }
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
                reply.view('items/edit' + modelNameTitle, itemReply(modelName, modelNamePlural, item, session, null, null, categories));
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
            item.hasForeign('starredBy', session.userid, function (err, starredByMe) {
                if (err) { throw err; }

                // if the user has starred this item, remove them from starredBy
                if (starredByMe) {
                    item.removeForeign('starredBy', session.userid, function (err) {
                        if (err) { throw err; }
                        reply().code(200).redirect('/' + modelNamePlural + '/' + item.slug);
                    });

                // if the user hasn't starred it, add them to starredBy
                } else {
                    item.addForeign('starredBy', session.userid, function (err) {
                        if (err) { throw err; }
                        if (modelName === 'list') {
                            reply().code(201).redirect('/' + modelNamePlural + '/' + session.slug + '/' + item.slug);
                        } else {
                            reply().code(200).redirect('/' + modelNamePlural + '/' + item.slug);
                        }
                    });
                }
            });
        });
    };
    return handler;
};

exports.makeApproveHandler = function (modelNameTitle) {
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

// returns a form that shows the item in question and
// allows a user to select from their lists to add it to one
// TODO: or create a new list to add it to?

exports.makeListSelectHandler = function () {
    var handler = function (request, reply) {
        var session = request.auth.credentials;
        var listType;

        // generate modelNameTitle
        if (request.params.listType === 'groups') {
            listType = 'Group';
        } else if (request.params.listType === 'places') {
            listType = 'Place';
        // if listType isn't 'groups' or 'places', this is a bad url
        } else { reply.view('404'); }

        async.parallel({
            item: function (done) {
                models[listType].get(request.params.itemKey, done);
            },
            myLists: function (done) {
                models.List.getByIndex('creator', session.userid, done);
            },
        }, function (err, context) {

            // from my lists, get the relevant lists
            var lists = _.where(context.myLists[0], { type: request.params.listType });

            reply.view('items/selectList', {
                itemType  : request.params.listType,
                item      : context.item,
                myLists   : lists,
                userid    : session.userid,
                slug      : session.slug,
                fullName  : session.fullName,
                avatar    : session.avatar,
                moderator : session.moderator,
                admin     : session.admin
            });
        });
    };
    return handler;
};

// TODO: this is erroneously assuming a user only lists something once
exports.makeAddToListHandler = function () {
    var handler = function (request, reply) {
        var itemKey = request.params.itemKey;
        var listKey = request.params.listKey;
        var userKey = request.auth.credentials.userid;
        var listType = request.params.listType;
        var modelNameTitle;

        // generate modelNameTitle by capitalizing itemType param
        if (listType === 'places') {
            modelNameTitle = 'Place';
        } else if (listType === 'groups') {
            modelNameTitle = 'Group';
        }

        // get this instance of list, item, and user
        async.parallel({
            list: function (done) {
                models.List.get(listKey, done);
            },
            item: function (done) {
                models[modelNameTitle].get(itemKey, done);
            },
            user: function (done) {
                models.User.get(userKey, done);
            }
        }, function (err, context) {
            if (err) { throw err; }

            // add the user as a lister of the item
            context.item.addForeign('listedBy', context.user, function (err) {
                if (err) { throw err; }
                // add the item as a member of the list
                context.list.addForeign(listType, context.item, function (err) {
                    if (err) { throw err; }
                    reply().code(200).redirect('/lists/' + context.user.slug + '/' + context.list.slug);
                });
            });
        });
    };
    return handler;
};

// TODO: this is erroneously assuming a user only lists something once
exports.makeRemoveFromListHandler = function () {
    var handler = function (request, reply) {
        var itemKey = request.params.itemKey;
        var listKey = request.params.listKey;
        var userKey = request.auth.credentials.userid;
        var listType = request.params.listType;
        var modelNameTitle;

        // generate modelNameTitle by capitalizing itemType param
        if (listType === 'places') {
            modelNameTitle = 'Place';
        } else if (listType === 'groups') {
            modelNameTitle = 'Group';
        }

        // get this instance of list, item, and user
        async.parallel({
            list: function (done) {
                models.List.get(listKey, done);
            },
            item: function (done) {
                models[modelNameTitle].get(itemKey, done);
            },
            user: function (done) {
                models.User.get(userKey, done);
            }
        }, function (err, context) {
            if (err) { throw err; }

            // remove the user as a lister of the item
            context.item.removeForeign('listedBy', context.user, function (err) {
                if (err) { throw err; }
                // remove the item as a member of the list
                context.list.removeForeign(listType, context.item, function (err) {
                    if (err) { throw err; }
                    reply().code(200).redirect('/lists/' + context.user.slug + '/' + context.list.slug);
                });
            });
        });
    };
    return handler;
};

