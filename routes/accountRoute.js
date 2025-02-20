const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// ✅ Debugging: Check which functions exist
console.log("Loaded accountController:", accountController);

// ✅ Ensure these functions exist in `accountController.js`
router.get("/login", accountController.renderLogin);
router.post("/login", accountController.processLogin);
router.get("/register", accountController.renderRegister);
router.post("/register", accountController.processRegister);
router.get("/manage", accountController.renderAccountManagement);
router.get("/logout", accountController.logout);

router.get("/update", accountController.renderUpdateAccount);
router.post("/update", accountController.updateAccount);
router.get("/change-password", accountController.renderChangePassword);
router.post("/change-password", accountController.changePassword);

module.exports = router;
