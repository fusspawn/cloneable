var redis = require("redis");
var express = require("express");
var fs = require('fs');
var env = JSON.parse(fs.readFileSync('/home/dotcloud/environment.json', 'utf-8'));
var redis_client = redis.createClient(21390, "cloneable-fusspawn.dotcloud.com");
redis_client.auth(env["DOTCLOUD_REDISDB_REDIS_PASSWORD"]);


var dcport = 8080;

redis_client.on("error", function (err) {
    console.log("error event - " + redis_client.host + ":" + redis_client.port + " - " + err);
});

process.on('uncaughtException', function (err) {
    console.log('(Debug):: Unhandled Exception: ' + err);
});

console.log("starting webserver");
var app = express.createServer();
app.listen(dcport);

app.configure(function() { 
    app.use(express.cookieParser());
    app.use(express.static(__dirname + '/static'));
    app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
});

console.log("server started"); 

var last_hist = "";
app.get("/api/post/markethistory/last", function(req, res) {
    res.send(last_hist);
});
app.post("/api/post/markethistory", function(req, res) {
    last_hist = req.param("data", "empty");
    console.log("history hit with: " + req.param("data", "empty"));
    res.end("History Hit");
});

var last_market = "";
app.get("/api/post/market/last", function(req, res) {
    res.send(last_market);
});
app.post("/api/post/market", function(req, res) {
    last_market = req.param("data", "empty");
    console.log("market hit with: "  + req.param("data", "empty"));
    res.end("Market Hit");
});

console.log("server accepting connections");

