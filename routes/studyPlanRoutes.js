const express = require("express");
const { getAllPlans, addPlan, updatePlan, deletePlan } = require("../controllers/studyPlanController");
const router = express.Router();

router.get("/", getAllPlans);           // GET all study plans
router.post("/", addPlan);              // POST new study plan
router.put("/:id", updatePlan);         // PUT update study plan
router.delete("/:id", deletePlan);      // DELETE a study plan

module.exports = router;
