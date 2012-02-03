require("./models");
require("./upload.js");
require("./viewall.js");
require("./liststats.js");

//Render Market Index
app.get("/market/", function(req, res) {
    res.render("./market/index.ejs");
});