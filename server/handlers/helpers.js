var config = require('getconfig');
var _ = require('underscore');
var models = require('../models').models;
var async = require('async');

var itemReply, listReply;

exports.itemReply = itemReply = function (itemType, item, session, thismod, iStarred, categories) {
    var replyData, gmapsApi;
    thismod = !!thismod;
    iStarred = !!iStarred;

    if (itemType === 'place') {
        gmapsApi = config.api.googleMaps;
    } else { gmapsApi = null; }

    if (typeof session === 'undefined') { 
        replyData = {
            item      : item,
            thismod   : thismod,
            iStarred  : iStarred
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
                    if (thisItem.creator.key === session.userid && thisItem.approved === false) {
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