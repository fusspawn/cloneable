var $stats = mongoose.model("item_stat");
var $a = require("async");

app.get("/market/stats/view", function(req, res) {
    console.log("http_request: /market/stats/view");
    $stats.find({}, function(err, docs) {
         $a.map(docs, 
                function(item, callback) {
                    redis_client.get("ccp.static.type_ids."+item.typeID, function(err, response) {
                        callback(err, response);
                    });
                },function(err, result) {
                    if(err) {console.log(err); return;}
                    console.log("got reponse. Rendering page");
                    for(var i in docs) {
                        docs[i].item_name = result[i];
                        docs[i].profit = docs[i].lowest_sell - docs[i].highest_buy;
                    }
                    res.render("./market/liststats.ejs", {stats: docs});
         });         
    });
});

console.log("registered /market/stats/view route");