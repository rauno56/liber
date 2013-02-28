var fs = require('fs');
var path = require('path');
var async = require('async');
var connection = require('./connection.js');
var data = JSON.parse(fs.readFileSync(path.join(__dirname, 'database.json'), 'utf8'));
module.exports = exports = {
  data: data,
  setUp: function (cb) {
    var docs = data;
    if (docs && docs.length) {
      connection.db.create(connection.TEST_DB_NAME, function () {
        var db = connection.use(connection.TEST_DB_NAME);

        async.forEach(docs, function (doc, done) {
          db.insert(doc, function (err, body) {
            var a = err ? done(err) : done();
          });
        }, function (err, body) {
          if (err) { console.log(err); }
          else { console.log("Set up."); }
          cb && cb();
        });
      });
    } else {
      throw new Error('Data of the test db could not be read.');
    }
  },
  tearDown: function (cb) {
    connection.db.destroy(connection.TEST_DB_NAME, function (err, body) {
      if (err) { console.log(err); }
      else { console.log("Teared down."); }
      cb && cb();
    });
  },
  connection: connection
};
