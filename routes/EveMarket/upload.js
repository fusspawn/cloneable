var csv = require("ya-csv");
var market_order = mongoose.model("market_order");
var item_stats_collection = mongoose.model("item_stat");

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
                        update_stats(order._id);
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
                        console.log("handing new order");
                        update_stats(order._id);
                        console.log("new order handled");
                    });
            }
        });
       
    });
    
    console.log("initing parser");
    csv_parser.parse(csv_string);
    res.send("ok");
});
    
app.post("/api/post/markethistory", function(req, res) {
    var csv_string = req.param("data", null);       
});

function update_stats(orderID) {
    market_order.findById(orderID, function(err, order) {
        if(err) {console.log(err); return;}
        var type_id = order.typeID;
        console.log("doing a recalc on typeID: " + type_id);
        market_order.find({typeID: type_id}, function(err, docs) {
            if(err) {console.log(err); return;} 
            var buy_highest = 0;
            var sell_lowest = 99999999999;
            var buy_id;
            var sell_id;
            
            docs.forEach(function(doc) {
                if(doc.bid) {
                    if(doc.price > buy_highest) {
                        buy_highest = doc.price;
                        buy_id = doc._id;
                    }
                }
                else {
                    if(doc.price < sell_lowest) {
                        sell_lowest = doc.price;
                        sell_id = doc._id;
                    }
                }
            });
            
            
            item_stats_collection.findOne({typeID: type_id}, function(err, data) {
                if(data == null) {
                    var new_item_stat = new item_stats_collection();
                    new_item_stat.highest_buy = buy_highest;
                    new_item_stat.highest_buy_order_id = buy_id;
                    new_item_stat.lowest_sell = sell_lowest;
                    new_item_stat.lowest_sell_order_id = sell_id;
                    new_item_stat.save(function(err) { if(err) console.log(err); });
                    return;
                }
                    //Update
                    data.highest_buy = buy_highest;
                    data.highest_buy_order_id = buy_id;
                    data.lowest_sell = sell_lowest;
                    data.lowest_sell_order_id = sell_id;
                    data.save(function(err) { if(err) console.log(err); });
            });
        });
    });
};