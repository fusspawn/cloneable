app.get("/ships/admin/new", function(req, res) {
    console.log("/ships/admin/new request received");
    res.render("ship/create");
});