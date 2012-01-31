var csv = require("ya-csv");
var mongoose = require("mongoose");

app.post("/api/post/market", function(req, res) {
    console.log("got market upload request");
    var csv_string = req.param("data", null);
    var csv_parser  = csv.createCsvStreamReader({ columnsFromHeader: true });
    csv_parser.addListener('data', function(data) {
        console.log("market csv item parsed");
        var order = new mongoose.model("market_order");
        merge(order, data);
        console.log("merged item to mongoose model");
        console.log("saving");
        order.save(function(err) {
            if(err) {
                console.log(err);
                res.send(err);
                return;
            }   
            
            console.log("Saved order");
            res.send("ok");
        }); //
    });
    
    console.log("initing parser");
    csv_parser.parse(csv_string);
});
    
app.post("/api/post/markethistory", function(req, res) {
    var csv_string = req.param("data", null);       
});

function merge(obj, json) {
    for (var i in json) {
        if(obj.hasOwnProperty(i))
            obj[i] = json[i];
    }
}