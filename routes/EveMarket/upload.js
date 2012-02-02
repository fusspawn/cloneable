var csv = require("ya-csv");
var market_order = mongoose.model("market_order");


//
app.post("/api/post/market", function(req, res) {
    console.log("got market upload request.");
    var csv_string = req.param("data", null);
    var csv_parser  = csv.createCsvStreamReader({ columnsFromHeader: true });
    
    csv_parser.addListener('data', function(data) {
        console.log("market csv item parsed.");
        
        market_order.findOne({orderID: data.orderID}, function(err, order) {
            if(order == null) {
                    var order = new market_order();
                    order.price  = data.price;
                    order.volRemaining = data.volRemaining;
                    order.typeID  = data.typeID;
                    order.range   = data.range;
                    order.orderID = data.orderID;
                    order.volEntered = data.volEntered;
                    order.minVolume = data.minVolume;
                    order.bid = data.bid;
                    order.issued  = data.issues;
                    order.duration = data.duration;
                    order.stationID  = data.stationID;
                    order.regionID = data.regionID;
                    order.solarSystemID  = data.solarSystemID = data.solarSystemID;
                    order.jumps  = data.jumps;
                    
                    console.log("saving.");
                    order.save(function(err) {
                        if(err) {
                            console.log(err);
                            res.send(err);
                            return;
                        }   
                        
                        console.log("Saved order, updating redis lastorders");
                        res.send("ok");
                        redis_client.publish("new_market_order", JSON.stringify({id: order._id}));
                    }); 
            } else {
                    order.price  = data.price;
                    order.volRemaining = data.volRemaining;
                    order.typeID  = data.typeID;
                    order.range   = data.range;
                    order.orderID = data.orderID;
                    order.volEntered = data.volEntered;
                    order.minVolume = data.minVolume;
                    order.bid = data.bid;
                    order.issued  = data.issues;
                    order.duration = data.duration;
                    order.stationID  = data.stationID;
                    order.regionID = data.regionID;
                    order.solarSystemID  = data.solarSystemID = data.solarSystemID;
                    order.jumps  = data.jumps;
                    
                    console.log("saving.");
                    order.save(function(err) {
                        if(err) {
                            console.log(err);
                            res.send(err);
                            return;
                        }   
                        
                        console.log("Saved order, updating redis lastorders");
                        res.send("ok");
                        redis_client.publish("new_market_order", JSON.stringify({id: order._id}));
                    });     
            }
        });
       
    });
    
    console.log("initing parser");
    csv_parser.parse(csv_string);
});
    
app.post("/api/post/markethistory", function(req, res) {
    var csv_string = req.param("data", null);       
});

function merge(obj, json) {
    obj.price  = json.price;
    obj.volRemaining = json.volRemaining;
    obj.typeID  = json.typeID;
    obj.range   = json.range;
    obj.orderID = json.orderID;
    obj.volEntered = json.volEntered;
    obj.minVolume = json.minVolume;
    obj.bid = json.bid;
    obj.issued  = json.issues;
    obj.duration = json.duration;
    obj.stationID  = json.stationID;
    obj.regionID = json.regionID;
    obj.solarSystemID  = json.solarSystemID = json.solarSystemID;
    obj.jumps  = json.jumps;
}