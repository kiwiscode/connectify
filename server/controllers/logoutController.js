const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

exports.logout = (req, res) => {
  console.log("first line of console.log", req.header.authorization);
  const token = req.headers.authorization.split(" ")[1];

  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.userId;
    User.findByIdAndUpdate(userId, { active: false })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.status(500).json({ message: "Error updating user" });
      });
  });
};
