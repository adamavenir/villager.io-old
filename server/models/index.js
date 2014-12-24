var LogEvent = new require('./LogEvent');
var User = new require('./User');
var Place = new require('./Place');
var Group = new require('./Group');
var Interest = new require('./Interest');
var GroupCategory = new require('./GroupCategory');
var PlaceCategory = new require('./PlaceCategory');
var List = new require('./List');

var models = {
    User: User,
    LogEvent: LogEvent,
    Place: Place,
    Group: Group,
    Interest: Interest,
    GroupCategory: GroupCategory,
    PlaceCategory: PlaceCategory,
    List: List
};

function attachDB(db) {
    models.User.options.db = db;
    models.LogEvent.options.db = db;
    models.Place.options.db = db;
    models.Group.options.db = db;
    models.GroupCategory.options.db = db;
    models.Interest.options.db = db;
    models.PlaceCategory.options.db = db;
    models.List.options.db = db;
}

module.exports = {
    models: models,
    attachDB: attachDB
};