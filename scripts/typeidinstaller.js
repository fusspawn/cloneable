var script = module.exports = {};
var fs = require("fs");
var lazy = require("lazy");

script.run = function(req, res, redis_client) {
    console.log("file loading: " + "../tmp_data/typeids.txt");
    new lazy(fs.createReadStream('../tmp_data/typeids.txt'))
             .lines
             .forEach(function(line){
                    line = line.replace(/\s+/g," ");
                    var parts = line.split(" ");
                    var id = parts[0];
                    res.write("saving: " + id);
             }
    );
};