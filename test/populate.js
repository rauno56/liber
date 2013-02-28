console.log("asd=00");
return ;
var nano = require('nano');
var db = require('./db');

var populateDesign = function () {
  db.insert({
    "_id": "_design/testing",
    "language": "javascript",
    "views": {
       "peopleByLastname": {
           "map": ["function(doc) {",
                      "if (doc.lastname) {",
                        "emit(doc.lastname.toLowerCase(), doc);",
                      "}",
                   "}"].join("")
       }
    }
  }, function (err, body) {
    if (err) console.log(err);
  });
};

var populatePeople = function () {
  var people = [{
    'firstname': 'Bob',
    'lastname': 'Truck',
    'age': 40
  },{
    'firstname': 'Alice',
    'lastname': 'Sky',
    'age': 29
  },{
    'firstname': 'Tina',
    'lastname': 'Sky',
    'age': 11
  },{
    'firstname': 'Mike',
    'lastname': 'Stone',
    'age': 34
  }];


  people.forEach(function (el) {
    el._id = (el.lastname+","+el.firstname).toLowerCase();
    db.insert(el, function (err, body) {
      if (err) console.log(err);
    });
  });
};

var deleteDb = function (cb) {
  var con = nano('http://localhost:5984/');
  con.db.destroy('test_orm', function (err, body) {
    err && console.log(err);
    con.db.create('test_orm', function(err, body) {
      if (!err) {
        console.log('database created!');
        cb();
      }
    });
  });
};

deleteDb(function () {
  populateDesign();
  populatePeople();
});



