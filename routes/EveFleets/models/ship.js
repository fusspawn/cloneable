var ShipBase = new mongoose.Schema({
    ship_name: String,
    ship_type_id: Number,
});

ShipBase.pre('save', function (next) {
  redis_client.incr("static.current_ship_base_id", function(err, reply) {
        this.set("ship_type_id", reply);
        next();  
  });
});

mongoose.model("ShipBase",  ShipBase);

