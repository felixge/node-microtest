var str = exports;

str.indent = function(string, indent, times) {
  if (times === undefined) {
    times = 1;
  }

  var lines = string.split('\n');
  var fullIndent = '';
  for (var i = 0; i < times; i++) {
    fullIndent += indent;
  }

  return lines
    .map(function(line) {
      return fullIndent + line;
    })
    .join('\n');
};
