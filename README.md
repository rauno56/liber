liber
=====
`Liber` makes using CouchDB not only easier to build but also shemaless. It is built on [nano][nano] and inspired by [AngularJS-Resource][angular].
Principles:
* **Minimalistic**: Keep functions you would be using(view generation etc.) once out of this one. CouchDB's api is simple - do them using [nano][nano].
* **Shemaless**: NoSQL is shemaless why should a driver differ.
* **Expectedness**: Don't try to squeeze features of a RDBMS out of CouchDB, ergo don't generate anything automatically in the background. Be in control and know whats happening.

## Installation
`Liber` is nothing but a extended api for [nano][nano] so for using it you also need the latter - it's good to have anyways working with CouchDB:

`npm install liber nano`

## Getting started
to set liber up
``` js
var nano = require('nano')('http://localhost:5984/mydatabase');
var Liber = require('liber')(db); //alias for document
```
now... live a simpler life
``` js
Liber.getOne('bobs_id', function (err, bob) {
  bob.age++;
  bob.save(function (err, newBob) {
    //newBob == bob;
  });
});
```

##Inheritance
``` js
function User(data) {
  this.superClass.call(this, data); // to give more flexibility
                                    // to construction process
  this.kind = 'user';
  this.fullName = this.lastName + ', ' + this.firstName;
}

User = Liber.inherit(User, {
  changePassword: function () { ... }
}, {
  'viewShortCuts': {
    'byLastName': ['myDesignDoc', 'usersByLastName']
  }
});

User.get('anId', cb);
/*
  get by id
  Note: Liber doesn't validate the kind or type so you could
  fetch an User from any other Liber class.
*/

User.getByLastName('Smith', cb);
// get user from an generated view getter. Result is an array.

User.getOneByLastName('Smith', cb);
// same as the last one but result is User object.

```

##API: Class methods

###Liber.inherit(constructor, prototype, options)
###Liber.parse(data)
###Liber.get(params, callback)
###Liber.getOne(id, [params, callback])
###Liber.getFromView(design, view, params, callback)
###Liber.getOneFromView(design, view, params, callback)

##API: Instance methods

###Doc.save(callback)
###Doc.insert(callback)
###Doc.destroy(callback)

##API: Options

###View shortcuts: `viewShortcuts`
Generates methods to access views. Needs array of parameters to concat to the 
beginning of parameters of method calls.
Let's say User class declaration has a options of:
``` js
{
  'viewShortcuts': {
    'fromMyDesign': ['myDesignDoc'],
    'byLastName': ['myDesignDoc', 'usersByLastName'],
    'admins': ['myDesignDoc', 'usersByStatus', 'admin']
  }
}
```
then
``` js
User.getOneFromMyDesign('usersByAddress', 'broad way');
// == User.getOneFromView('myDesignDoc', 'usersByAddress', 'broad way');

User.getByLastName('smith');
// == User.getFromView('myDesignDoc', 'usersByLastName', 'smith');

User.getAdmins();
// == User.getFromView('myDesignDoc', 'usersByStatus', 'admin');
```
Although linguistically a bit off, the `getOneAdmins` would limit latter to first 
match. The shortcuts are very cheap to make so you could fix that by duplicating 
'admins' with an 'admin' so you'll have both `get(One)Admin` and `get(One)Admins`.



[npm]: http://npmjs.org
[nano]: http://github.com/dscape/nano
[angular]: http://angularjs.org
