const auth = require("./auth");

const adminAuth = [
  auth,
  (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admin rights required." });
    }
  }
];

module.exports = adminAuth;
