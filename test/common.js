var common = exports;
var path = require('path');

common.dir = {
  fixture: path.join(__dirname, 'fixture')
};

common.assert = require('assert');
common.microtest = require('../lib');
