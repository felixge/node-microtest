var common = require('../../common');
var test = common.microtest.module(common.fixture + '/example/file.js');
var assert = require('assert');

var FS = test.requires('fs');

var File = test.compile();

test.before(function() {
  var file = new File();
  return file;
});

test.describe('file.open', function(file) {
  var PATH = test.value('path');
  var FD = test.value('fd');

  test
    .expectNext(FS, 'open')
    .withArgs(PATH)
    .andReturn(FD);

  file.open(PATH);

  assert.strictEqual(file._fd, FD);
});
