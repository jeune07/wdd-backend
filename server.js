const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute");
const errorMiddleware = require("./middleware/errorMiddleware");

// Set views directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Use express-ejs-layouts middleware
app.use(expressLayouts);

app.set("layout", "layouts/layout"); // Ensure Express finds it inside views/layouts/

// Serve static files
app.use(express.static("public"));

// Routes
app.use(static);
app.use("/inv", inventoryRoute);

// Home route
app.get("/", function (req, res) {
  res.render("index", { title: "Home", layout: "layouts/layout" }); // ✅ Ensure correct layout path
});
app.use(errorRoute);
app.use(errorMiddleware);

// Start server
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
