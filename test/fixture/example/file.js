var fs = require('fs');

function File() {
  this._fd = null;
}
module.exports = File;

File.fromPath = function(path) {
  var file = new File();
  file.open(path);
  return file;
};

File.prototype.open = function(path) {
  this._fd = fs.open(path);
};
