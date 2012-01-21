var http = require('http');
var redis = require("redis");
var express = require("express");

var redis_client = redis.createClient(21390, "cloneable-fusspawn.dotcloud.com");
redis_client.auth("LBWVNB7ZupLQQ6lChTFJ");

var c9port = process.env.PORT;
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
console.log("server started"); 

app.get("/", function(req,res) {
    res.end("frackit.");    
});