var common = require('../common');
var tracy = common.tracy;
var assert = common.assert;

function myFunction() {
  var error = new Error('User error');
  tracy.simplify(error);

  var lines = error.stack.split('\n');
  assert.equal(lines.length, 2);
  assert.ok(lines[0].match(/User error/i));
  assert.ok(lines[1].match(/myFunction/i));
}

myFunction();
