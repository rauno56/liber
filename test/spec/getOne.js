var should = require('should');
var shouldBeLibre = require('./testSingleResultMethod');

exports = module.exports = function (Doc) {
  describe('#getOne', function () {

    before(function (done) {
      var me = this;
      Doc.getOne('audi', {}, function (err, res) {
        should.not.exist(err);
        should.exist(res);
        should.exist(res.year);
        me.res = res;
        done();
      });
    });

    shouldBeLibre(Doc);

  });
};
