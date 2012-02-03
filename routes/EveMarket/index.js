require("./models");
new_order_handler = require("./new_order_handler.js");
require("./upload.js");
require("./viewall.js");

//Render Market Index
app.get("/market/", function(req, res) {
    res.render("./market/index.ejs");
});