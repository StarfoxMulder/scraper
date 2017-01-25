var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Creating schema
var UserSchema = new Schema({

  userName: {
    type: String,
    required: true,
    unique: true
  },
  stormpathId: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  jumboOne: {
    type: String,
    required: false
  },
  jumboTwo: {
    type: String,
    required: false
  },
  jumboThree: {
    type: String,
    required: false
  },
  articles: [{
    type: Schema.Types.ObjectId,
    ref: "Article"
  }],
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// Create the Article model with the ArticleSchema
var User = mongoose.model("User", UserSchema);

// Export the model
module.exports = User;
