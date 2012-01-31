var mongoose = require("mongoose");
app.get("/market/orders/view/all", function(req, res) {
    var model = mongoose.model("market_order");
    console.log("pulling all the mongo docs from the store <3");
    var query = model.find({});
    console.log("exec'ed find all query");
    query.limit(25);
    console.log("limit to 25 items");
    
    console.log(query);
    console.log("exec query");
    
    query.exec( function (err, docs) {
        console.log("query response");
        if(err) {
            console.log(err);
            res.send("something went wrong..");
            return;
        }
        
        console.log("all the docs loaded aok. rendering");
        res.render("./market/showall.ejs", {orders: docs});
        console.log("page rendered.");
    );
});