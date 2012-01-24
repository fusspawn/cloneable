var handlers = module.exports = {};

handlers.register_handlers = function(app, redis_client)
{
        app.post("/api/post/markethistory", function(req, res) {
            console.log("history hit with: " + req.param("data", "empty"));
            res.end("History Hit");
        });
    
        app.post("/api/post/market", function(req, res) {
            console.log("market hit with: "  + req.param("data", "empty"));
            res.end("Market Hit");
        });
};