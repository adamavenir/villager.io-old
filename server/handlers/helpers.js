exports.itemReply = function (itemType, item, session, thismod, iStarred) {
    var replyData;
    thismod = !!thismod;
    iStarred = !!iStarred;

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
            iStarred  : iStarred
        };
    }
    return replyData;
};


exports.listReply = function (itemType, items, mine, session) {
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