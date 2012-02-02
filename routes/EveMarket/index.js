require("./models");
require("./upload.js");
require("./viewall.js");
require("./new_order_handler.js");

app.get("/market/", function(req, res) {
    res.render("./market/index.ejs");
});