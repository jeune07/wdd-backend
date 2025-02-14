const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController"); // ✅ Ensure correct import path

// ✅ Route for classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// ✅ Route for vehicle details view
router.get("/detail/:id", invController.buildByVehicleId);

module.exports = router;
