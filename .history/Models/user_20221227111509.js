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
  location: {
    type: String,
    default: "",
  },
  timesheet: [
    {
      day: "Monday",
      start: "",
      end: "",
    },
    {
      day: "Tuesday",
      start: "",
      end: "",
    },
    {
      day: "Wednesday",
      start: "",
      end: "",
    },
    {
      day: "Thursday",
      start: "",
      end: "",
    },
    {
      day: "Friday",
      start: "",
      end: "",
    },
    {
      day: "Saturday",
      start: "",
      end: "",
    },
    {
      day: "Sunday",
      start: "",
      end: "",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
