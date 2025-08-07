const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please proive a proper email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    min: [5, "Password cannot be less than 5"],
    max: [12, "Password cannot be more than 12"],
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.confirmPassword = async function (pwd) {
  const unhashedPassword = await bcrypt.compare(pwd, this.password);
  this.password = undefined;
  return unhashedPassword;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
