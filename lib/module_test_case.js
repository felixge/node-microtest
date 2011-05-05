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

  this.stub(context, 'require', Infinity, function(path) {
    return this.required[path] = this.object(path);
  }.bind(this));

  // Inject a few selected "real" things for convenience
  context.console = console;
  context.__filename = this._path;
  context.__dirname = path.dirname(this._path);
};

ModuleTestCase.prototype.requires = function(path, objects) {
  this._fakeModuleSystem();

  var multipleObjects = objects instanceof Array;
  objects = [].concat(objects || {});
  var exports = {};

  objects.forEach(function(object) {
    object.name = object.name || object.class || path;

    var value = (object.class)
      ? this.class(object.name)
      : this.object(object.name);

    if (multipleObjects) {
      exports[object.name] = value;
    } else {
      exports = value;
    }

    this.required[object.name] = value;
  }.bind(this));

  this.stub(this.context, 'require')
    .withArgs(path)
    .andReturn(exports);
};
