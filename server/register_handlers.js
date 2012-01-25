var handlers = module.exports = {};
var market_api = require("./api/market.js");

handlers.register_handlers = function(app, redis_client)
{
        app.set('view options', {
          layout: false
        });

        app.post("/api/post/markethistory", function(req, res) {
            market_api.market_history_upload(req.param("data", null), redis_client);
            res.end("History Hit");
        });
    
        app.post("/api/post/market", function(req, res) {
            market_api.market_upload(req.param("data", null), redis_client);
            res.end("Market Hit");
        });
        
        
        app.get("/market/display_known", function(req, res) {
            market_api.get_known_orders(redis_client, function(err, data) {
                if(err) {
                    res.render("fuck.ejs", {error_message: err});
                    return;
                }
                res.render("knownorders.ejs", {orders: data, date: new Date().toString()});  //  
            });
        });
        
        app.get("/market/display_order", function(req, res) {
            var orderID = req.param("orderID", 0);
            market_api.get_order(orderID, redis_client, function(err, order_data) {
                if(err) {
                    res.render("fuck.ejs", {error_message: err});
                    return;
                }
                
                market_api.get_name(redis_client, order_data.typeID, function(err, data) {
                    res.render("displayorder.ejs", {order: order_data, date: new Date().toString(), name: data, layout: true});  
                });
            });    
        });
        
        console.log("registered handlers");
};