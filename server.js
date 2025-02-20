const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const session = require("express-session");
const flash = require("express-flash");

const app = express();
const staticRoutes = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute");
const errorMiddleware = require("./middleware/errorMiddleware");

// ✅ Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Session & Flash Middleware (ensure `.env` has SESSION_SECRET)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// ✅ Set views directory & EJS as view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

// ✅ Serve static files
app.use(express.static("public"));

// ✅ Register routes
app.use(staticRoutes);
app.use("/inv", inventoryRoute);
app.use(errorRoute);

// ✅ Home Route
app.get("/", (req, res) => {
  res.render("index", { title: "Home", layout: "layouts/layout" });
});

// ✅ Error-handling middleware (must be last!)
app.use(errorMiddleware);

// ✅ Start the server
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";
app.listen(port, () => {
  console.log(`✅ App listening on ${host}:${port}`);
});
