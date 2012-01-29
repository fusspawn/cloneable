var market_api = module.exports = {};
var csv = require("ya-csv");
var mongoose = require("mongoose");
mongoose.connect(env["DOTCLOUD_MONGO_MONGODB_URL"]);

market_api.db = {};
market_api.db.MarketOrderSchema = new mongoose.Schema({
    price           : Number,
    volRemaining    : Number,
    typeID          : Number,
    range           : Number,
    orderID         : Number,
    volEntered      : Number,
    minVolume       : Number, 
    bid             : Number,
    issued          : Date,
    duration        : Date,
    stationID       : Number,
    regionID        : Number,
    solarSystemID   : Number,
    jumps           : Number,
    
    /* These are extra properties, Not coming from the api (Static Data Lookups.) */
    typeName        : String,
    regionName      : String,
    stationName     : String,
});

market_api.db.MarketOrder = mongoose.Model("MarketOrder", market_api.db.MarketOrderSchema);

market_api.market_upload = function(data, redis_client) {
    var csv_parser  = csv.createCsvStreamReader({ columnsFromHeader: true });
    csv_parser.addListener('data', function(data) {
        redis_client.set("ccp.dynamic.market_order."+data.orderID, JSON.stringify(data)); //ccp.dynamic.market_order.2417444789
        var mongo_order = new mongoose.Model("Market Order"); 
        mongo_order.save(function(err) {
            if(err)
                console.log("Unable to Save MongoDB order");
            else {
                console.log("Saved to mongoDB"); 
            }
        });
        redis_client.incr("ccp.dynamic.market_order_history.count");
        console.log("we just saved orderID: " +data.orderID+ " to redis :D");
    });
    csv_parser.parse(data);
};

market_api.clear_all_data = function(redis, password) {
    redis.get("config.api.admin_password", function(err, rep) {
        if(err) { console.log("Unable to clear market Data: " + err); return; }
        if(password != rep) { console.log("unable to clear market data: Invalid Password"); return; }
        market_api.get_known_orders(redis, function(err, data) {
            data.forEach(function(order_key) {
                console.log("Deleting: "+ order_key);
                redis.del(order_key);
            });
        });
    });  
};

market_api.market_history_upload = function(data, redis_client) {
    var csv_parser  = csv.createCsvStreamReader({ columnsFromHeader: true });
    csv_parser.addListener('data', function(data) {
        redis_client.set("ccp.dynamic.market_order_history."+data.orderID, JSON.stringify(data)); //ccp.dynamic.market_order.2417444789
        redis_client.incr("ccp.dynamic.market_order.count");
        console.log("we just saved orderID: " +data.orderID+ " to redis :D");
    }); 
    csv_parser.parse(data);
};

market_api.get_order = function(orderid, redis_client, callback) {
    redis_client.get("ccp.dynamic.market_order."+orderid, function(err, reply) {
        if(err) {
            console.log("unable to find order_id: "+orderid);
            callback("unable to find order_id: "+orderid, null);
        }
        
        callback(null, JSON.parse(reply));
    });
};

market_api.get_known_orders = function(redis_client, callback) {
    redis_client.keys("ccp.dynamic.market_order.*", function(err, reply) {
        if(err) {
            console.log("err: unable to list orders: " + err);
            callback("err: unable to list orders: " + err, null);
        }
        callback(null, reply);
    });
};


market_api.get_name = function(redis_client, typeID, callback) {
    redis_client.get("ccp.static.type_ids."+typeID, function(err, reply) {
        redis_client.set("ccp.static.type_names."+reply, typeID); //link hax
        callback(err, reply);    
    });
};