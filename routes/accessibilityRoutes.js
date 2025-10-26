const express = require("express");
const router = express.Router();
const { getAccessibilitySettings, saveAccessibilitySettings } = require("../controllers/accessibilityController");

// Get accessibility settings by student number
router.get("/:studentNumber", getAccessibilitySettings);

// Create or update accessibility settings
router.post("/", saveAccessibilitySettings);

module.exports = router;