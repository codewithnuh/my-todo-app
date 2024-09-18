const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  // Check if there's an Authorization header
  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Split the header if it contains the Bearer prefix
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1] // Extract the token part after "Bearer"
    : authHeader; // Fallback for cases without Bearer

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
