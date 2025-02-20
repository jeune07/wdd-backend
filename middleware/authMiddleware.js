const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash("message", "Access denied. Please log in.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      decoded.account_type !== "admin" &&
      decoded.account_type !== "employee"
    ) {
      req.flash("message", "Access denied. You do not have permission.");
      return res.redirect("/account/login");
    }

    req.user = decoded; // ✅ Store user data in request object
    next();
  } catch (error) {
    req.flash("message", "Invalid token. Please log in again.");
    return res.redirect("/account/login");
  }
};

module.exports = authMiddleware;
