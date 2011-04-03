function Trace(properties) {
  Array.call(this);

  this.stack = null;

  for (var property in properties) {
    this[property] = properties[property];
  }
}
Trace.prototype = Array.prototype;
module.exports = Trace;

Trace.create = function(belowFn) {
  var dummyObject = {};
  Error.captureStackTrace(dummyObject, belowFn || Trace.getTrace);

  var v8Handler = Error.prepareStackTrace;
  Error.prepareStackTrace = function(dummyObject, v8StackTrace) {
    return v8StackTrace;
  };

  var v8StackTrace = dummyObject.stack;
  Error.prepareStackTrace = v8Handler;

  var trace = new Trace();
  trace.push.apply(trace, v8StackTrace);

  var dummyObject2 = {};
  Error.captureStackTrace(dummyObject2, belowFn || Trace.getTrace);
  trace.stack = dummyObject2.stack
    .split('\n')
    .slice(1)
    .join('\n')
    .replace(/^\s+ at /mg, '');

  return trace;
};

Trace.prototype.inspect = function() {
  return this.stack;
};
