var str = require('./str');

function Test(properties) {
  this._case = null;
  this._name = null;
  this._function = null;

  this._errors = [];

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = Test;

Test.create = function(testCase, name, fn) {
  if (arguments.length === 2) {
    fn = arguments[0];
    name = fn.name;
  }

  return new Test({
    _case: testCase,
    _name: name,
    _function: fn
  });
};

Test.prototype.execute = function() {
  try {
    var args = this._case.executeBefore(this);
    if (args && !(args instanceof Array)) {
      args = [args];
    }

    this._function.apply(this, args);
    this._case.executeAfter(this);
  } catch (error) {
    this._errors.push(error);

    var stack = this._simplifyStack(error.stack);
    this._case.printException(stack);
  }
};

Test.prototype._simplifyStack = function(stack) {
  var lines = stack.split('\n');

  for (var i = 1; i < lines.length; i++) {
    var line = lines[i];

    var isTestFunction = line.indexOf(__filename) > 0;
    if (isTestFunction) {
      break;
    }
  }

  stack = lines
    .slice(0, i)
    .join('\n');

  return stack;
};

Test.prototype.getErrorCount = function() {
  return this._errors.length;
};

Test.prototype.getName = function() {
  return this._name;
};
