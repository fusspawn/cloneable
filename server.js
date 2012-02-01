var redis = require("redis");
var express = require("express");
var fs = require('fs');
env = JSON.parse(fs.readFileSync('/home/dotcloud/environment.json', 'utf-8'));

//Logging
var loggly = require('loggly');
var config = { subdomain: "fusspawn" };
var client = loggly.createClient(config);
var oldlogger = console.log;

console.log = function(message) {
    oldlogger(message);
    client.log(env['LOGGLY_HTTP_KEY'], message);
};


//Redis2
redis_client = redis.createClient(21390, "cloneable-fusspawn.dotcloud.com");
redis_client.auth(env["DOTCLOUD_REDISDB_REDIS_PASSWORD"]);

//Doc Store
mongoose = require("mongoose");
var mongoose_url = env["DOTCLOUD_MONGO_MONGODB_URL"] + "/admin"; //fuck this..
console.log("connecting Mongo to: " + mongoose_url);
mongoose.connect(mongoose_url, function(err) {
    if(err)
        console.log("mongoose connect failed: "+ err);
});

//Error Handling
var dcport = 8080;
redis_client.on("error", function (err) {
    console.log("error event - " + redis_client.host + ":" + redis_client.port + " - " + err);
});

process.on('uncaughtException', function (err) {
    console.log('(Debug):: Unhandled Exception: ' + err);
});


console.log("starting webserver");


//Setup
app = express.createServer();
app.listen(dcport);

app.configure(function() { 
    app.use(express.cookieParser());
    app.use(express.static(__dirname + '/static'));
    app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
});

console.log("server started"); 
require("./routes");        
console.log("server accepting connections");
