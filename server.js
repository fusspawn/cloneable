var http = require('http');
var redis = require("redis");
var express = require("express");
var utils = require("util");
var session_store = require("connect-redis");

var fs = require('fs');
var env = JSON.parse(fs.readFileSync('/home/dotcloud/environment.json', 'utf-8'));

var redis_client = redis.createClient(21390, "cloneable-fusspawn.dotcloud.com");
console.log(utils.inspect(env));
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
    app.use(express.session({
        secret: "S3ssIons_are_aw3s0mely_fast_1n_r3d1s",
        store: new redis_session_store({client: redis_client})
    }));
    
    app.use(express.static(__dirname + '/static'));
    app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
});

console.log("server started"); 


app.post("/api/post/market-history", function(req,res) {
    console.log("history hit..");
});
app.post("/api/post/market", function(req, res) {
    console.log("market hit..");
});

