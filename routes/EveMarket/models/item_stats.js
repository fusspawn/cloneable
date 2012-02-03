mongoose.model("item_stat", new mongoose.Schema({
   highest_buy: {type: Number, default: 0},
   lowest_sell: {type: Number, default: 0},
   typeID: Number,
   highest_buy_order_id: {type: String, default: ""},
   lowest_sell_order_id: {type: String, default: ""}
}));

console.log("loaded item_stat model in mongoose");