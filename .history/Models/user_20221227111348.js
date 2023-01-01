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
      start: data.Monday_start,
      end: data.Monday_end,
    },
    {
      day: "Tuesday",
      start: data.Tuesday_start,
      end: data.Tuesday_end,
    },
    {
      day: "Wednesday",
      start: data.Wednesday_start,
      end: data.Wednesday_end,
    },
    {
      day: "Thursday",
      start: data.Thursday_start,
      end: data.Thursday_end,
    },
    {
      day: "Friday",
      start: data.Friday_start,
      end: data.Friday_end,
    },
    {
      day: "Saturday",
      start: data.Saturday_start,
      end: data.Saturday_end,
    },
    {
      day: "Sunday",
      start: "",
      end: "",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
