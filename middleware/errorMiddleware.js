const utilities = require("../utilities");

const errorMiddleware = async (err, req, res, next) => {
  console.error("Internal Server Error:", err.message);

  let nav = await utilities.getNav(); // ✅ Get the navigation bar

  res.status(500).render("error", {
    title: "500 - Internal Server Error",
    message: "Something went wrong on our end. Please try again later.",
    layout: "layouts/layout",
    nav, // ✅ Pass `nav` so it does not break navigation.ejs
  });
};

module.exports = errorMiddleware;
