const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: { type: String, default: "" },
  email: { type: String },
  phone: { type: String, default: "" },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  location: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", userSchema);
