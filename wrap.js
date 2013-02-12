// Print args:
var args = process.argv.slice(2);
console.log('args: ', args);

// Try to load library?
wrapper = require('./wrapper.js');
_ = require('./node_modules/underscore/underscore-min.js');

fs = require('fs');

_.each(args, function(arg) {
    fs.readFile(arg, function(err,data) {
        if(err) {
            return console.log(err);
        } else {
            var output = wrapper.wrapText(data.toString(), 78);
            fs.writeFile(arg + ".wrapped", output, function(err) {
                console.log(err);
            });
        }
    });
});