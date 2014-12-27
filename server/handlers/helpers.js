exports.itemReply = function (itemType, item, session, thismod, iStarred) {
    var replyData;
    if (thismod === undefined) { thismod = false; }
    if (iStarred === undefined) { iStarred = false; }

    if (session.userid === undefined) { 
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
    if (mine === undefined) { mine = false; }

    if (session.userid === undefined) { 
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