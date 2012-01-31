var mongoose = require("mongoose");
app.get("market/orders/view/all", function(req, res) {
    var model = mongoose.model("market_order");
    model.find({}, function (err, docs) {
        if(err) {
            console.log(err);
            res.send("something went wrong..");
            return;
        }
        
        res.render("./market/showall.ejs", {orders: docs});
    });
});