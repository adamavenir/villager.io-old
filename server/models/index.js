
var User = new require('./User');
var List = new require('./List');
var Place = new require('./Place');
var Group = new require('./Group');
var Event = new require('./Event');
var EventSeries = new require('./EventSeries');
var ListCategory = new require('./categories/ListCategory');
var PlaceCategory = new require('./categories/PlaceCategory');
var GroupCategory = new require('./categories/GroupCategory');
var EventCategory = new require('./categories/EventCategory');
var LogEvent = new require('./LogEvent');

var models = {
    User: User,
    List: List,
    Place: Place,
    Group: Group,
    Event: Event,
    EventSeries: EventSeries,
    ListCategory: ListCategory,
    PlaceCategory: PlaceCategory,
    GroupCategory: GroupCategory,
    EventCategory: EventCategory,
    LogEvent: LogEvent
};

function attachDB(db) {
    models.User.options.db = db;
    models.List.options.db = db;    
    models.Place.options.db = db;
    models.Group.options.db = db;
    models.Event.options.db = db;
    models.EventSeries.options.db = db;
    models.ListCategory.options.db = db;    
    models.PlaceCategory.options.db = db;
    models.GroupCategory.options.db = db;
    models.EventCategory.options.db = db;
    models.LogEvent.options.db = db;
}

module.exports = {
    models: models,
    attachDB: attachDB
};