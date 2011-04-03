function MicroTest(properties) {
  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = MicroTest;

MicroTest.fromFile = function() {
  var test = new MicroTest();
  return test;
};
