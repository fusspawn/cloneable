var script = module.exports = {};
var fs = require("fs");
var lazy = require("lazy");

script.run = function(req, res, redis_client) 
{
    console.log("file loading: " + "../tmp_data/typeids.txt");
    var ll = new lazy(fs.createReadStream('./scripts/regionids.txt'))
    ll.lines.forEach(function(line){
                 var parts = line.toString().split(/\s\s*/g);
                 var id = parts.shift();
                 var name = parts.join(" ");
                 redis_client.set("ccp.static.region_ids."+id, name); //ccp.static.type_ids.32415
                 res.write("saving: " + id + " with name: "+ name);
    }); 
};