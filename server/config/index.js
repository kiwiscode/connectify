const express = require("express");
const logger = require("morgan");
const cors = require("cors");
//
module.exports = (app) => {
  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.set("trust proxy", 1);

  app.use(
    cors({
      credentials: true,
      // when working on local version
      origin: "http://localhost:5173", // <== URL of our future React app

      // when working on deployment version
      // origin: "?",
    })
  );
};
