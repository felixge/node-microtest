var test = require('microtest')();

test.dependency('./foo/bar');
test.dependency('./foo/bar');
test.load('/path/to/fake_function.js');




var fake = require('fake');
var sandbox = fake.sandbox();

var module = {};
sandbox.setLocals({
  require: function() {},
  module: module,
});

sandbox.compile('/Library/WebServer/Documents/node-fake/lib/fake/fake_function.js');

var FakeFunction = module.exports;
var createSource = 'return (' + FakeFunction.create.toString() + ')';

var sandbox2 = fake.sandbox();
sandbox2.setLocals({
  FakeFunction: function() {
    console.log('injected');
  },
});
sandbox2.setSource(createSource);
var compiled = sandbox2.compile();

console.log(compiled());

//var test = require('microtest')();
//var scene = test.scene();

//test.load();


//test.method(function() {



//});
