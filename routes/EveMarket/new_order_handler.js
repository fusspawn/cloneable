var $a = require("async");
var orders_collection = mongoose.model("market_order");
var item_stats_collection = mongoose.model("item_stat");

redis_client.on("subscribe", function(channel, message) {
    console.log("got pub/sub on " + channel);
    if(!(channel == "new_market_order"))
        return;
        
    console.log("handling a " + channel + " update");
    
    var orderID = JSON.parse(message).id;
    orders_collection.findById(orderID, function(err, order) {
        if(err) {console.log(err); return;}
        var type_id = order.typeID;
        console.log("doing a recalc on typeID: " + type_id);
        orders_collection.find({typeID: type_id}, function(err, docs) {
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
                    console.log(err); // CreateNew
                    return;
                    
                    var new_item_stat = new item_stats_collection();
                    new_item_stat.highest_buy = buy_highest;
                    new_item_stat.highest_buy_order_id = buy_id;
                    new_item_stat.lowest_sell = sell_lowest;
                    new_item_stat.lowest_sell_order_id = sell_id;
                    new_item_stat.save(function(err) { if(err) console.log(err); });
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
});