const JobAssignment = require("../../model/Banks/HeroFinCopModel");

// CREATE
exports.createJobAssignment = async (req, res) => {
  try {
    const job = new JobAssignment(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error creating Job Assignment", error });
  }
};

// GET ALL
exports.getAllJobAssignments = async (req, res) => {
  try {
    const jobs = await JobAssignment.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Job Assignments", error });
  }
};

// GET BY ID
exports.getJobAssignmentById = async (req, res) => {
  try {
    const job = await JobAssignment.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Job Assignment", error });
  }
};

// UPDATE
exports.updateJobAssignment = async (req, res) => {
  try {
    const updatedJob = await JobAssignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Updated successfully", updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Error updating Job Assignment", error });
  }
};

// DELETE
exports.deleteJobAssignment = async (req, res) => {
  try {
    const deleted = await JobAssignment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job Assignment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Job Assignment", error });
  }
};
