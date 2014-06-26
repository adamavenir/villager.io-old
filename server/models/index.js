var Log   = new require('./Log');
var User  = new require('./User');
var Place = new require('./Place');
var Group = new require('./Group');
var Interest = new require('./Interest');
var GroupCategory = new require('./GroupCategory');
var PlaceCategory = new require('./PlaceCategory');

var models = {
    User:   User,
    Log:    Log,
    Place:  Place,
    Group:  Group,
    Interest: Interest,
    GroupCategory: GroupCategory,
    PlaceCategory: PlaceCategory
};

function attachDB(db) {
    models.User.options.db = db;
    models.Log.options.db = db;
    models.Place.options.db = db;
    models.Group.options.db = db;
    models.GroupCategory.options.db = db;
    models.Interest.options.db = db;
    models.PlaceCategory.options.db = db;
}

module.exports = {
    models: models,
    attachDB: attachDB
};