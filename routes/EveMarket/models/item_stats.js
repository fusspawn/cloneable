mongoose.model("item_stat", new mongoose.Schema({
   highest_buy: Number,
   lowest_sell: Number,
   typeID: Number,
   highest_buy_order_id: mongoose.schema.ObjectID,
   lowest_sell_order_id: mongoose.schema.ObjectID
}));

console.log("loaded item_stat model in mongoose");