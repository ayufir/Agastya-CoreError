const CaseAssignment = require("../model/CaseAssignmentModel");

// exports.assignCase = async (req, res) => {
//   const { caseId, bankName, assignedTo, role } = req.body;
//   const assignedBy = req.user._id;

//   try {
//     const alreadyAssigned = await CaseAssignment.findOne({ caseId, role });
//     if (alreadyAssigned)
//       return res.status(400).json({ msg: "Already Assigned" });

//     const assignment = await CaseAssignment.create({
//       bankName,
//       caseId,
//       assignedTo,
//       assignedBy,
//       role,
//     });

//     res.status(200).json({ msg: "Case Assigned", assignment });
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

// exports.getCasesForFO = async (req, res) => {
//   const userId = req.user._id;

//   try {
//     const assignedCases = await CaseAssignment.find({ assignedTo: userId });

//     res.status(200).json(assignedCases);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

exports.assignCase = async (req, res) => {
  const { caseId, assignedTo, route } = req.body;
  const assignedBy = req.user._id;

  try {
    const newAssignment = await CaseAssignment.create({
      caseId,
      assignedTo,
      assignedBy,
      // role,
      route,
    });

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssignedCasesByUser = async (req, res) => {
  try {
    const cases = await CaseAssignment.find({ assignedTo: req.user._id });
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.raiseQuery = async (req, res) => {
  const { caseId } = req.params;
  const { message } = req.body;

  try {
    const updated = await CaseAssignment.findByIdAndUpdate(
      caseId,
      {
        $push: {
          query: {
            message,
            raisedBy: req.user._id,
          },
        },
        status: "QUERY_RAISED",
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
