var LogEvent = new require('./LogEvent');
var User = new require('./User');
var Place = new require('./Place');
var Group = new require('./Group');
var Event = new require('./Event');
var EventSeries = new require('./EventSeries');
var GroupCategory = new require('./GroupCategory');
var PlaceCategory = new require('./PlaceCategory');
var EventCategory = new require('./EventCategory');
var List = new require('./List');

var models = {
    User: User,
    LogEvent: LogEvent,
    Place: Place,
    Group: Group,
    Event: Event,
    EventSeries: EventSeries,
    EventCategory: EventCategory,
    GroupCategory: GroupCategory,
    PlaceCategory: PlaceCategory,
    List: List
};

function attachDB(db) {
    models.User.options.db = db;
    models.LogEvent.options.db = db;
    models.Place.options.db = db;
    models.Group.options.db = db;
    models.Event.options.db = db;
    models.EventSeries.options.db = db;
    models.GroupCategory.options.db = db;
    models.PlaceCategory.options.db = db;
    models.EventCategory.options.db = db;
    models.List.options.db = db;
}

module.exports = {
    models: models,
    attachDB: attachDB
};