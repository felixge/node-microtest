function Person(properties) {
  this.firstName = null;
  this.lastName = null;

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = Person;
