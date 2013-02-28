var should = require('should');
var shouldBehaveAsDoc = require('./testSingleResult');

exports = module.exports = function (Doc) {
  
  describe('#getOneFromView', function () {

    before(function (done) {
      var me = this;
      Doc.getOneFromView('testing', 'peopleByLastname', {}, function (err, res) {
        should.not.exist(err);
        me.res = res;
        done();
      });
    });

    shouldBehaveAsDoc(Doc);

  });
};
