function File() {
  this._fd = null;
}
module.exports = File;

File.fromFd = function(fd) {
  var file = new File();
  file._fd = fd;
  return fd;
}

File.fromPath = function(path) {
  var file = new File();
  file.open(path);
  return file;
};

File.prototype.open = function(path) {
  this._fd = fs.open(path);
};
