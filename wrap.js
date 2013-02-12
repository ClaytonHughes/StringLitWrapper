var args = process.argv.slice(2);

// Try to load library?
wrapper = require('./wrapper.js');
_ = require('./node_modules/underscore/underscore-min.js');
fs = require('fs');

_.each(args, function(arg) {
    fs.readFile(arg, function(err,data) {
        if(err) {
            console.log("Error Reading "+arg +" : " + err);
        } else {
            console.log("Wrapping " + arg + " -> " + arg + ".wrapped");
            var output = wrapper.wrapText(data.toString(), 78);
            fs.writeFile(arg + ".wrapped", output, function(err) {
                if(err) { console.log("Error Writing "+arg + " : " + err); }
            });
        }
    });
});