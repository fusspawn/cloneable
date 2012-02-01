mongoose.model("market_order", new mongoose.Schema({
    price           : Number,
    volRemaining    : Number,
    typeID          : {type:Number},
    range           : Number,
    orderID         : {type:Number, unique: true, dropDups: true},
    volEntered      : Number,
    minVolume       : Number, 
    bid             : {type:Boolean, 
                        set: function(r) {
                            if(r == "True") {
                                return true;
                            } 
                            if(r == "False") {
                                return false;
                            }
                      }},
    issued          : Date,
    duration        : Date,
    stationID       : Number,
    regionID        : Number,
    solarSystemID   : Number,
    jumps           : Number,
}));

console.log("loaded market_order model in mongoose");