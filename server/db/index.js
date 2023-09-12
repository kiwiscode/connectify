const mongoose = require("mongoose");
//
const MONGO_URI =
  // when working on deployment version
  // process.env.MONGODB_URI;
  // when working on locally
  "mongodb://127.0.0.1:27017/connectify";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(
      `Connected to Mongo! Database Online => DB name:", ${databaseName}`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
