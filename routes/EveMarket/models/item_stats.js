var order_collection = mongoose.model("market_order");

mongoose.model("item_stat", new mongoose.Schema({
   highest_buy: Number,
   lowest_sell: Number,
   typeID: Number,
   highest_buy_order_id: String,
   lowest_sell_order_id: String
}));

console.log("loaded item_stat model in mongoose");