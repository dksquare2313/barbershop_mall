const express = require("express");
const indexhtml = require("./app.js");
const app = express();
const schedule = require("node-schedule");
const FirebaseData = require("./firebase/setData");

// const job = schedule.scheduleJob("*/10 * * * * *", async function () {
//   let temp = FirebaseData.updateKey();
//   console.log("run");
// });

// home page path
app.use("/", indexhtml);

// dev only
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`listining on ${port}...`);
});
