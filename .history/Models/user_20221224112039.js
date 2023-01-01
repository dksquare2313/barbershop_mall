const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },

  name: { type: String, default: "" },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    default: "",
  },
  checkedIn: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
