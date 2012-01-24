var handlers = module.exports = {};
var market_api = require("./api/market.js");

handlers.register_handlers = function(app, redis_client)
{
        app.post("/api/post/markethistory", function(req, res) {
            market_api.market_history_upload(req.param("data", null), redis_client);
            res.end("History Hit");
        });
    
        app.post("/api/post/market", function(req, res) {
            market_api.market_upload(req.param("data", null), redis_client);
            res.end("Market Hit");
        });
        
        
        app.get("/market/display_known", function(req, res) {
            market_api.get_known_orders(function(err, data) {
                res.send(JSON.stringify(data));    
            });
        });
        
        console.log("registered handlers");
};