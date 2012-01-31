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
        
        console.log("all the docs loaded aok. rendering");
        res.render("./market/showall.ejs", {orders: docs});
        console.log("page rendered.");
    });
});