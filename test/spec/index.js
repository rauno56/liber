
var should = require('should');
var fix = require('../fixtures/');
var data = fix.json;
var Liber = require('../../lib/Liber.js')(fix.connection.use(fix.connection.TEST_DB_NAME));

describe('Liber', function () {
  before(function (done) {
    fix.tearDown(fix.setUp.bind(null, done));
  });

  it('should have promised api', function () {
    var methods = [
      'get',
      'getOne',
      'getFromView',
      'getOneFromView',
      'addViewGetter',
      'parse',
      'inherit'
    ];

    methods.forEach(function (classMethod) {
      Liber.should.have.property(classMethod);
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
