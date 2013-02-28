
exports = module.exports = function (Doc) {
  describe('#parse and delete', function () {
    before(function () {
      var data = {
        firstname: 'your',
        lastname: 'mom',
        age: '35'
      };
      var res = this.res = Doc.parse(data);
    });
    
    it('should produce Doc', function () {
      this.res.constructor.name.should.eql('Doc');
    });

    describe('#save', function () {
      it('should save and give new doc', function (done) {
        this.res.save(done);
      });
      it('should have _id', function () {
        this.res.should.have.property('_id');
      });
      it('should have _rev', function () {
        this.res.should.have.property('_rev');
      });
      it('should have saved properties', function () {
        this.res.should.have.property('lastname', 'mom');
      });
    });

    after(function () {
      delete this.res;
    });
  });
};
