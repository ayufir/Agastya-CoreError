const Case = require("../../model/Banks/BajajModel");
const modelMap = require("../../controllers/modelMap");
const { deleteImage } = require("../../config/imageUploader"); // 👈 storage delete logic

const dictionaryFix = {
  homefirsttrench: "Homefirsttrench",
};

const WORK_IN_PROGRESS_STATUS = "Work in Progress";
const NBSP_WORK_IN_PROGRESS_STATUS = "Work in Progress";
const LEGACY_WORK_IN_PROGRESS_STATUS = "WorkÂ inÂ Progress";
const WORK_IN_PROGRESS_STATUSES = [
  WORK_IN_PROGRESS_STATUS,
  NBSP_WORK_IN_PROGRESS_STATUS,
  LEGACY_WORK_IN_PROGRESS_STATUS,
];

const bankRegistry = modelMap.bankRegistry || [];

const defaultBankSlug = (modelKey) =>
  modelKey.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");

const getBankMeta = (modelKey) => {
  const registryEntry = bankRegistry.find((entry) => entry.key === modelKey);

  return {
    displayName:
      registryEntry?.displayName ||
      modelKey.replace(/([A-Z])/g, " $1").trim(),
    route: registryEntry?.route || defaultBankSlug(modelKey),
  };
};

const enrichCasesWithBankMeta = (cases, modelKey) => {
  const { displayName, route } = getBankMeta(modelKey);

  return cases.map((caseItem) => ({
    ...caseItem.toObject(),
    bankName: displayName,
    bankSlug: route,
     route: route, // Add route field for easier access in frontend
  }));
};


const readCasePathValue = (record, path) =>
  String(path)
    .split(".")
    .reduce(
      (accumulator, key) =>
        accumulator && accumulator[key] !== undefined
          ? accumulator[key]
          : undefined,
      record
    );

const readCaseValue = (record, paths, fallback = "") => {
  for (const path of paths) {
    if (!path) continue;

    const value = readCasePathValue(record, path);
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
};

const normalizeText = (value) => String(value || "").toLowerCase().trim();
const normalizeStatusValue = (value) =>
  normalizeText(value).replace(/\s+/g, "");

const parseMultiValueParam = (value) =>
  Array.from(
    new Set(
      String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );

const getCaseDisplayCustomerName = (record) =>
  readCaseValue(record, [
    "displayCustomerName",
    "customerName",
    "visitedPersonName",
    "applicantName",
    "applicantsName",
    "clientName",
    "basicDetails.nameOfClient",
    "propertyInfo.applicantName",
    "summary.applicantName",
    "header.contactedPerson",
    "personName",
    "applicantDetails.applicantName",
    "applicantNames",
    "contactPersonName",
    "contactedPerson",
  ]);

const getCaseDisplayAddress = (record) =>
  readCaseValue(record, [
    "displayAddress",
    "addressLegal",
    "legalAddress",
    "addressSite",
    "propertyAddress",
    "address",
    "locationDetails.propertyAddressAsVisit",
    "locationDetails.propertyAddressAsDocs",
    "locationDetails.propertyAddressAsTRF",
    "propertyInfo.addressAtSite",
    "propertyInfo.addressAsPerDocument",
    "summary.propertyAddress",
  ]);

const getCaseDisplayContact = (record) =>
  readCaseValue(record, [
    "customerNo",
    "contactNumber",
    "mobileNo",
    "personContactNo",
    "personContact",
    "contactPerson",
    "contactPersonNumber",
    "header.contactedPerson",
  ]);

const getCaseDisplayCity = (record) =>
  readCaseValue(record, [
    "propertyCity",
    "city",
    "propertyLocation",
    "nearestCityTown",
    "locationDetails.mainLocality",
    "basicDetails.city",
    "propertyInfo.city",
    "summary.city",
  ]);

const buildRoleAwareQuery = (user, baseQuery = {}) => {
  const query = { ...baseQuery };

  if (user.role === "FieldOfficer" || user.role === "FIELDOFFICER") {
    // Field Officers only see cases assigned to them
    query.assignedTo = user._id;
  } else if (user.role === "TechnicalManager") {
    // Technical Managers see cases assigned to them OR created by them
    query.$or = [
      { assignedTo: user._id },
      { createdBy: user._id }
    ];
  }
  // All other roles see all cases

  return query;
};

const fetchCasesAcrossBanks = async ({
  user,
  baseQuery = {},
  populate = "assignedTo createdBy",
}) => {
  const registry = modelMap.bankRegistry || [];

  const results = await Promise.all(
    registry.map(async ({ key: modelKey, model: Model }) => {
      let mongoQuery = Model.find(buildRoleAwareQuery(user, baseQuery)).sort({
        createdAt: -1,
      });

      if (populate) {
        mongoQuery = mongoQuery.populate(populate);
      }

      const cases = await mongoQuery;
      return enrichCasesWithBankMeta(cases, modelKey);
    })
  );

  return results.flat();
};

const applyCommonCaseFilters = (cases, rawQuery = {}, user) => {
  // Enforce regional visibility for all non-SuperAdmin users if they have an assignedCity
  if (user && user.role !== "SuperAdmin" && user.assignedCity) {
    const userCity = (user.assignedCity || "").toLowerCase().trim();
    const centralCities = ["bhopal", "gwalior", "jabalpur"];
    if (userCity) {
      cases = cases.filter((caseItem) => {
        const caseCity = (getCaseDisplayCity(caseItem) || "").toLowerCase().trim();
        if (centralCities.includes(userCity) || userCity === "combined bjg") {
          return ["bhopal", "gwalior", "jabalpur", "combined bjg"].some(c => caseCity === c || caseCity.includes(c));
        } else {
          return caseCity === userCity || caseCity.includes(userCity);
        }
      });
    }
  }

  const selectedBanks = parseMultiValueParam(
    rawQuery.bankName || rawQuery.bank || rawQuery.bankNames
  ).map(normalizeText);
  const selectedStatuses = parseMultiValueParam(
    rawQuery.status || rawQuery.statuses
  ).map(normalizeStatusValue);
  const selectedCities = parseMultiValueParam(rawQuery.city).map(normalizeText);
  const search = normalizeText(rawQuery.search);

  // Month filter
  if (rawQuery.month) {
    const [year, month] = rawQuery.month.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    cases = cases.filter((caseItem) => {
      const createdDate = caseItem.createdAt ? new Date(caseItem.createdAt) : null;
      const uploadedDate = caseItem.uploadDate ? new Date(caseItem.uploadDate) : null;
      const matchCreated = createdDate && !isNaN(createdDate.getTime()) && createdDate >= startDate && createdDate < endDate;
      const matchUploaded = uploadedDate && !isNaN(uploadedDate.getTime()) && uploadedDate >= startDate && uploadedDate < endDate;
      return matchCreated || matchUploaded;
    });
  }

  return cases.filter((caseItem) => {
    if (selectedBanks.length > 0) {
      const bankCandidates = [
        caseItem.bankName,
        caseItem.bankSlug,
        caseItem.route,
      ].map(normalizeText);

      const bankMatched = selectedBanks.some((selectedBank) =>
        bankCandidates.some(
          (candidate) =>
            candidate &&
            (candidate === selectedBank || candidate.includes(selectedBank))
        )
      );

      if (!bankMatched) {
        return false;
      }
    }

    if (selectedStatuses.length > 0) {
      const caseStatus = normalizeStatusValue(caseItem.status);
      if (!selectedStatuses.includes(caseStatus)) {
        return false;
      }
    }

    if (selectedCities.length > 0) {
      const caseCity = normalizeText(getCaseDisplayCity(caseItem));
      const cityMatched = selectedCities.some((selectedCity) => {
        if (selectedCity === "combined bjg") {
          return ["bhopal", "gwalior", "jabalpur"].some(c => caseCity === c || caseCity.includes(c));
        }
        return caseCity && (caseCity === selectedCity || caseCity.includes(selectedCity));
      });

      if (!cityMatched) {
        return false;
      }
    }

    if (search) {
      // Word-split partial match: "Ram" matches "Ramji", "Ram Kumar", etc.
      // Split on spaces so "Ram Ku" finds "Ram Kumar" — every token must match
      const searchTokens = search.split(/\s+/).filter(Boolean);

      const searchableValues = [
        caseItem.bankName,
        caseItem.bankSlug,
        getCaseDisplayCustomerName(caseItem),
        getCaseDisplayAddress(caseItem),
        getCaseDisplayContact(caseItem),
        caseItem?.assignedTo?.name,
        caseItem.status,
        caseItem.customCaseId,
        caseItem.appIdNotes,
      ]
        .map(normalizeText)
        .filter(Boolean)
        .join(" ");

      const hasMatch = searchTokens.every((token) => searchableValues.includes(token));

      if (!hasMatch) {
        return false;
      }
    }

    return true;
  });
};

const sortCasesNewestFirst = (cases) =>
  [...cases].sort(
    (left, right) =>
      new Date(right?.createdAt || 0).getTime() -
      new Date(left?.createdAt || 0).getTime()
  );

const buildFilterOptions = (cases) => ({
  banks: [...new Set(cases.map((caseItem) => caseItem.bankName).filter(Boolean))],
  statuses: [
    ...new Set(cases.map((caseItem) => caseItem.status).filter(Boolean)),
  ],
});

const paginateItems = (items, query = {}, defaultLimit = 10) => {
  const requestedLimit = Number.parseInt(query.limit, 10);
  const requestedPage = Number.parseInt(query.page, 10);
  const limit =
    Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : defaultLimit;

  const total = items.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, Math.max(totalPages, 1))
      : 1;

  const startIndex = (page - 1) * limit;

  return {
    items: items.slice(startIndex, startIndex + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

const buildCaseListPayload = (cases, query = {}, defaultLimit = 10, user) => {
  const filteredCases = sortCasesNewestFirst(
    applyCommonCaseFilters(cases, query, user)
  );
  const { items, pagination } = paginateItems(
    filteredCases,
    query,
    defaultLimit
  );

  return {
    items,
    pagination,
    filterOptions: buildFilterOptions(filteredCases),
  };
};

const getAssetUrl = (asset) =>
  typeof asset === "string" ? asset : asset?.url || "";

const buildAssetPullQuery = (fieldName, asset) => {
  if (typeof asset === "string") {
    return { $pull: { [fieldName]: asset } };
  }

  if (asset?.fileId) {
    return { $pull: { [fieldName]: { fileId: asset.fileId } } };
  }

  if (asset?.url) {
    return { $pull: { [fieldName]: { url: asset.url } } };
  }

  return { $pull: { [fieldName]: asset } };
};

function toPascalCase(str) {
  return str
    .replace(/\s+/g, "-")
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function toPascalCaseSmart(str) {
  const normalizedInput = String(str)
    .replace(/\bbank\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const key = normalizedInput.toLowerCase().replace(/[-_\s]/g, ""); // normalize input
  if (dictionaryFix[key]) return dictionaryFix[key];

  const pascal = toPascalCase(normalizedInput);
  return pascal.charAt(0) + pascal.slice(1).toLowerCase(); // only first letter capital
}

const resolveModel = (bankNameOrRoute) => {
  if (!bankNameOrRoute) return null;

  // Clean the string (e.g. if it's a route "/bank/icici/edit/123", extract bank slug)
  let name = bankNameOrRoute;
  if (name.includes("/")) {
    const routeParts = name.split("/").filter(Boolean);
    const filteredParts = routeParts.filter(
      (p) =>
        !/^[0-9a-f]{24}$/i.test(p) &&
        !["edit", "bank"].includes(p.toLowerCase())
    );
    name = filteredParts.length > 0 ? filteredParts[filteredParts.length - 1] : (routeParts[0] || name);
  }

  const modelKey = toPascalCaseSmart(name);

  // 1. Direct modelMap lookup
  if (modelMap[modelKey]) return modelMap[modelKey];

  // 2. Case-insensitive lookup in modelMap keys
  const modelMapKey = Object.keys(modelMap).find(
    (k) => k.toLowerCase() === modelKey.toLowerCase() || k.toLowerCase() === name.toLowerCase()
  );
  if (modelMapKey && modelMap[modelMapKey]) return modelMap[modelMapKey];

  // 3. Lookup in bankRegistry
  const registry = modelMap.bankRegistry || [];
  const entry = registry.find(
    (b) =>
      b.key.toLowerCase() === name.toLowerCase() ||
      b.key.toLowerCase() === modelKey.toLowerCase() ||
      (b.displayName && b.displayName.toLowerCase() === name.toLowerCase()) ||
      (b.route && b.route.toLowerCase() === name.toLowerCase())
  );
  if (entry && entry.model) return entry.model;

  // 4. Try matching direct keys
  if (modelMap[name]) return modelMap[name];

  return null;
};

exports.assignCase = async (req, res) => {
  const { caseId, fieldOfficerId, route } = req.body;

  console.log(caseId, "ZXCVBNM")
  console.log(fieldOfficerId, "QWERTYUIOP")
  console.log(route, "LKJHGFDSA")

  try {
    // Robust extraction: handles URL-style routes like "/bank/icici/edit/{caseId}"
    // and simple slugs like "icici"
    const routeParts = (route || "").split("/").filter(Boolean);

    // Filter out MongoDB ObjectIds (24 hex chars), "edit", and "bank" keywords
    // so we're left with just the bank slug
    const filteredParts = routeParts.filter(
      (p) =>
        !/^[0-9a-f]{24}$/i.test(p) &&
        !["edit", "bank"].includes(p.toLowerCase())
    );
    const bankName = filteredParts.length > 0 ? filteredParts[filteredParts.length - 1] : (routeParts[0] || route);

    console.log(bankName, "this is the bank model name")
    const Model = resolveModel(bankName);

    if (!Model) {
      return res
        .status(400)
        .json({ error: `Invalid route/model for bank: ${bankName}` });
    }

    let updated = await Model.findByIdAndUpdate(
      caseId,
      {
        $set: {
          assignedTo: fieldOfficerId,
          status: WORK_IN_PROGRESS_STATUS,
          route: route
        },
        $push: {
          timeline: {
            status: WORK_IN_PROGRESS_STATUS,
            updatedAt: new Date(),
            updatedBy: req.user._id,
            note: `Assigned to user ${fieldOfficerId}`,
          }
        }
      },
      { new: true }
    );

    try {
      const mongoose = require("mongoose");
      const Notification = require("../../model/Notification");
      const User = mongoose.model("User");
      let officerName = "Officer";
      try {
        const officer = await User.findById(fieldOfficerId);
        if (officer) officerName = officer.name;
      } catch (_) {}
      const notif = await Notification.create({
        userId: fieldOfficerId,
        caseId: caseId,
        message: `New case for ${updated.customerName || updated.applicantName || "customer"} has been assigned to ${officerName}`,
        bankName: updated.bankName || bankName,
      });
      if (req.io) req.io.emit("newNotification", notif);
      else if (global.io) global.io.emit("newNotification", notif);
    } catch (notifErr) {
      console.error("Failed to create notification on assignCase:", notifErr.message);
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.unassignCase = async (req, res) => {
  const { caseId } = req.params;

  try {
    // 🔍 Loop through all models to find the one that contains the caseId
    let foundModel = null;
    let foundDoc = null;

    const registry = modelMap.bankRegistry || Object.values(modelMap);
    for (const bankConfig of registry) {
      const Model = bankConfig.model || bankConfig;
      if (Model && Model.findById) {
        try {
          const doc = await Model.findById(caseId);
          if (doc) {
            foundModel = Model;
            foundDoc = doc;
            break;
          }
        } catch (err) {
          // ignore
        }
      }
    }

    if (!foundModel || !foundDoc) {
      return res.status(404).json({ error: "Case not found in any model" });
    }

    const updated = await foundModel.findByIdAndUpdate(
      caseId,
      {
        $unset: { assignedTo: "" },
        $set: { status: "Pending" },
        $push: {
          timeline: {
            status: "Pending",
            updatedAt: new Date(),
            updatedBy: req.user._id,
            note: `Unassigned by admin`,
          }
        }
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error unassigning case:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// exports.getCasesByRole = async (req, res, next) => {
//   try {
//     const user = req.user;
//     let cases;
//     if (user.role === "Coordinator") {
//       cases = await Case.find({ createdBy: user._id }).populate("assignedTo");
//     } else if (user.role === "FieldOfficer") {
//       cases = await Case.find({ assignedTo: user._id });
//     } else {
//       cases = await Case.find({});
//     }
//     res.json(cases);
//   } catch (error) {
//     next(error);
//   }
// };

// exports.acceptCase = async (req, res) => {
//   try {
//     const caseId = req.params.id;

//     const updatedCase = await Case.findByIdAndUpdate(
//       caseId,
//       { approvalStatus: "Accepted", acceptedAt: new Date() },
//       { new: true }
//     );

//     res.status(200).json(updatedCase);
//   } catch (err) {
//     res.status(500).json({ message: "Error accepting case" });
//   }
// };

// Duplicate updateCaseStatus removed. Robust version is defined below.

// exports.getAllAssignedCases = async (req, res) => {
//   try {
//     const cases = await Case.find({ assignedTo: { $ne: null } }).populate(
//       "assignedTo",
//       "name email"
//     );

//     res.json(cases);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch assigned cases" });
//   }
// };

exports.getCasesByRole = async (req, res) => {
  const user = req.user;
  let allCases = [];

  try {
    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    const results = await Promise.all(
      bankRegistry.map(async (bankConfig) => {
        const { key: modelKey, model: Model } = bankConfig;
        let query = {};

        // Role-based ownership filtering (Field Officers only see cases assigned to them)
        if (user.role === "FieldOfficer" || user.role === "FIELDOFFICER") {
          query.assignedTo = user._id;
        }

        const cases = await Model.find(query).populate("assignedTo");
        return enrichCasesWithBankMeta(cases, modelKey);
      })
    );

    allCases = results.flat();

    // City restriction for all non-SuperAdmin users if they have an assignedCity
    if (user && user.role !== "SuperAdmin" && user.assignedCity) {
      const centralCities = ["bhopal", "gwalior", "jabalpur"];
      const normalizedUserCity = user.assignedCity.toLowerCase().trim();
      
      allCases = allCases.filter((caseItem) => {
        const caseCity = (getCaseDisplayCity(caseItem) || "").toLowerCase().trim();
        if (centralCities.includes(normalizedUserCity) || normalizedUserCity === "combined bjg") {
          return ["bhopal", "gwalior", "jabalpur", "combined bjg"].some(c => caseCity === c || caseCity.includes(c));
        } else {
          return caseCity === normalizedUserCity || caseCity.includes(normalizedUserCity);
        }
      });
    }

    res.json(allCases);
  } catch (err) {
    console.error("Error in getCasesByRole:", err);
    res.status(500).json({ error: "Something went wrong fetching cases." });
  }
};

// ---

exports.acceptCase = async (req, res) => {
  const { id } = req.params;
  const { bankName } = req.body;
  if (!bankName) {
    return res.status(400).json({ error: "Bank name is required." });
  }

  const Model = resolveModel(bankName);

  if (!Model) {
    return res.status(400).json({ error: `Invalid route/model for bank: ${bankName}` });
  }

  try {
    const updatedCase = await Model.findByIdAndUpdate(
      id,
      {
        $set: { approvalStatus: "Accepted" },
        $push: {
          timeline: {
            status: "Accepted",
            updatedAt: new Date(),
            updatedBy: req.user?._id,
            note: `Accepted by Field Officer`,
          }
        }
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found." });
    }

    try {
      const Notification = require("../../model/Notification");
      const notif = await Notification.create({
        userId: req.user?._id,
        caseId: id,
        message: `Case for ${updatedCase.customerName || updatedCase.applicantName || "customer"} has been accepted by ${req.user?.name || "Field Officer"}`,
        bankName: updatedCase.bankName || bankName,
      });
      if (req.io) req.io.emit("newNotification", notif);
      else if (global.io) global.io.emit("newNotification", notif);
    } catch (notifErr) {
      console.error("Failed to create notification on acceptCase:", notifErr.message);
    }

    res.status(200).json(updatedCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error accepting case" });
  }
};

exports.declineCase = async (req, res) => {
  const { id } = req.params;
  const { bankName, declineReason } = req.body;
  if (!bankName) {
    return res.status(400).json({ error: "Bank name is required." });
  }

  const Model = resolveModel(bankName);

  if (!Model) {
    return res.status(400).json({ error: `Invalid route/model for bank: ${bankName}` });
  }

  try {
    const updatePayload = {
      approvalStatus: "Declined",
      status: "Pending",
      $unset: { assignedTo: "" },
    };

    // Save the decline reason if provided
    if (declineReason && declineReason.trim()) {
      updatePayload.declineReason = declineReason.trim();
      // Also push to timeline if the model supports it
      updatePayload.$push = {
        timeline: {
          status: "Declined",
          updatedAt: new Date(),
          updatedBy: req.user._id,
          note: `Declined by Field Officer. Reason: ${declineReason.trim()}`,
        },
      };
    }

    const updatedCase = await Model.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, strict: false }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found." });
    }

    try {
      const Notification = require("../../model/Notification");
      const notif = await Notification.create({
        userId: req.user?._id,
        caseId: id,
        message: `Case for ${updatedCase.customerName || updatedCase.applicantName || "customer"} has been declined by ${req.user?.name || "Field Officer"}${declineReason ? `. Reason: ${declineReason}` : ""}`,
        bankName: updatedCase.bankName || bankName,
      });
      if (req.io) req.io.emit("newNotification", notif);
      else if (global.io) global.io.emit("newNotification", notif);
    } catch (notifErr) {
      console.error("Failed to create notification on declineCase:", notifErr.message);
    }

    res.status(200).json(updatedCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error declining case" });
  }
};

// ---

exports.updateCaseStatus = async (req, res) => {
  const { caseId, status, note, bankName } = req.body; // Assuming bankName is sent in the body

  if (!caseId) {
    return res.status(400).json({ error: "Case ID is required." });
  }

  let Model = null;
  if (bankName) {
    Model = resolveModel(bankName);
  }

  // Fallback: search across all models if bankName not provided or not matched
  if (!Model) {
    const registry = modelMap.bankRegistry || Object.values(modelMap);
    for (const bankConfig of registry) {
      const M = bankConfig.model || bankConfig;
      if (M && M.findById) {
        try {
          const doc = await M.findById(caseId);
          if (doc) {
            Model = M;
            break;
          }
        } catch (err) {
          // ignore error and continue
        }
      }
    }
  }

  if (!Model) {
    return res.status(400).json({ error: "Case not found in any bank model." });
  }

  try {
    const updatePayload = {
      $set: { status },
      $push: {
        timeline: {
          status,
          updatedAt: new Date(),
          updatedBy: req.user._id,
          note,
        },
      },
    };

    if (status === "Work in Progress") {
      updatePayload.$set.isReportSubmitted = false;
      updatePayload.$set.queryResolved = true;
    }

    const updated = await Model.findByIdAndUpdate(
      caseId,
      updatePayload,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Case not found." });
    }

    // Create notification and emit socket event on status changes
    try {
      const Notification = require("../../model/Notification");
      const notif = await Notification.create({
        userId: req.user._id,
        caseId,
        message: `Status of case for ${updated.customerName || updated.applicantName || "customer"} updated to ${status}`,
        bankName: bankName,
      });

      if (req.io) {
        req.io.emit("newNotification", notif);
      } else if (global.io) {
        global.io.emit("newNotification", notif);
      }
    } catch (notifErr) {
      console.error("Failed to create notification on status update:", notifErr.message);
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong updating status." });
  }
};

// ---

exports.getCaseById = async (req, res) => {
  const { id } = req.params;

  try {
    // Iterate through all models in bankRegistry
    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    for (const bankConfig of bankRegistry) {
      const { key: modelKey, model: Model } = bankConfig;

      const caseData = await Model.findById(id).populate(
        "assignedTo createdBy"
      );

      if (caseData) {
        // Optional: Attach bank info for frontend use
        const bankSlug = modelKey
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()
          .replace(/^-/, "");
        const bankName = modelKey.replace(/([A-Z])/g, " $1").trim();

        return res.json({
          ...caseData.toObject(),
          bankName,
          bankSlug,
        });
      }
    }

    // If no case found in any model
    return res
      .status(404)
      .json({ message: "Case not found in any bank model." });
  } catch (err) {
    console.error("Error fetching case by ID:", err);
    res
      .status(500)
      .json({ error: "Something went wrong fetching case by ID." });
  }
};

// ---
exports.getAllAssignedCases = async (req, res) => {
  const user = req.user;
  try {
    const allCases = await fetchCasesAcrossBanks({
      user,
      baseQuery: {
        assignedTo: { $ne: null },
        status: {
          $in: [
            "Assigned",
            "Visited",
            "Reviewed",
            "Reported",
            "assigned",
            "visited",
            "reviewed",
            "reported",
            ...WORK_IN_PROGRESS_STATUSES
          ]
        },
      },
      populate: "assignedTo createdBy",
    });

    res.json(buildCaseListPayload(allCases, req.query, 10, user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch assigned cases." });
  }
};

exports.getPendingCases = async (req, res) => {
  const user = req.user;
  try {
    const allPendingCases = await fetchCasesAcrossBanks({
      user,
      baseQuery: { status: "Pending" },
      populate: "assignedTo createdBy",
    });

    res.json(buildCaseListPayload(allPendingCases, req.query, 10, user));
  } catch (err) {
    console.error("Error in getPendingCases:", err);
    res.status(500).json({ error: "Failed to fetch pending cases." });
  }
};

exports.deleteCase = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  if (user && (user.role === "FieldOfficer" || user.role === "FIELDOFFICER")) {
    return res.status(403).json({ error: "Access denied. Field Officers are not allowed to delete cases." });
  }

  try {
    let updatedCase = null;
    let matchedModel = null;

    const registry = modelMap.bankRegistry || Object.values(modelMap);
    for (const bankConfig of registry) {
      const Model = bankConfig.model || bankConfig;
      const key = bankConfig.key || bankConfig.modelName || "Bank";
      if (Model && Model.findById) {
        try {
          const found = await Model.findById(id);
          if (found) {
            // Update the status to "cancelled" instead of deleting
            updatedCase = await Model.findByIdAndUpdate(
              id,
              { status: "cancelled" },
              { new: true } // returns the updated document
            );
            matchedModel = key;
            try {
              const Notification = require("../../model/Notification");
              const notif = await Notification.create({
                userId: req.user?._id,
                caseId: id,
                message: `Case for ${updatedCase.customerName || updatedCase.applicantName || "customer"} was deleted/cancelled by ${req.user?.name || "Admin"}`,
                bankName: updatedCase.bankName || matchedModel,
              });
              if (req.io) req.io.emit("newNotification", notif);
              else if (global.io) global.io.emit("newNotification", notif);
            } catch (notifErr) {
              console.error("Failed to create notification on deleteCase:", notifErr.message);
            }
            break;
          }
        } catch (err) {
          // ignore and continue
        }
      }
    }

    if (!updatedCase) {
      return res
        .status(404)
        .json({ error: "Case not found in any bank model." });
    }

    res.json({
      message: `Case status updated to 'cancelled' in ${matchedModel} model.`,
      updatedCase,
    });
  } catch (err) {
    console.error("Error cancelling case:", err);
    res
      .status(500)
      .json({ error: "Something went wrong while cancelling the case." });
  }
};

//! Final update
exports.finalUpdate = async (req, res) => {
  const { bankName, updateData } = req.body;
  const { id } = req.params;
  if (!bankName || !id || !updateData) {
    return res.status(400).json({
      error: "bankName, caseId, and updateData are required.",
    });
  }


  console.log(bankName, "zero")

  const Model = resolveModel(bankName);

  if (!Model) {
    return res.status(400).json({
      error: `Model not found for bank: ${bankName}`,
    });
  }

  // Prevent timeline conflict
  const { timeline, ...sanitizedUpdateData } = updateData;

  console.log('====================================');
  console.log(updateData);
  console.log('====================================');

  try {
    const existingCase = await Model.findById(id);

    const modelKey = toPascalCaseSmart(bankName);
    const updateFields = {
      ...sanitizedUpdateData,
      bankName: sanitizedUpdateData.bankName || bankName,
      route: sanitizedUpdateData.route || getBankMeta(modelKey).route,
      isReportSubmitted: true,
      approvalStatus: "FinalSubmitted",
      status: "FinalSubmitted", // lock status
    };

    // Sanitize populated objects — sirf _id chahiye, object nahi
    if (updateFields.createdBy && typeof updateFields.createdBy === "object") {
      updateFields.createdBy = updateFields.createdBy._id;
    }
    if (existingCase && existingCase.createdBy) {
      updateFields.createdBy = existingCase.createdBy;
    } else if (!updateFields.createdBy && req.user?._id) {
      updateFields.createdBy = req.user._id;
    }

    if (updateFields.assignedTo && typeof updateFields.assignedTo === "object") {
      updateFields.assignedTo = updateFields.assignedTo._id;
    }
    if (req.user?.role === "FieldOfficer" && !updateFields.assignedTo) {
      updateFields.assignedTo = req.user._id;
    }

    const updatedCase = await Model.findByIdAndUpdate(
      id,
      {
        ...updateFields,
        $push: {
          timeline: {
            status: "FinalSubmitted",
            updatedAt: new Date(),
            updatedBy: req.user._id, // requires auth middleware
            note: "Case marked as final by admin.",
          },
        },
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    try {
      const Notification = require("../../model/Notification");
      const notif = await Notification.create({
        userId: req.user?._id,
        caseId: id,
        message: `Case report for ${updatedCase.customerName || updatedCase.applicantName || "customer"} was finalized/submitted by ${req.user?.name || "Admin"}`,
        bankName: updatedCase.bankName || bankName,
      });
      if (req.io) req.io.emit("newNotification", notif);
      else if (global.io) global.io.emit("newNotification", notif);
    } catch (notifErr) {
      console.error("Failed to create notification on finalUpdate:", notifErr.message);
    }

    res.json(updatedCase);
  } catch (err) {
    console.error("Final update error:", err.message);
    res.status(500).json({ error: "Final update failed." });
  }
};

// ! total cases fetch
exports.getFinalSubmittedCases = async (req, res) => {
  const user = req.user;
  try {
    const finalCases = await fetchCasesAcrossBanks({
      user,
      baseQuery: { status: { $in: ["FinalSubmitted", "Submitted", "Approved", "approved"] } },
      populate: "assignedTo createdBy",
    });

    res.status(200).json(buildCaseListPayload(finalCases, req.query, 10, user));
  } catch (err) {
    console.error("Error fetching final submitted cases:", err);
    res.status(500).json({ message: "Failed to fetch final submitted cases." });
  }
};

// ! cancel cases fetch

exports.getCancelledCases = async (req, res) => {
  const user = req.user;
  try {
    const cancelledCases = await fetchCasesAcrossBanks({
      user,
      baseQuery: { status: { $in: ["cancelled", "Cancelled", "cancel", "Cancel"] } },
      populate: "assignedTo createdBy",
    });

    res.json({
      message: "Cancelled cases fetched successfully.",
      ...buildCaseListPayload(cancelledCases, req.query, 10, user),
    });
  } catch (err) {
    console.error("Error fetching cancelled cases:", err);
    res.status(500).json({
      error: "Something went wrong while fetching cancelled cases.",
    });
  }
};

// !  out of tat case
exports.getOutOfTATCases = async (req, res) => {
  const user = req.user;
  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  try {
    const outOfTatCases = await fetchCasesAcrossBanks({
      user,
      baseQuery: {
        $or: [
          { createdAt: { $lte: fortyEightHoursAgo } },
          { uploadDate: { $lte: fortyEightHoursAgo } }
        ]
      },
      populate: "assignedTo createdBy",
    });

    const normalizeS = (s) => String(s || "").toLowerCase().trim().replace(/\s+/g, " ");

    const filteredOutOfTat = outOfTatCases.filter((item) => {
      const s = normalizeS(item.status);
      if (
        s.includes("working") || s.includes("assigned") || s.includes("progress") ||
        s.includes("visited") || s.includes("reported") || s.includes("reviewed") ||
        s.includes("final") || s.includes("submitted") || s.includes("done") || s.includes("cancel")
      ) return false;
      const d = new Date(item.createdAt || item.uploadDate);
      if (isNaN(d.getTime())) return false;
      const hours = (now - d) / (1000 * 60 * 60);
      return hours > 48;
    });

    const payload = buildCaseListPayload(filteredOutOfTat, req.query, 10, user);

    return res.status(200).json({
      success: true,
      message: "Out of TAT reports",
      ...payload,
    });
  } catch (error) {
    console.error("OutOfTAT error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


exports.getSummaryData = async (req, res) => {
  try {
    const pending = [];
    const working = [];
    const totalSubmissions = [];
    const finalSubmitted = [];
    const queryRaised = [];
    const cancelled = [];
    const outOfTat = [];
    const user = req.user;
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Month filtering
    let monthFilter = {};
    if (req.query.month) {
      const [year, month] = req.query.month.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      monthFilter = {
        $or: [
          { createdAt: { $gte: startDate, $lt: endDate } },
          { uploadDate: { $gte: startDate, $lt: endDate } }
        ]
      };
    }

    // Bank filtering
    let bankFilter = {};
    if (req.query.bank) {
      const bankRegistry = modelMap.bankRegistry || [];
      const bankConfig = bankRegistry.find(b => b.displayName === req.query.bank || b.key.toLowerCase() === req.query.bank.toLowerCase());
      if (bankConfig) {
        bankFilter = { _model: bankConfig.model.modelName };
      }
    }

    const bankRegistry =
      modelMap.bankRegistry ||
      Object.entries(modelMap).map(([key, model]) => ({
        key,
        displayName: key.replace(/([A-Z])/g, " $1").trim(),
        model,
      }));

    // Filter bank registry if bank is specified
    let filteredBankRegistry = bankRegistry;
    if (req.query.bank) {
      filteredBankRegistry = bankRegistry.filter(b => 
        b.displayName.toLowerCase() === req.query.bank.toLowerCase() ||
        b.key.toLowerCase() === req.query.bank.toLowerCase()
      );
    }

    // Fetch all cases in parallel across all banks
    const results = await Promise.all(
      filteredBankRegistry.map(async (bankConfig) => {
        const { key: modelKey, displayName, model: Model } = bankConfig;
        const baseQuery = buildRoleAwareQuery(user);
        const allCases = await Model.find({ ...baseQuery, ...monthFilter })
          .select("_id status approvalStatus declineReason createdAt uploadDate customerName visitedPersonName applicantName applicantsName clientName basicDetails.nameOfClient propertyInfo.applicantName summary.applicantName header.contactedPerson addressLegal legalAddress addressSite propertyAddress address locationDetails.propertyAddressAsVisit locationDetails.propertyAddressAsDocs locationDetails.propertyAddressAsTRF propertyInfo.addressAtSite propertyInfo.addressAsPerDocument summary.propertyAddress customerNo contactNumber mobileNo personContactNo personContact contactPerson contactPersonNumber propertyCity city propertyLocation nearestCityTown locationDetails.mainLocality basicDetails.city propertyInfo.city summary.city assignedTo createdBy AttachDocuments atsDocuments route customCaseId appIdNotes displayAddress displayCustomerName personName applicantDetails.applicantName applicantNames contactPersonName contactedPerson isReportSubmitted")
          .populate("assignedTo");
        return {
          modelKey,
          displayName,
          allCases
        };
      })
    );

    for (const result of results) {
      const { modelKey, displayName, allCases } = result;

      const bankName = displayName;
      const bankSlug = modelKey
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "");

      const enrich = (cases) =>
        cases.map((c) => {
          const obj = c.toObject();
          return {
            ...obj,
            bankName,
            bankSlug,
            // Purane ICICI records ka uploadDate ko createdAt ke roop mein use karo
            createdAt: obj.createdAt || obj.uploadDate || null,
          };
        });

      totalSubmissions.push(...enrich(allCases));
    }

    const filteredTotalSubmissions = sortCasesNewestFirst(
      applyCommonCaseFilters(totalSubmissions, req.query, user)
    );

    const { items: tableItems, pagination } = paginateItems(filteredTotalSubmissions, req.query, 10);
    const filterOptions = buildFilterOptions(filteredTotalSubmissions);

    // Calculate actual counts from the filtered data
    const normalizeS = (s) => String(s || "").toLowerCase().trim().replace(/\s+/g, " ");
    const isSubmittedCase = (item) => {
      const s = normalizeS(item.status);
      return (s.includes("submitted") || item.isReportSubmitted === true) && !s.includes("approved") && !s.includes("cancel");
    };

    const pendingCount = filteredTotalSubmissions.filter((item) => {
      const s = normalizeS(item.status);
      return s.includes("pending") && !isSubmittedCase(item);
    }).length;

    const workingCount = filteredTotalSubmissions.filter((item) => {
      const s = normalizeS(item.status);
      if (isSubmittedCase(item)) return false;
      return (
        s.includes("working") ||
        s.includes("assigned") ||
        s.includes("progress") ||
        s.includes("visited") ||
        s.includes("reported") ||
        s.includes("reviewed")
      );
    }).length;

    const finalSubmittedCount = filteredTotalSubmissions.filter((item) => {
      const s = normalizeS(item.status);
      return s.includes("final") || s.includes("submit") || s.includes("done") || s.includes("approved");
    }).length;

    const queryRaisedCount = filteredTotalSubmissions.filter((item) =>
      normalizeS(item.status).includes("query")
    ).length;

    const cancelledCount = filteredTotalSubmissions.filter((item) =>
      normalizeS(item.status).includes("cancel")
    ).length;

    const outOfTatCount = filteredTotalSubmissions.filter((item) => {
      const s = normalizeS(item.status);
      if (
        s.includes("working") || s.includes("assigned") || s.includes("progress") ||
        s.includes("visited") || s.includes("reported") || s.includes("reviewed") ||
        s.includes("final") || s.includes("submitted") || s.includes("done") || s.includes("cancel")
      ) return false;
      const d = new Date(item.createdAt || item.uploadDate);
      if (isNaN(d.getTime())) return false;
      const hours = (now - d) / (1000 * 60 * 60);
      return hours > 48;
    }).length;

    res.json({
      counts: {
        allCases: filteredTotalSubmissions.length,
        pending: pendingCount,
        working: workingCount,
        finalSubmitted: finalSubmittedCount,
        queryRaised: queryRaisedCount,
        cancelled: cancelledCount,
        outOfTat: outOfTatCount,
      },
      pending: [],
      working: [],
      totalSubmissions: filteredTotalSubmissions,
      finalSubmitted: [],
      queryRaised: [],
      cancelled: [],
      outOfTat: [],
      tableItems: tableItems,
      pagination: pagination,
      filterOptions: filterOptions,
    });
  } catch (err) {
    console.error("Error fetching summary data:", err);
    res.status(500).json({ error: "Failed to fetch summary data" });
  }
};


exports.deleteImageFromCase = async (req, res) => {
  try {
    const { id } = req.params; // Document ID
    const { imageUrl, route, fieldName = "imageUrls" } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    if (!route) {
      return res.status(400).json({ message: "route is required" });
    }

    // 🧠 Dynamic model from route
    const bankName = route.split("/")[2]; // e.g., "home-first"
    const Model = resolveModel(bankName);

    if (!Model) {
      return res
        .status(400)
        .json({ message: `Invalid model for route: ${bankName}` });
    }

    // ✅ Step 1: Delete image from storage
    try {
      const assetUrl = getAssetUrl(imageUrl);
      if (assetUrl) {
        await deleteImage(assetUrl);
      }
    } catch (err) {
      console.warn("Storage image delete failed (non-blocking):", err.message);
      // You can choose to stop here if storage delete is critical
    }

    // ✅ Step 2: Remove image URL from DB
    const updatedDoc = await Model.findByIdAndUpdate(
      id,
      buildAssetPullQuery(fieldName, imageUrl),
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // ✅ Step 3: Done
    res.status(200).json({
      message: "Image deleted from storage and DB",
      updatedDoc,
    });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({
      message: "Error while deleting image",
      error: error.message,
    });
  }
};


exports.changeAssign = async (req, res) => {
  try {
    const { caseId, officerId, bankName, route } = req.body;

    console.log("=== CHANGE ASSIGN REQUEST ===");
    console.log("caseId:", caseId);
    console.log("officerId:", officerId);
    console.log("bankName:", bankName);
    console.log("route:", route);

    if (!caseId || !officerId) {
      return res.status(400).json({ 
        message: "caseId and officerId are required" 
      });
    }

    let updatedDoc = null;
    let foundModel = null;

    // FIRST: Search across all models to find the case (most reliable method)
    const registry = modelMap.bankRegistry || Object.values(modelMap);
    for (const bankConfig of registry) {
      const Model = bankConfig.model || bankConfig;
      const modelKey = bankConfig.key || bankConfig.modelName || "Bank";
      if (Model && Model.findById) {
        try {
          const doc = await Model.findById(caseId);
          if (doc) {
            console.log(`Found case in model: ${modelKey}`);
            updatedDoc = await Model.findByIdAndUpdate(
              caseId,
              { $set: { assignedTo: officerId } },
              { new: true }
            );
            foundModel = modelKey;
            break;
          }
        } catch (modelError) {
          continue;
        }
      }
    }

    // FALLBACK: Try using bankName if not found in first pass
    if (!updatedDoc && bankName) {
      try {
        const Model = resolveModel(bankName);
        
        if (Model) {
          console.log(`Trying bankName-derived key: ${bankName}`);
          updatedDoc = await Model.findByIdAndUpdate(
            caseId,
            { $set: { assignedTo: officerId } },
            { new: true }
          );
          
          if (updatedDoc) {
            foundModel = bankName;
            console.log(`Successfully updated via bankName: ${bankName}`);
          }
        }
      } catch (e) {
        console.error("Error with bankName conversion:", e.message);
      }
    }

    // FALLBACK: Try using route if not found
    if (!updatedDoc && route) {
      try {
        const Model = resolveModel(route);
        
        if (Model) {
          console.log(`Trying route-derived key/model`);
          updatedDoc = await Model.findByIdAndUpdate(
            caseId,
            { $set: { assignedTo: officerId } },
            { new: true }
          );
          
          if (updatedDoc) {
            foundModel = route;
            console.log(`Successfully updated via route`);
          }
        }
      } catch (e) {
        console.error("Error with route extraction:", e.message);
      }
    }

    if (!updatedDoc) {
      console.error(`Case not found - caseId: ${caseId}`);
      return res.status(404).json({ 
        message: "Case not found in any bank model",
        caseId,
        bankName,
        route
      });
    }

    res.status(200).json({
      message: "Field officer assignment updated successfully",
      success: true,
      data: updatedDoc
    });

  } catch (error) {
    console.error("Error updating field officer assignment:", error);
    res.status(500).json({
      message: "Error while updating assignment",
      error: error.message,
    });
  }
};

exports.updateCaseCustomFields = async (req, res) => {
  const { id } = req.params;
  const { customCaseId, appIdNotes, bankName } = req.body;

  let Model = null;
  if (bankName) {
    Model = resolveModel(bankName);
  }

  if (!Model) {
    const registry = modelMap.bankRegistry || Object.values(modelMap);
    for (const bankConfig of registry) {
      const M = bankConfig.model || bankConfig;
      if (M && M.findById) {
        try {
          const doc = await M.findById(id);
          if (doc) {
            Model = M;
            break;
          }
        } catch (err) {
          // ignore
        }
      }
    }
  }

  if (!Model) {
    return res.status(400).json({ error: "Case not found in any bank model." });
  }

  try {
    const updatePayload = {};
    if (customCaseId !== undefined) {
      updatePayload.customCaseId = customCaseId;
    }
    if (appIdNotes !== undefined) {
      updatePayload.appIdNotes = appIdNotes;
    }

    const updated = await Model.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update custom case fields." });
  }
};