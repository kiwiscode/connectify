module.exports = (req, res, next) => {
  req.userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  next();
};
