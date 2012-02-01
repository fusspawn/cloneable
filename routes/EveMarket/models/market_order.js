mongoose.model("market_order", new mongoose.Schema({
    price           : Number,
    volRemaining    : Number,
    typeID          : {type: Number,
                        get: function(typeID) {
                             console.log("doing redis_lookup on: "+typeID);
                             redis_client.get("ccp.static.type_ids."+typeID, function(err, reply) { 
                                if(err) return typeID;
                                console.log("did redis_lookup on: "+typeID + " returned: "+reply);
                                return reply;
                             });
                        }
                      },
    range           : Number,
    orderID         : Number,
    volEntered      : Number,
    minVolume       : Number, 
    bid             : Boolean,
    issued          : Date,
    duration        : Date,
    stationID       : Number,
    regionID        : Number,
    solarSystemID   : Number,
    jumps           : Number,
}));

console.log("loaded market_order model in mongoose");