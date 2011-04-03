var common = require('../../common');
var test = common.microtest.module(common.fixture + '/example/file.js');

var FS = test.requires('fs');

var File = test.compile();

return;

var File = test.compile();

test.before(function() {
  var file = new File();
  return [file];
});

test.describe('File.fromPath', function() {
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

test.describe('file.create', function() {

});
