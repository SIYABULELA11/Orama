const express = require("express");
const router = express.Router();
const { getSettings, saveSettings } = require("../controllers/settingsController");

// Get settings by student number
router.get("/:studentNumber", getSettings);

// Create or update settings
router.post("/", saveSettings);

module.exports = router;