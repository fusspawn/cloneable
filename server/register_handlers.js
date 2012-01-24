var handlers = module.exports = {};
var market_api = require("./api/market.js");

handlers.register_handlers = function(app, redis_client)
{
        app.post("/api/post/markethistory", function(req, res) {
            console.log("history hit with: " + req.param("data", "empty"));
            market_api.market_history_upload(req.param("data", null), redis_client);
            res.end("History Hit");
        });
    
        app.post("/api/post/market", function(req, res) {
            console.log("market hit with: "  + req.param("data", "empty"));
            market_api.market_upload(req.param("data", null), redis_client);
            res.end("Market Hit");
        });
        
        console.log("registered handlers");
};