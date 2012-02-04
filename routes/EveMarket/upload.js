var csv = require("ya-csv");
var market_order = mongoose.model("market_order");
var item_stats_collection = mongoose.model("item_stat");

//
app.post("/api/post/market", function(req, res) {
    var csv_string = req.param("data", null);
    var csv_parser  = csv.createCsvStreamReader({ columnsFromHeader: true });
    var updated_id = null;
    var station_id = null;
    
    csv_parser.addListener('data', function(data) {
        if (updated_id == null) {
            updated_id = data.typeID;
            station_id = data.stationID;
            setTimeout(function() {
                update_stats_alt(updated_id, station_id);
            }, 5000);console.log("reindex on type: "+ updated_id + " set for 5 seconds");
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
    
    csv_parser.parse(csv_string);
    res.send("ok");
});
    
app.post("/api/post/markethistory", function(req, res) {
    var csv_string = req.param("data", null);       
});


function update_stats_alt(typeID, stationID) {
    market_order.find({typeID: typeID, stationID: stationID},
        function(err, docs) {
              if(err) { console.log(err); return; }
              if(docs == null) { console.log("nothing found aborting.."); return; }
              
              var lowest_sell_found = null;
              var highest_buy_found = null;
              var lowest_sell_order = null;
              var highest_buy_order = null;
              
              docs.forEach(function(doc) {
                    if(doc.bid) {
                        if(highest_buy_found == null) {
                            highest_buy_found = doc.price;
                            highest_buy_order = doc;
                        }
                        if(doc.price > highest_buy_found) {
                            highest_buy_found = doc.price;
                            highest_buy_order = doc;
                        }
                    }
                    else {
                        if(lowest_sell_found == null) {
                            lowest_sell_found = doc.price;
                            lowest_sell_order = doc;
                        }
                        if(doc.price < lowest_sell_found) {
                            lowest_sell_found = doc.price;
                            lowest_sell_order = doc;
                        }
                    }
              });
              
              // Now we have the highest buy price. and the lowest sell price. lets calculate the profit.
              if(lowest_sell_found == null
                    || highest_buy_found == null) {
                    console.log("could calculate profit for typeID as onesided order");
                    return;
              }
              
              var profit_per_unit = lowest_sell_found - highest_buy_found;
              redis_client.get("ccp.static.type_ids."+typeID, function(err, type_name) {
                    if(err) { console.log(err); return; }
                    item_stats_collection.findOne({typeID: typeID, station_id: stationID}, function(err, doc) {
                        if(err) { console.log(err); return; }
                        if(doc == null) {
                            var item_stat = new item_stats_collection();
                            item_stat.typeID = typeID;
                            item_stat.highest_buy = highest_buy_found ;
                            item_stat.highest_buy_order_id = highest_buy_order._id;
                            item_stat.lowest_sell = lowest_sell_found;
                            item_stat.lowest_sell_order_id = lowest_sell_order._id;
                            item_stat.profit = profit_per_unit;
                            item_stat.station_id = stationID;
                            item_stat.item_name = type_name;
                            item_stat.save(function(err) {
                                if(err) { console.log(err); return; }
                                console.log("new profitable item: " + type_name + " profit: " + profit_per_unit);
                            });
                        } else {
                            doc.typeID = typeID;
                            doc.highest_buy = highest_buy_found ;
                            doc.highest_buy_order_id = highest_buy_order._id;
                            doc.lowest_sell = lowest_sell_found;
                            doc.lowest_sell_order_id = lowest_sell_order._id;
                            doc.profit = profit_per_unit;
                            doc.station_id = stationID;
                            doc.item_name = type_name;
                            doc.save(function(err) {
                                if(err) { console.log(err); return; }
                                console.log("new profitable item: " + type_name + " profit: " + profit_per_unit);
                            });    
                        }
                    });
              });
    });
}