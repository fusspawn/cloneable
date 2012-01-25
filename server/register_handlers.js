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
            market_api.get_order(redis_client, function(err, data) {
                if(err) {
                    res.render("fuck.ejs", {error_message: err});
                    return;
                }
                res.render("displayorder.ejs", {order: data, date: new Date().toString()});  
            });    
        });
        
        console.log("registered handlers");
};