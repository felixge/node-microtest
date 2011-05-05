var oop = require('oop');
var fs = require('fs');
var vm = require('vm');
var str = require('./str');
var path = require('path');
var Fake = require('fake');
var Test = require('./test');
var str = require('./str');

var noop = function() {};

function TestCase() {
  this._path = null;
  this._source = null;
  this._compiled = null;

  this._tests = [];
  this._testStack = [];
  this._before = noop;
  this._after = noop;

  this.context = {};
  this.injected = {};

  oop.mixin(this, Fake);
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
  try {
    this._source = fs.readFileSync(path, 'utf-8');
  } catch (e) {
    throw new Error('File not found: ' + this._path);
  }
};

TestCase.prototype.compile = function() {
  this._compiled = vm.runInNewContext(this._source, this.context, this._path);
  this.verify();
  this.reset();
  return this._compiled;
};

TestCase.prototype._guessLine = function(source) {
  // This function tries to locate the line of a given piece of source code
  // within our file. So far it seems like the heuristics here work great, but
  // in the worst case line number reportings for recompileWithInjections may
  // not be accurate.

  var offset = this._source.indexOf(source);
  if (offset === -1) {
    // If we don't find our source as is, lets try to remove the space after
    // the first function definition. That seems to be the only thing v8 messes
    // with when doing a Function.toString() call.
    source = source.replace(/(function) \(/, '$1(');
    offset = this._source.indexOf(source);
  }

  if (offset === -1) {
    return 0;
  }

  var line = this._source
    .substr(0, offset)
    .split('\n')
    .length;

  return line - 1;
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
};

TestCase.prototype.injects = function(globalVariable) {
  var value = this.class(globalVariable);
  this.context[globalVariable] = value;
  this.injected[globalVariable] = value;
};

TestCase.prototype.describe = function(name, fn) {
  var test = Test.create(this, name, fn);

  this._tests.push(test);
  this._testStack.push(test);

  test.execute();

  this._testStack.pop();

  this.reset();

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
    trail.push('"' + name + '"');
  });

  console.error(
    'Exception in test: %s:\n\n%s\n',
    trail.join(' -> '),
    str.indent(stack, '  ')
  );
};
