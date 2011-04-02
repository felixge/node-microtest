var test = require('microtest')();

var MODULE = test.inject('module');
var FRUIT = test.expect('require', './fruit');
test.load('file.js');

test.before(function() {
  return new MODULE.exports();
});

test.define(function addFruit(tree) {
  var FRUIT = {any: 'object'};
  scene
    .expectNext('new', FRUIT_CLASS)
    .andReturn(FRUIT);

  scene
    .expectNext(tree._fruits, 'push')
    .withArgs(FRUIT);

  var fruit = tree.addFruit();
  assert.strictEqual(fruit, FRUIT);
});
