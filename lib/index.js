var ModuleTest = require('./module_test');

exports.module = function(file) {
  return ModuleTest.fromFile(file);
};
