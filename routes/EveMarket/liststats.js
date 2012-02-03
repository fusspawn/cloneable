var $stats = mongoose.model("item_stat");
var $a = require("async");

app.get("/market/stats/view", function(req, res) {
    $stats.find({}, function(err, docs) {
         $a.map(docs, 
                function(item, callback) {
                    redis_client.get("ccp.static.type_ids."+item.typeID, function(err, response) {
                        callback(err, response);
                    });
                },function(err, result) {
                    if(err) {console.log(err); return;}
                    docs.sort(function(a, b) {
                        if(a.price < b.price) 
                            return -1;
                        if(a.price > b.price)
                            return 1;
                        
                        return 0;
                    });
                    for(var i in docs) {
                        docs[i].item_name = result[i];
                        if(docs[i].highest_buy == 0 || docs[i].lowest_sell == 0)
                            docs[i].profit = 0;
                        else {
                            docs[i].profit = docs[i].lowest_sell - docs[i].highest_buy;
                        }
                    }
                    res.render("./market/liststats.ejs", {stats: docs});
         });         
    });
});

console.log("registered /market/stats/view route");