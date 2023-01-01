const express = require("express");
const indexhtml = require("./app.js");
const app = express();

// home page path
app.use("/", indexhtml);

// dev only
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`listining on ${port}...`);
});
