var $stats = mongoose.model("item_stat");
var $a = require("async");

app.get("/market/stats/view", function(req, res) {
    $stats.find({}, function(err, docs) {
         if(!req.headers['HTTP_EVE_STATIONID'])
            res.send("please authorise this site and reload");
         
         var stationID = req.headers['HTTP_EVE_STATIONID'];
         $stats.find({station_id: stationID}, function(err, docs) {
             if(err) {
                console.log(err);
                res.send(err);
                return;
             }
             
             res.render("./market/liststats.ejs", {stats: docs});
         });
    });
});

console.log("registered /market/stats/view route");