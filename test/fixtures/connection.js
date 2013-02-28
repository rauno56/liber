var connection = require('nano')('http://localhost:5984/');
connection.TEST_DB_NAME = 'test_liber';

// db.Liber = require('../db/Liber.js')(db);

exports = module.exports = connection;
