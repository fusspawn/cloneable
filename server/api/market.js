var market_api = module.exports = {};
var csv = require("ya-csv");


market_api.market_upload = function(data, redis_client) {
    var csv_parser  = csv.createCsvFileReader({ columnsFromHeader: true });
    csv_parser.addListener('data', function(data) {
        redis_client.set("ccp.dynamic.market_order."+data.orderID, JSON.stringify(data));
        console.log("we just saved orderID: " +data.orderID+ " to redis :D");
    });
    csv_parser.parse(data);
};



market_api.market_history_upload = function(data, redis_client) {};