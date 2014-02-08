// exports.Event = require('./Event');
// exports.Group = require('./Group');
var models = {
  Person: require('./Person'),
  Place: require('./Place'),
  User: require('./User'),
  Group: requore('./Group')
};

function attachDB(db) {
  Object.keys(models).forEach(function (modelname) {
    models[modelname].options.db = db;
  });
}
// exports.Project = require('./Project');

module.exports = {
  models: models,
  attachDB: attachDB
};