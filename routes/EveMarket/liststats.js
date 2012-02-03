var $stats = mongoose.model("market_stat");
var $a = require("async");

app.get("/market/view/stats", function(req, res) {
    $stats.find({}, function(err, docs) {
         $a.map(docs, 
                function(item, callback) {
                    redis_client.get("ccp.static.type_ids."+item.typeID, function(err, response) {
                        callback(err, response);
                    });
                },function(err, result) {
                    if(err) {console.log(err); return;}
                    for(var i in docs) {
                        docs[i].item_name = result[i];
                    }
                    res.render("./market/liststats.ejs", {stats: docs});
         });         
    });
});