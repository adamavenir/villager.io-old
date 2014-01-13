module.exports = function addKeyValue (db, reply, key, value, uri) {

    console.log('addKeyValue: ', key, value, uri);

    db.put(
      key, 
      value,
      function (err) {
          db.get(key, function (err, value) {
            console.log(key, value)
          })
        }
    );

    reply(key + JSON.stringify(value)).code(201).redirect(uri);

};