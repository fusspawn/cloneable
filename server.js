var redis = require("redis");
express = require("express");
fs = require('fs');
env = JSON.parse(fs.readFileSync('/home/dotcloud/environment.json', 'utf-8'));
var redis_client = redis.createClient(21390, "cloneable-fusspawn.dotcloud.com");
redis_client.auth(env["DOTCLOUD_REDISDB_REDIS_PASSWORD"]);

mongoose = require("mongoose");
//mongoose.connect(env["DOTCLOUD_MONGO_MONGODB_URL"]);


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
//require("./server/register_handlers.js").register_handlers(app, redis_client);
require("./routes");        
console.log("server accepting connections");
