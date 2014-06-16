var Log   = new require('./Log');
var User  = new require('./User');
var Place = new require('./Place');
var Group = new require('./Group');

var models = {
    User:   User,
    Log:    Log,
    Place:  Place,
    Group:  Group
};

function attachDB(db) {
    models.User.options.db = db;
    models.Log.options.db = db;
    models.Place.options.db = db;
    models.Group.options.db = db;
};

module.exports = {
    models: models,
    attachDB: attachDB
};