var models = {
  Person: require('./Person'),
  Place: require('./Place'),
  User: require('./User'),
  Group: require('./Group')
};

function attachDB(db) {
  Object.keys(models).forEach(function (modelname) {
    models[modelname].options.db = db;
  });
};

module.exports = {
  models: models,
  attachDB: attachDB
};