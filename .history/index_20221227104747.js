const express = require("express");
const indexhtml = require("./app.js");
const app = express();
const schedule = require("node-schedule");
const FirebaseData = require("./firebase/setData");

const job = schedule.scheduleJob("0 1 * * *", function (fireDate) {
  console.log(
    "This job was supposed to run at " +
      fireDate +
      ", but actually ran at " +
      new Date()
  );
});

// home page path
app.use("/", indexhtml);

// dev only
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`listining on ${port}...`);
});
