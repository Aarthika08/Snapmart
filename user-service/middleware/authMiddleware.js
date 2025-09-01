const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    // Check if Authorization header exists
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // Expecting format: Bearer <token>
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing from header" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
