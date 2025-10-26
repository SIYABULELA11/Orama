const express = require("express");
const router = express.Router();
const {
  getAllReminders,
  addReminder,
  updateReminder,
  toggleCompletion,
  deleteReminder
} = require("../controllers/reminderController");

router.get("/", getAllReminders);
router.post("/", addReminder);
router.put("/:id", updateReminder);            // Full update (edit)
router.patch("/:id", toggleCompletion);       // Toggle completed
router.delete("/:id", deleteReminder);        // Delete reminder

module.exports = router;

