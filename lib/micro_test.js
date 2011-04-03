var oop = require('oop');
var fs = require('fs');
var vm = require('vm');
var path = require('path');
var Scene = require('fake/lib/scene');
var Test = require('./test');
var str = require('./str');

var noop = function() {};

function MicroTest() {
  this._path = null;
  this._source = null;
  this._context = {};

  this._tests = [];
  this._testStack = [];
  this._before = noop;
  this._after = noop;

  oop.mixin(this, Scene);
}
module.exports = MicroTest;

MicroTest._start = new Date;
MicroTest._cases = [];

MicroTest.register = function(microTest) {
  this._cases.push(microTest);
};

MicroTest._printReportAndExit = function() {
  var stats = this._getStats();

  // No tests executed? Bail out, the user probably just included this lib
  // by accident, but did not mean to run a test.
  if (stats.tests === 0) {
    return;
  }

  console.error(
    '%d error%s in %d test%s (took %d ms)',
    stats.errors,
    (stats.errors !== 1) ? 's' : '',
    stats.tests,
    (stats.tests !== 1) ? 's' : '',
    stats.duration
  );

  if (stats.errors > 0) {
    process.reallyExit(1);
  }
};
process.on('exit', MicroTest._printReportAndExit.bind(MicroTest));

MicroTest._getStats = function() {
  var stats = {
    cases: 0,
    tests: 0,
    errors: 0,
    duration: new Date - this._start,
  };

  this._cases.forEach(function(testCase) {
    stats.cases++;
    stats.tests += testCase.getTestCount();
    stats.errors += testCase.getErrorCount();
  });

  return stats;
};

MicroTest.fromFile = function(path) {
  var test = new this();

  this.register(test);
  test.load(path);

  return test;
};

MicroTest.prototype.load = function(path) {
  this._path = path;
  this._source = fs.readFileSync(path, 'utf-8');
};

MicroTest.prototype.compile = function() {
  return vm.runInNewContext(this._source, this._context, this._path);
};

MicroTest.prototype.before = function(fn) {
  this._before = fn;
};

MicroTest.prototype.after = function(fn) {
  this._after = fn;
};

MicroTest.prototype.executeBefore = function(test) {
  this._before.apply(this);
};

MicroTest.prototype.executeAfter = function(test) {
  this._after.apply(this);
};

MicroTest.prototype.describe = function(name, fn) {
  var test = Test.create(this, name, fn);

  this._tests.push(test);
  this._testStack.push(test);

  test.execute();

  this._testStack.pop();
};

MicroTest.prototype.getTestCount = function() {
  return this._tests.length;
};

MicroTest.prototype.getErrorCount = function() {
  var errors = 0;
  this._tests.forEach(function(test) {
    errors += test.getErrorCount();
  });
  return errors;
};

MicroTest.prototype.getDepth = function() {
  return this._testStack.length;
};

MicroTest.prototype.printException = function(stack) {
  var trail = [];
  this._testStack.forEach(function(test, i) {
    var name = test.getName();
    trail.unshift('"' + name + '"');
  });

  console.error(
    'Exception in test: %s:\n%s\n',
    trail.join(' <- '),
    str.indent(stack, '  ')
  );
};
