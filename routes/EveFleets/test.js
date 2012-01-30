app.get("/ships/admin/new", function(req, res) {
    console.log("/ships/admin/new request received");
    res.render("ship/create.ejs", {error_message: null, success_message: null});
});

app.post("/ships/admin/create_new", function(req, res) {    
    var Ship = new mongoose.model("ShipBase");
    Ship.ship_name = req.param("ship_name", "NameNotFound");
    Ship.save(function(err) {
        if(err) {
            console.log(err);
            res.render("ship/create.ejs", {error_message: err, success_message: null});
            return;
        }    
        
        console.log("saved new shipbase to mongo");
        res.render("ship/create.ejs", {error_message: null, success_message: "Awesome, Saved!"});
    });
});