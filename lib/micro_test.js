var oop = require('oop');
var fs = require('fs');
var vm = require('vm');
var Scene = require('fake/lib/scene');

function MicroTest() {
  this._path = null;
  this._source = null;
  this._context = {};

  oop.mixin(this, Scene);
}
module.exports = MicroTest;

MicroTest.fromFile = function(path) {
  var test = new this();
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

MicroTest.prototype.describe = function() {

};
