var models = {
    Log: require('./Log'),
    User: require('./User'),
    Place: require('./Place'),
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