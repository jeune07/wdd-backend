// const express = require("express");
// const baseController = require("../controllers/baseController");
// const router = express.Router();

// // Static Routes
// // Set up "public" folder / subfolders for static files
// router.use(express.static("public"));
// router.use("/css", express.static(__dirname + "public/css"));
// router.use("/js", express.static(__dirname + "public/js"));
// router.use("/images", express.static(__dirname + "public/images"));
// app.get("/", baseController.buildHome);

// module.exports = router;

const express = require("express");
const baseController = require("../controllers/baseController");
const router = express.Router();
const path = require("path");

// Serve static files from the "public" folder
router.use(express.static(path.join(__dirname, "../public")));

// Serve specific subdirectories explicitly
router.use("/css", express.static(path.join(__dirname, "../public/css")));
router.use("/js", express.static(path.join(__dirname, "../public/js")));
router.use("/images", express.static(path.join(__dirname, "../public/images")));

// Home route (this should be in your main app file, not in this static router)
router.get("/", baseController.buildHome);

module.exports = router;
