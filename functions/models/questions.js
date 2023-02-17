var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//user_id: {type: Schema.Types.ObjectId, ref: 'users', required: true},

var questionsSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  //user_id: { type: String },
  question: { type: String },
  question_selection: { type: Array },
  question_type: { type: String },
  question_answers: { type: Array },
  question_order: { type: String },
});

// Virtual for book's URL
questionsSchema.virtual("url").get(function () {
  return "/catalog/questions/" + this._id;
});

//Export model
module.exports = mongoose.model("questions", questionsSchema);
