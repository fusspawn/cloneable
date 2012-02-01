var $a = require("async");

app.get("/market/orders/view/all", function(req, res) {
    var model = mongoose.model("market_order");
    console.log("pulling all the mongo docs from the store <3");
    model.find({}, function (err, docs) { // We honestly dont need to render each item lols..
        console.log("query response");
        if(err) {
            console.log(err);
            res.send("something went wrong..");
            return;
        }
        
        $a.series(
            function() {
                console.log("redis lookup on all orderID's");
                $a.map(docs, function(item, callback) {
                    redis_client.get("ccp.static.type_ids."+item.typeID, function(err, response) {
                        callback(err, response);
                    });
                }, function(err, result) {
                    if(err) {console.log(err); return;}
                    for(i in docs) {
                        docs[i].real_name = result[i];
                    }
                });
            },
            function() {
                console.log("all the docs loaded aok. rendering");
                res.render("./market/showall.ejs", {orders: docs});
                console.log("page rendered.");     
            }
        );        
    });
});
