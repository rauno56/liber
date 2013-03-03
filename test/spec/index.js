
var should = require('should');
var fix = require('../fixtures/');
var data = fix.json;
var Liber = require('../../lib/Liber.js')(fix.connection.use(fix.connection.TEST_DB_NAME));

describe('Liber', function () {
  before(function (done) {
    fix.tearDown(fix.setUp.bind(null, done));
  });

  it('should have promised api', function () {
    var classMethods = [
      'get',
      'getOne',
      'getFromView',
      'getOneFromView',
      'addViewGetter',
      'parse',
      'inherit'
    ];

    var instanceMethods = [
      'save',
      'insert',
      'destroy',
      'parse'
    ];

    var instance = new Liber();
    instanceMethods.forEach(function (method) {
      instance.should.have.property(method);
    });

    classMethods.forEach(function (method) {
      Liber.should.have.property(method);
    });

  });

  describe('#getOne', function () {
    require('./testSingleResultMethod')(Liber, 'getOne');
  });

  // require('./parse')(Liber);

  // require('./getOne')(Liber);

  // require('./getOneFromView')(Liber);

  // require('./getFromView')(Liber);
});
