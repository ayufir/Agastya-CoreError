const express = require("express");
const router = express.Router();
const jobAssignmentController = require("../../controllers/Banks/heroFinCopController");

// Routes
router.post("/", jobAssignmentController.createJobAssignment);
router.get("/", jobAssignmentController.getAllJobAssignments);
router.get("/:id", jobAssignmentController.getJobAssignmentById);
router.put("/:id", jobAssignmentController.updateJobAssignment);
router.delete("/:id", jobAssignmentController.deleteJobAssignment);

module.exports = router;
