describe('Groove', function() {

  it('should instantiate', function() {
    expect(function() {
      new Groove('test');
    }).to.not.throw(TypeError)
  });

  describe('Groove.createNode', function() {
    it('creates a node successfully without an src', function() {
      var groove = new Groove(),
          node;
      expect(function() {
        node = groove.createNode();
      }).to.not.throw(TypeError);

      // expect(groove.createNode('test.wav').src).to.match(/test/);
    });

    it('loads an external sound file when instantiated with a src url', function() {
      var groove = new Groove(),
          node = groove.createNode('base/lib/test.wav');
    });

    it('returns a promise when instantiated with an src', function() {

    });
  });

});