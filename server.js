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
console.log("server started"); 

app.get("/", function(req,res) {
    redis_client.incr("test.pagecounts.index", function(err, val) {
        console.log("loaded :" +val+" times.");    
        res.end("loaded :" +val+" times.");
    });    
});

app.get("/deploy/log", function(req, res) {
    
});