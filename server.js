/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");

/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.use("/", baseController.buildHome);

/* ***********************
 * Routes
 *************************/
app.use(static);
// Serve static files from the 'public' directory
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.render("index", { title: "Home" });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = 5500 || process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
