var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Setup user schema
var usersSchema = new Schema({
  user_id: { type: String },
  password: { type: String },
  user_name: { type: String },
  user_email: { type: String },
  address_f: { type: String },
  adress_i: { type: String },
  img: { type: String },
});

// Export model
module.exports = mongoose.model("users", usersSchema);