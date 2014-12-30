var config = require('getconfig');
var _ = require('underscore');
var models = require('../models').models;
var async = require('async');

var itemReply, listReply;

var getForm = function (request, modelName, create, next) {
    var formMap, form;
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
            name    : form.name,
            email   : form.email,
            phone   : form.phone,
            date    : form.date,
            time    : form.time,
            image   : form.image,
            website : form.website,
            about   : form.about
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
            slug      : session.slug,
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

exports.listReply = listReply = function (itemType, items, session, mine) {
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
                    reply.view('items/noItems', listReply(modelName, null, session));
                }
                // reply with approved and mine
                else {
                    reply.view('items/listItems', listReply(modelName, approved, session, mine));
                }
            }
            else {
                // if there are no approved items
                if (approved.length === 0) {
                    reply.view('items/noItems', listReply(modelName, null));
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

                // console.log(JSON.stringify(item, null, 2));

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
                if (modelName === 'list') {
                    reply().code(201).redirect('/' + modelNamePlural + '/' + session.slug + '/' + item.slug);
                } else {
                    reply().code(200).redirect('/' + modelNamePlural + '/' + item.slug);
                }
                
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

            // console.log('myLists', JSON.stringify(context.myLists[0], null, 2));

            var lists = _.where(context.myLists[0], { type: request.params.listType });

            // console.log('lists', JSON.stringify(lists, null, 2));

            reply.view('list/selectList', {
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

        // console.log(itemType);

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

            // console.log('context.list', JSON.stringify(context.list, null, 2));
            console.log('itemType', listType)
            console.log('context.list[itemType]', context.list[listType])

            // item.get √, item.fkfield.push(newthing), item.save

            // update item: add list to the item
            context.item.onLists.push(context.list);

            // update item: add the user as a lister of the item
            context.item.listedBy.push(context.user);

            // update list: add the item as a member of the list
            context.list[listType].push(context.item);

            console.log('updated context.list', JSON.stringify(context.list, null, 2));
            console.log('updated context.item', JSON.stringify(context.item, null, 2));

            async.parallel({
                // save the item
                saveItem: function (done) {
                    console.log('saving item', JSON.stringify(context.item, null, 2));
                    context.item.save(done);
                },
                // save the list
                saveList: function (done) {
                    console.log('saving list', JSON.stringify(context.list, null, 2));
                    context.list.save(done);
                }

            }, function (err, result) {
                reply().code(200).redirect('/lists/' + context.user.slug + '/' + context.list.slug);
            });
        });
    }
    return handler;
};

// TODO: this is erroneously assuming a user only lists something once
exports.makeRemoveFromListHandler = function () {
    var handler = function (request, reply) {
        var session = request.auth.credentials;
        var modelNameTitle;

        if (request.params.listType === 'places') {
            modelNameTitle = 'Place';
        } else if (request.params.listType === 'groups') {
            modelNameTitle = 'Group';
        }

        // get this instance of list, item, and user
        async.parallel({
            list: function (done) {
                models.List.get(request.params.listKey, done);
            },
            item: function (done) {
                models[modelNameTitle].get(request.params.itemKey, done);
            },
            user: function (done) {
                models.User.get(session.userid, done);
            }
        }, function (err, context) {
            if (err) { throw err; }

            async.parallel([
                // remove the item as a member of the list
                list.removeForeign(type, context.item, done),

                // remove the list to the item
                item.removeForeign('onLists', context.list, done),

                // remove the user as a lister of the item
                item.removeForeign('listedBy', context.user, done)
            ], function (list, item) {
                reply.code(200).redirect('/lists/' + context.user.slug + '/' + context.list.slug);
            });
        });
    }
    return handler;
};

