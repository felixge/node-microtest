var Trace = require('./trace');

exports.simplify = function(error) {
  var stack = error.stack;
  stack = stack.split('\n');

  var i = stack.length;
  while (i--) {
    var line = stack[i];
    var isUserLand = !!line.match(/\(\/.+\)$/);
    var isModuleClosure = isUserLand && !!line.match(/at Object\.<anonymous>/);

    if (isUserLand && !isModuleClosure) {
      break;
    }

    stack.pop();
  }

  error.stack = stack.join('\n');
};

exports.getTrace = function(belowFn) {
  return Trace.create(belowFn || exports.getTrace);
};
