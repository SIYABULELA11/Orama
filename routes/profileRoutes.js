const express = require("express");
const router = express.Router();
const { getProfile, saveProfile, getAllProfiles } = require("../controllers/profileController");

// Get all profiles (optional - for admin)
router.get("/all", getAllProfiles);

// Get profile by student number
router.get("/:studentNumber", getProfile);

// Create or update profile
router.post("/", saveProfile);

module.exports = router;