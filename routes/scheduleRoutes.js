const express = require("express");
const router = express.Router();
const {
  getAllScheduleEvents,
  addScheduleEvent,
  updateScheduleEvent,
  deleteScheduleEvent,
  getScheduleEventsByDateRange
} = require("../controllers/scheduleController");

router.get("/", getAllScheduleEvents);
router.get("/date-range", getScheduleEventsByDateRange);
router.post("/", addScheduleEvent);
router.put("/:id", updateScheduleEvent);
router.delete("/:id", deleteScheduleEvent);

module.exports = router;