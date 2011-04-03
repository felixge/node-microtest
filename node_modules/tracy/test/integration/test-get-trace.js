var common = require('../common');
var tracy = common.tracy;
var assert = common.assert;

function foo() {
  var trace = tracy.getTrace();
  var fn = trace[0].getFunction();

  assert.strictEqual(fn, foo);
};
foo();
