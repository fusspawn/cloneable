var $a = require("async");

app.get("/market/orders/view/all", function(req, res) {
    var model = mongoose.model("market_order");
    model.find({}, function (err, docs) { // We honestly dont need to render each item lols..
        console.log("query response");
        if(err) {
            console.log(err);
            res.send("something went wrong..");
            return;
        }
       console.log("redis lookup on all orderID's");
                $a.map(docs,
                function(item, callback) {
                    redis_client.get("ccp.static.type_ids."+item.typeID, function(err, response) {
                        callback(err, response);
                    });
                }, 
                function(err, result) {
                    if(err) {console.log(err); return;}
                    for(var i in docs) {
                        docs[i].item_name = result[i];
                    }
                    res.render("./market/showall.ejs", {orders: docs});
         });      
    });
});
