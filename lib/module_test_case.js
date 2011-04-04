var oop = require('oop');
var path = require('path');
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
  return this.context.module.exports;
};

ModuleTestCase.prototype._fakeModuleSystem = function() {
  var context = this.context;
  if (context.require) {
    return;
  }

  var exports = {};

  context.global = context;
  context.exports = exports;
  context.module = {exports: exports};

  context.require = this.function('require');

  // Inject a few selected "real" things for convenience
  context.console = console;
  context.__filename = this._path;
  context.__dirname = path.dirname(this._path);
};

ModuleTestCase.prototype.requires = function(path, name) {
  // Handle this signature: ['path', ['events', 'EventEmitter'], './str']
  if (path instanceof Array) {
    path.forEach(function(args) {
      this.requires.apply(this, [].concat(args));
    }.bind(this));
    return;
  }

  this._fakeModuleSystem();

  name = name || path;

  var value = this.class(name);
  this.required[name] = value;

  this
    .expectAnytime(this.context.require)
    .withArgs(path)
    .andReturn(value);
};
