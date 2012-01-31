var csv = require("ya-csv");

app.post("/api/post/market", function(req, res) {
    var csv_string = req.param("data", null);
    var csv_parser  = csv.createCsvStreamReader({ columnsFromHeader: true });
    csv_parser.addListener('data', function(data) {
        var order = new mongoose.model("market_order");
        merge(order, data);
        order.save(function(err) {
            if(err) {
                console.log(err);
                res.send(err);
                return;
            }   
            
            console.log("Saved order");
            res.send("ok");
        });
    });
    
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