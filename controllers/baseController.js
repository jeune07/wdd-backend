const utilities = require("../utilities"); // ✅ Make sure this import is correct

const baseController = {};

// ✅ Make sure the function is async before using await
baseController.buildHome = async function (req, res) {
  try {
    const nav = await utilities.getNav(); // ✅ `await` is inside an async function
    res.render("index", { title: "Home", nav });
  } catch (error) {
    console.error("Error building home page:", error);
    res.status(500).render("errors/500", { title: "Server Error" });
  }
};

module.exports = baseController;
