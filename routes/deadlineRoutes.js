const express = require("express");
const { getAllDeadlines, addDeadline, updateDeadline, deleteDeadline } = require("../controllers/deadlineController");
const router = express.Router();

router.get("/", getAllDeadlines);
router.post("/", addDeadline);
router.patch("/:id", updateDeadline);
router.delete("/:id", deleteDeadline);

module.exports = router;