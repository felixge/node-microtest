var oop = require('oop');
var MicroTest = require('./micro_test');

function ModuleTest(properties) {
  for (var property in properties) {
    this[property] = properties[property];
  }
}
oop.extend(ModuleTest, MicroTest);
module.exports = ModuleTest;
