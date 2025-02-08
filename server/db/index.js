const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

console.log("mongodb url:", MONGODB_URL);

mongoose
  .connect(MONGODB_URL)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(
      `Connected to Mongo! Database Online => DB name:", ${databaseName}`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
