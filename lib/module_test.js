var oop = require('oop');
var MicroTest = require('./micro_test');

function ModuleTest(properties) {
  MicroTest.call(this);

  for (var property in properties) {
    this[property] = properties[property];
  }
}
oop.extend(ModuleTest, MicroTest);
module.exports = ModuleTest;

ModuleTest.prototype.compile = function() {
  this._fakeModuleSystem();
  MicroTest.prototype.compile.call(this);
  return this.getExports();
};

ModuleTest.prototype.getExports = function() {
  return this._context.module.exports;
};

ModuleTest.prototype._fakeModuleSystem = function() {
  var context = this._context;
  var exports = {};

  context.exports = exports;
  context.module = {exports: exports};
  this.fakeFunction(context, 'require', 'require');
};

ModuleTest.prototype.requires = function(path, name) {
  var exports = this.class(name || path);

  this
    .expectAnytime(this._context, 'require')
    .withArgs(path)
    .andReturn(exports);

  return exports;
};
