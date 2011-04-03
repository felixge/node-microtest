var common = require('../../common');
var test = common.microtest.module(common.fixture + '/file.js');

console.log(test);

return;

var test = new Microtest();
var context = test.context;
var scene = test.scene;

context.module = {};
context.File = scene.class();
test.load('file.js');

var File = context.module.exports;

test.classMethod(function fromPath() {
  File.fromPath = test.compileInContext(File.fromPath);

  var PATH = scene.dummy('path');
  var FILE = scene.dummy('file');

  scene
    .expectNext('new', context.File)
    .andReturn(FILE);

  scene
    .expectNext(FILE, 'open')
    .withArgs(PATH);

  var file = File.fromPath(PATH);
  assert.strictEqual(file, FILE);
});
