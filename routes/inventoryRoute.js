const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// ✅ Inventory Management View
router.get("/", invController.renderManagementView);

// ✅ Classification Routes
router.get("/type/:classificationId", invController.buildByClassificationId);

// ✅ Vehicle Details Route
router.get("/detail/:id", invController.buildByVehicleId);

// ✅ Add New Classification
router.get("/add-classification", invController.renderAddClassification);
router.post("/add-classification", invController.addClassification);

// ✅ Add New Inventory Item
router.get("/add-inventory", invController.renderAddInventory);
router.post("/add-inventory", invController.addInventory);

module.exports = router;
