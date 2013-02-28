var should = require('should');
var data = require('../fixtures').data;
var TEST_ON_ID = 'audi';
var TEST_ON_PROP = 'year';

var find = function (arr, prop, val) {
  if (arguments.length == 1) {
    val = arr;
    prop = '_id';
    arr = data;
  }
  return arr.filter(function (el) { return el[prop] == val; }).pop();
};

exports = module.exports = function (Doc, method) {

  before(function (done) {
    var me = this;
    Doc[method](TEST_ON_ID, {}, function (err, res) {
      should.not.exist(err);
      should.exist(res);
      me.res = res;
      done();
    });
  });

  it('result should get the right data', function () {
    var thing = find(TEST_ON_ID);
    res.should.have.property(TEST_ON_PROP, thing[TEST_ON_PROP]);
  });

  it('result should be of correct class', function () {
    this.res.should.be.an.instanceOf(Doc);
  });


  // describe('should save itself ...', function () {
  //   before(function (done) {
  //     var me = this;
  //     this.oldRev = this.res._rev;
  //     this.res.save(function (err, res) {
  //       me.saveRes = res;
  //       done();
  //     });
  //   });

  //   it('... and still have the same _id', function () {
  //     this.saveRes.should.have.property('_id', this.res._id);
  //   });
  //   it('... and have new _rev', function () {
  //     this.saveRes.should.have.property('_rev');
  //     (this.oldRev == this.saveRes._rev).should.be.false;
  //   });
  //   it('... have the saved property', function () {
  //     this.saveRes.should.have.property('someUndefinedProperty', 42);
  //   });

  //   after(function () {
  //     this.res = this.saveRes;
  //   });
  // });

  after(function () {
    delete this.res;
  });
};
