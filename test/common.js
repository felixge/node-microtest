var common = exports;
var path = require('path');

common.dir = {
  fixture: path.join(__dirname, 'fixture')
};
common.microtest = require('../lib');
