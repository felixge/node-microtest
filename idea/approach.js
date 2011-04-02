var test = require('microtest').module('file.js');

var ASSEMBLY = test.requires('./assembly', 'Assembly');
var EVENT_EMITTER = test.requires('events', 'EventEmitter', true);

var File = test.compile();

test.before(function() {
  var file = new File();
  return [file];
});

test('File.fromPath', function() {
  File.fromPath = test.compileInContext(File.fromPath);

  var PATH = scene.dummy('path');
  var FILE = scene.dummy('file');

  test
    .expectNext('new', context.File)
    .andReturn(FILE);

  test
    .expectNext(File)
    .withArgs(PATH);

  var file = File.fromPath(PATH);
  assert.strictEqual(file, FILE);
});

test('file.create', function() {

});
