const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const utilities = require("./utilities"); // ✅ Import utilities

const app = express();
const accountRoute = require("./routes/accountRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute");
const errorMiddleware = require("./middleware/errorMiddleware");

// ✅ Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ Session & Flash Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// ✅ Middleware to check for logged-in user
app.use(async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      res.locals.user = decoded; // ✅ Makes `user` available in views
    } else {
      res.locals.user = null;
    }
  } catch (error) {
    res.locals.user = null;
  }

  res.locals.nav = await utilities.getNav(); // ✅ Ensures `nav` is available in all views
  next();
});

// ✅ Set views directory & EJS as view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // ✅ Fix: Define the default view engine
app.use(expressLayouts);
app.set("layout", "layouts/layout"); // ✅ Ensure Express finds it inside `views/layouts/`

// ✅ Serve static files
app.use(express.static("public"));

// ✅ Register routes
app.use("/account", accountRoute);
app.use("/inv", inventoryRoute);
app.use(errorRoute);

// ✅ Home Route
app.get("/", (req, res) => {
  res.render("index", { title: "Home", layout: "layouts/layout" });
});

// ✅ Error-handling middleware (must be last!)
app.use(errorMiddleware);

app.use(async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      res.locals.user = decoded; // ✅ Makes `user` available in views
      req.session.user = decoded; // ✅ Ensures session remains active
    } else {
      res.locals.user = null;
    }
  } catch (error) {
    res.locals.user = null;
  }

  res.locals.nav = await utilities.getNav(); // ✅ Ensures `nav` is available in all views
  next();
});

// ✅ Start the server
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";
app.listen(port, () => {
  console.log(`✅ App listening on ${host}:${port}`);
});
