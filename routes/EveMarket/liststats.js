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
            
                    for(var i in docs) {
                        docs[i].item_name = result[i];
                        if(docs[i].highest_buy == 0 || docs[i].lowest_sell == 0 || docs[i].lowest_sell == 99999999999 || docs[i].highest_buy == 0)
                            docs[i].profit = 0;
                        else {
                            docs[i].profit = docs[i].lowest_sell - docs[i].highest_buy;
                            if(docs[i].profit > 50000000) {
                                docs[i].profit = 0;
                                docs[i].item_name = docs[i].item + "(Customised - Order)";
                            }
                        }
                    }
                    res.render("./market/liststats.ejs", {stats: docs});
         });         
    });
});

console.log("registered /market/stats/view route");