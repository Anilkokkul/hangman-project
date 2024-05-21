const express = require("express");
require("dotenv").config();

const { db } = require("./db/db.connect");
db();
const app = express();

const port = process.env.PORT || 8000;

app.use("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
