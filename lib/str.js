var str = exports;

str.repeat = function(string, times) {
  if (times === undefined) {
    times = 1;
  }

  var repeatedString = '';
  for (var i = 0; i < times; i++) {
    repeatedString += string;
  }

  return repeatedString;
};

str.indent = function(string, indent, times) {
  var lines = string.split('\n');
  indent = str.repeat(indent, times);

  return lines
    .map(function(line) {
      return indent + line;
    })
    .join('\n');
};
