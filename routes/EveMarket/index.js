require("./models");
require("./upload.js");
require("./liststats.js");
require("./viewall.js");


//Render Market Index
app.get("/market/", function(req, res) {
    res.render("./market/index.ejs");
});