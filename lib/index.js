var ModuleTestCase = require('./module_test_case');

exports.module = function(file) {
  return ModuleTestCase.fromFile(file);
};
