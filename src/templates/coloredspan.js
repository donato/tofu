module.exports = function(val) {
    var color = 'white';
    if (val > 0) {
        color = 'green'
    } else if (val < 0) {
        color = 'red';
    }
    return '<span style="color:'+color+'"> + ' + val + '</span>';
};
