const mongoose = require("mongoose");
//
const MONGO_URI =
  // process.env.MONGO_URI;
  "mongodb+srv://ayktkav:JZfvvRc3SYPvL0FW@connectify-cluster.sh8g6.mongodb.net/connectify";

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
