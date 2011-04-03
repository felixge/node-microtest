var oop = require('oop');
var TestCase = require('./test_case');

function ModuleTestCase(properties) {
  TestCase.call(this);

  this.required = {};

  for (var property in properties) {
    this[property] = properties[property];
  }
}
oop.extend(ModuleTestCase, TestCase);
module.exports = ModuleTestCase;

ModuleTestCase.prototype.compile = function() {
  this._fakeModuleSystem();
  TestCase.prototype.compile.call(this);
  return this.getExports();
};

ModuleTestCase.prototype.getExports = function() {
  return this._context.module.exports;
};

ModuleTestCase.prototype._fakeModuleSystem = function() {
  var context = this._context;
  var exports = {};

  context.exports = exports;
  context.module = {exports: exports};
  this.fakeFunction(context, 'require', 'require');

  // Make the console available for convenience
  context.console = console;
};

ModuleTestCase.prototype.requires = function(path, name) {
  name = name || path;

  var value = this.class(name);
  this.required[name] = value;

  this
    .expectAnytime(this._context, 'require')
    .withArgs(path)
    .andReturn(value);

  return value;
};
