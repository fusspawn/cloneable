require("./models");
require("./upload.js");

app.get("/market/", function(req, res) {
    res.render("./market/index.ejs");
});