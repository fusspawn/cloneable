var script = module.exports = {};
var fs = require("fs");
var lazy = require("lazy");

script.run = function(req, res, redis_client) 
{
    console.log("file loading: " + "../tmp_data/typeids.txt");
    
    var ll = new lazy(fs.createReadStream('../tmp_data/typeids.txt'))
    ll.lines.forEach(function(line){
                 var parts = line.split(/\s\s*/g);
                 var id = parts.shift();
                 var name = parts.join(" ");
                 redis_client.set("ccp.static.type_ids."+id, name);
                 res.write("saving: " + id);
    });
};