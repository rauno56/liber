var should = require('should');
var shouldBehaveAsDoc = require('./testSingleResultMethod');

exports = module.exports = function (Doc) {

  describe('#getFromView', function () {

    before(function (done) {
      var me = this;
      Doc.getFromView('testing', 'peopleByLastname', {include_docs: true}, function (err, res) {
        should.not.exist(err);

        me.results = res;
        me.res = res[0];
        done();
      });
    });

    it('should behave using include_docs', function () {
      this.res.should.have.property('firstname');
      this.res.should.have.property('age');
    });

    it('should be array', function () {
      this.results.should.be.an.instanceOf(Array);
      this.results.should.have.property('length');
      this.results.length.should.be.above(0);
    });

    shouldBehaveAsDoc(Doc);

  });
};
