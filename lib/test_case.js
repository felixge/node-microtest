var oop = require('oop');
var fs = require('fs');
var vm = require('vm');
var path = require('path');
var Scene = require('fake/lib/scene');
var Test = require('./test');
var str = require('./str');

var noop = function() {};

function TestCase() {
  this._path = null;
  this._source = null;
  this._context = {};

  this._tests = [];
  this._testStack = [];
  this._before = noop;
  this._after = noop;

  oop.mixin(this, Scene);
}
module.exports = TestCase;

TestCase._start = new Date;
TestCase._cases = [];

TestCase.register = function(microTest) {
  this._cases.push(microTest);
};

TestCase._printReportAndExit = function() {
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
process.on('exit', TestCase._printReportAndExit.bind(TestCase));

TestCase._getStats = function() {
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

TestCase.fromFile = function(path) {
  var test = new this();

  this.register(test);
  test.load(path);

  return test;
};

TestCase.prototype.load = function(path) {
  this._path = path;
  this._source = fs.readFileSync(path, 'utf-8');
};

TestCase.prototype.compile = function() {
  return vm.runInNewContext(this._source, this._context, this._path);
};

TestCase.prototype.before = function(fn) {
  this._before = fn;
  return this;
};

TestCase.prototype.after = function(fn) {
  this._after = fn;
  return this;
};

TestCase.prototype.executeBefore = function(test) {
  return this._before.apply(this);
};

TestCase.prototype.executeAfter = function(test) {
  this._after.apply(this);

  this.verify();
  this.reset();
};

TestCase.prototype.describe = function(name, fn) {
  var test = Test.create(this, name, fn);

  this._tests.push(test);
  this._testStack.push(test);

  test.execute();

  this._testStack.pop();

  return this;
};

TestCase.prototype.getTestCount = function() {
  return this._tests.length;
};

TestCase.prototype.getErrorCount = function() {
  var errors = 0;
  this._tests.forEach(function(test) {
    errors += test.getErrorCount();
  });
  return errors;
};

TestCase.prototype.getDepth = function() {
  return this._testStack.length;
};

TestCase.prototype.printException = function(stack) {
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
