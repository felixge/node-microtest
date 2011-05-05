var common = require('../common');
var assert = common.assert;
var test = common.microtest.module(common.dir.fixture + '/mysql_client.js');

test.requires('util');
test.requires('events', [{class: 'EventEmitter'}]);
test.requires('./query', {class: 'Query'});
test.requires('net', [{class: 'Stream'}]);
test.requires('./parser', {class: 'Parser'});

var inheritsCall = test.stub(test.required.util, 'inherits');
var Client = test.compile();

test.describe('inherits from EventEmitter', function() {
  var args = inheritsCall.getLastArgs();
  assert.strictEqual(args[0], Client);
  assert.strictEqual(args[1], test.required.EventEmitter);
});

test.before(function() {
  test.stub(test.required.EventEmitter);
  return new Client();
});

test.describe('Client#connect', function(client) {
  var CONNECTION = test.object('connection');
  var PARSER = test.object('parser');
  var CB_PARAM = test.object('cb');

  var _enqueueCall = test
    .expect(client, '_enqueue')
    .withArg(2, CB_PARAM);

  client.connect(CB_PARAM);

  var connectClosure = _enqueueCall.getLastArgs()[0];

  test.expect('new', test.required.Stream, null, CONNECTION);
  test.expect('new', test.required.Parser, null, PARSER);

  test.expect(CONNECTION, 'on', 3).andReturn(CONNECTION);
  test.expect(CONNECTION, 'connect');

  test.expect(PARSER, 'on', 1).andReturn(CONNECTION);

  connectClosure();
});
