var User = new require('./User');
var List = new require('./List');
var Place = new require('./Place');
var Group = new require('./Group');
var Event = new require('./Event');
var Activity = new require('./Activity');
var EventSeries = new require('./EventSeries');
var ActivityCategory = new require('./categories/ActivityCategory');
var PlaceCategory = new require('./categories/PlaceCategory');
var GroupCategory = new require('./categories/GroupCategory');
var EventCategory = new require('./categories/EventCategory');
var LogEvent = new require('./LogEvent');

var models = {
    User: User,
    List: List,
    Place: Place,
    Group: Group,
    Activity: Activity,
    Event: Event,
    EventSeries: EventSeries,
    PlaceCategory: PlaceCategory,
    GroupCategory: GroupCategory,
    EventCategory: EventCategory,
    ActivityCategory: ActivityCategory,
    LogEvent: LogEvent
};

function attachDB(db) {
    models.User.options.db = db;
    models.List.options.db = db;    
    models.Place.options.db = db;
    models.Group.options.db = db;
    models.Event.options.db = db;
    models.Activity.options.db = db;
    models.EventSeries.options.db = db;   
    models.PlaceCategory.options.db = db;
    models.GroupCategory.options.db = db;
    models.EventCategory.options.db = db;
    models.ActivityCategory.options.db = db;
    models.LogEvent.options.db = db;
}

module.exports = {
    models: models,
    attachDB: attachDB
};