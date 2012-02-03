require("./models");
require("./upload.js");
require("./viewall.js");
new_order_handler = require("./new_order_handler.js");

app.get("/market/", function(req, res) {
    res.render("./market/index.ejs");
});