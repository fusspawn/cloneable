mongoose.model("market_order", new mongoose.Schema({
    price           : Number,
    volRemaining    : Number,
    typeID          : Number,
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