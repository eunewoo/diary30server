var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Setup questions schema
var questionsSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  question: { type: String },
  question_selection: { type: Array },
  question_type: { type: String },
  question_answers: { type: Array },
  question_order: { type: String },
});

//Export model
module.exports = mongoose.model("questions", questionsSchema);
