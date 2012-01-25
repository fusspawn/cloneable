var market_api = module.exports = {};
var csv = require("ya-csv");


market_api.market_upload = function(data, redis_client) {
    var csv_parser  = csv.createCsvStreamReader({ columnsFromHeader: true });
    csv_parser.addListener('data', function(data) {
        redis_client.set("ccp.dynamic.market_order."+data.orderID, JSON.stringify(data)); //ccp.dynamic.market_order.2417444789
        console.log("we just saved orderID: " +data.orderID+ " to redis :D");
    });
    
    csv_parser.parse(data);
};



market_api.market_history_upload = function(data, redis_client) {
    var csv_parser  = csv.createCsvStreamReader({ columnsFromHeader: true });
    csv_parser.addListener('data', function(data) {
        redis_client.set("ccp.dynamic.market_order_history."+data.orderID, JSON.stringify(data)); //ccp.dynamic.market_order.2417444789
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
        callback(err, reply);    
    });
};