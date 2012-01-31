require("./models");
require("./upload.js");
require("./viewall.js");

app.get("/market/", function(req, res) {
    res.render("./market/index.ejs");
});