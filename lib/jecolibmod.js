const fs = require('fs');
eval(fs.readFileSync(__dirname + '/Jecolib.js').toString())
var jecomod = new Jecolib();
module.exports = jecomod;

