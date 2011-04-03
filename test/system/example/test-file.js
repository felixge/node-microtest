var common = require('../../common');
var test = common.microtest.module(common.fixture + '/example/file.js');
var assert = require('assert');

test.requires('fs');
test.injects('File');

var File = test.compile();

test.describe('File.fromPath', function() {
  test.recompileWithInjections(File, 'fromPath');

  var PATH = test.value('path');
  var FILE = test.object('File');

  test.expectNext('new', test.injected.File, null, FILE)
  test.expectNext(FILE, 'open', [PATH])

  var file = File.fromPath(PATH);
  assert.strictEqual(file, FILE);
});

test.before(function() {
  return new File();
});

test.describe('file.open', function(file) {
  var PATH = test.value('path');
  var FD = test.value('fd');

  test.expectNext(test.required.fs, 'open', [PATH], FD)

  file.open(PATH);

  assert.strictEqual(file._fd, FD);
});
