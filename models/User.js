var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

// Creating schema
var UserSchema = new Schema({

  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
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

UserSchema.pre('save', function(next) {
    var user = this;

// only hash the password if it has been modified (or is new)
if (!user.isModified('password')) return next();

// generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.plugin(passportLocalMongoose);

// Create the Article model with the ArticleSchema
var User = mongoose.model("User", UserSchema);

// Export the model
module.exports = User;
