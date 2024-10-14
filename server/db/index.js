const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

console.log("mongo db uri:", MONGO_URI);

mongoose
  .connect(MONGO_URI, { bufferCommands: false })
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(
      `Connected to Mongo! Database Online => DB name:", ${databaseName}`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
