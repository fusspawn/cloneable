var csv = require("ya-csv");
var market_order = mongoose.model("market_order");
var item_stats_collection = mongoose.model("item_stat");

//
app.post("/api/post/market", function(req, res) {
    console.log("got market upload request.");
    var csv_string = req.param("data", null);
    var csv_parser  = csv.createCsvStreamReader({ columnsFromHeader: true });
    var updated_id = null;
    
    csv_parser.addListener('data', function(data) {
        if (updated_id == null) {
            updated_id = data.typeID;
            setTimeout(function() {
                update_stats(updated_id);
            }, 5000);
            console.log("reindex on type: "+ updated_id + " set for 5 seconds");
        }
        
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
                    console.log("data.bid was: "+ data.bid);
                    if(data.bid == "True")
                        order.bid = true;
                    else
                        order.bid = false;
                        
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
                    }); 
            } else {
                    order.price  = data.price;
                    order.volRemaining = data.volRemaining;
                    order.typeID  = data.typeID;
                    order.range   = data.range;
                    order.orderID = data.orderID;
                    order.volEntered = data.volEntered;
                    order.minVolume = data.minVolume;
                    if(data.bid == "True")
                        order.bid = true;
                    else
                        order.bid = false;
                    order.issued  = data.issues;
                    order.duration = data.duration;
                    order.stationID  = data.stationID;
                    order.regionID = data.regionID;
                    order.solarSystemID  = data.solarSystemID = data.solarSystemID;
                    order.jumps  = data.jumps;
                    order.save(function(err) {
                        if(err) {
                            console.log(err);
                            res.send(err);
                            return;
                        }  
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

function update_stats(type_id) {
    console.log("update started in the background");
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
                    new_item_stat.typeID = type_id;
                    new_item_stat.highest_buy = buy_highest;
                    new_item_stat.highest_buy_order_id = buy_id;
                    new_item_stat.lowest_sell = sell_lowest;
                    new_item_stat.lowest_sell_order_id = sell_id;
                    new_item_stat.save(function(err) { if(err) console.log(err); });
                    return;
                }
                    //Update
                    data.typeID = type_id;
                    data.highest_buy = buy_highest;
                    data.highest_buy_order_id = buy_id;
                    data.lowest_sell = sell_lowest;
                    data.lowest_sell_order_id = sell_id;
                    data.save(function(err) { if(err) console.log(err); });
            });
        });
};