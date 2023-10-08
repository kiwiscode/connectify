const express = require("express");
const router = express.Router();

const upload = require("../config/cloudinary.config");

router.get("/", (req, res) => {
  res.send("route is working!");
});

router.post("/", upload.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)
  console.log("requestttttt", req);

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});

module.exports = router;
