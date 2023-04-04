//imports
let mongoose = require("mongoose");
let passportMongoose = require("passport-local-mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", userSchema);
