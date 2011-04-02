var Fruit = require('./fruit');

function Tree() {
  this._fruits = [];
}
module.exports = Tree;

Tree.prototype.addFruit = function() {
  var fruit = new Fruit();

  this._fruits.push(fruit);

  return fruit;
};
