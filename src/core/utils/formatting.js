
function coloredSpan(val) {
  var color = 'white';
  var operator = '+';
  if (val > 0) {
      color = 'green'
      operator = '+';
  } else if (val < 0) {
      color = 'red';
      operator = '-';
  }
  return '<span style="color:'+color+'">' + operator + ' ' +
      addCommas(Math.abs(val)) + '</span>';
};


module.exports = {
  coloredSpan
}