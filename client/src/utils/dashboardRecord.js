const readPathValue = (record, path) =>
  String(path)
    .split(".")
    .reduce(
      (accumulator, key) =>
        accumulator && accumulator[key] !== undefined
          ? accumulator[key]
          : undefined,
      record
    );

export const readRecordValue = (record, paths, fallback = "N/A") => {
  for (const path of paths) {
    if (!path) continue;

    const value = readPathValue(record, path);
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
};

export const getDisplayCustomerName = (record) =>
  readRecordValue(record, [
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

export const getDisplayAddress = (record) => {
  if (record && typeof record === "object") {
    const components = [
      record.plotNo,
      record.streetName,
      record.locality,
      record.landmark,
      record.projectSocietyName || record.buildingWingName,
      record.village || record.taluka,
      record.city || record.propertyCity,
      record.pincode,
    ].filter((c) => c && c !== "N/A" && c !== "undefined" && String(c).trim() !== "");

    if (components.length > 0) {
      const fullBuilt = components.join(", ");
      // If detailed address parts are filled, return the full built address
      if (record.plotNo || record.streetName || record.locality || record.landmark) {
        return fullBuilt;
      }
    }
  }

  const primary = readRecordValue(record, [
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
  ], "");

  if (primary && primary !== "N/A") {
    // If primary address is just equal to city name but we have components, return full components
    if (record && typeof record === "object") {
      const components = [
        record.plotNo,
        record.streetName,
        record.locality,
        record.landmark,
        record.projectSocietyName || record.buildingWingName,
        record.village || record.taluka,
        record.city || record.propertyCity,
        record.pincode,
      ].filter((c) => c && c !== "N/A" && c !== "undefined" && String(c).trim() !== "");
      if (components.length > 1) {
        return components.join(", ");
      }
    }
    return primary;
  }

  return "N/A";
};

export const getDisplayContact = (record) =>
  readRecordValue(record, [
    "customerNo",
    "contactNumber",
    "mobileNo",
    "personContactNo",
    "personContact",
    "contactPerson",
    "contactPersonNumber",
    "header.contactedPerson",
  ]);

export const getDisplayCity = (record, fallback = "") => {
  const city = readRecordValue(
    record,
    [
      "city",
      "propertyCity",
      "assignedCity",
      "nearestCityTown",
      "locationDetails.mainLocality",
      "basicDetails.city",
      "propertyInfo.city",
      "summary.city",
      "district",
      "assignedTo.assignedCity",
    ],
    ""
  );

  if (city && city !== "N/A") {
    const trimmed = String(city).trim();
    const lower = trimmed.toLowerCase();
    if (lower === "bhopal") return "Bhopal";
    if (lower === "gwalior") return "Gwalior";
    if (lower === "jabalpur") return "Jabalpur";
    if (lower === "indore") return "Indore";
    if (lower === "dehradun") return "Dehradun";
    if (lower.includes("combined") || lower.includes("bjg")) return "Combined BJG";
    return trimmed
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  // Fallback: try to find common cities in address
  const address = getDisplayAddress(record).toLowerCase();
  const commonCities = ["bhopal", "indore", "jabalpur", "gwalior", "dehradun"];
  for (const c of commonCities) {
    if (address.includes(c)) return c.charAt(0).toUpperCase() + c.slice(1);
  }

  return fallback || record?.assignedCity || record?.assignedTo?.assignedCity || "N/A";
};

export const BJG_CITIES = ["Bhopal", "Jabalpur", "Gwalior"];

export const isBJGMember = (assignedCity) => {
  const norm = String(assignedCity || "").toLowerCase().trim();
  return ["bhopal", "gwalior", "jabalpur", "combined bjg", "bjg"].includes(norm);
};

export const getCityTagColor = (cityName) => {
  const norm = String(cityName || "").toLowerCase().trim();
  if (norm.includes("bhopal")) return "blue";
  if (norm.includes("gwalior")) return "green";
  if (norm.includes("jabalpur")) return "purple";
  if (norm.includes("indore")) return "orange";
  if (norm.includes("dehradun")) return "cyan";
  if (norm.includes("combined") || norm.includes("bjg")) return "gold";
  return "default";
};

const BANK_ROUTE_ALIASES = {
  homefirst: "home-first",
  homefirstbank: "home-first",
  "home first": "home-first",
  "home first bank": "home-first",
  "home first finance": "home-first",
  homefirsttrench: "home-first-trench",
  homefirsttranche: "home-first-trench",
  "home first trench": "home-first-trench",
  "home first tranche": "home-first-trench",
  "home first tranche bank": "home-first-trench",
  icici: "icici",
  "icici bank": "icici",
  "icici ltd": "icici",
  aditya: "aditya",
  "aditya bank": "aditya",
  "aditya birla": "aditya-birla",
  "aditya birla bank": "aditya-birla",
  "aditya birla housing": "aditya-birla",
  "aditya birla housing finance": "aditya-birla",
  adityabirla: "aditya-birla",
  manappuram: "manappuram",
  "manappuram bank": "manappuram",
  "manapuram bank": "manappuram",
  "manappuram finance": "manappuram",
  piramal: "piramal",
  "piramal bank": "piramal",
  primal: "piramal",
  "primal bank": "piramal",
  sundaram: "sundaram",
  "sundaram bank": "sundaram",
  chola: "chola",
  "chola bank": "chola",
  agriwise: "agriwise",
  "agriwise bank": "agriwise",
  herofincorp: "hero-fincorp",
  "hero fincorp": "hero-fincorp",
  "hero fincorp bank": "hero-fincorp",
  piramalnpa: "piramalnpa-form",
  "piramal npa": "piramalnpa-form",
  "piramal npa bank": "piramalnpa-form",
  samasta: "samasta",
  "samasta bank": "samasta",
  federal: "federal-bank",
  "federal bank": "federal-bank",
  fedral: "federal-bank",
  "fedral bank": "federal-bank",
  profectus: "profectus",
  "profectus bank": "profectus",
  protium: "protium",
  "protium bank": "protium",
  idfc: "idfc-first-bank",
  "idfc bank": "idfc-first-bank",
  "idfc first bank": "idfc-first-bank",
  bajaj: "bajaj",
  "bajaj bank": "bajaj",
  bajajhousing: "bajaj-housing",
  "bajaj housing": "bajaj-housing",
  "bajaj housing finance": "bajaj-housing",
  "bajaj housing finance bank": "bajaj-housing",
  bajajameriya: "bajaj-ameriya-bank",
  "bajaj ameriya bank": "bajaj-ameriya-bank",
  dmifinance: "dmi-finance",
  "dmi finance": "dmi-finance",
  "dmi finance bank": "dmi-finance",
  icicihfc: "icici-hfc",
  "icici hfc": "icici-hfc",
  "icici hfc bank": "icici-hfc",
};

export const getBankRoute = (recordOrBankName) => {
  if (recordOrBankName && typeof recordOrBankName === "object") {
    if (recordOrBankName.route) {
      const normalizedRoute = String(recordOrBankName.route)
        .replace(/^\/+|\/+$/g, "")
        .split("/");

      const rawRoute =
        normalizedRoute[0] === "bank"
          ? normalizedRoute[1] || ""
          : normalizedRoute[0] || "";
      const lower = rawRoute.toLowerCase().trim();
      return BANK_ROUTE_ALIASES[lower] || rawRoute;
    }

    if (recordOrBankName.bankSlug) {
      const rawSlug = String(recordOrBankName.bankSlug).trim();
      const lower = rawSlug.toLowerCase();
      return BANK_ROUTE_ALIASES[lower] || rawSlug;
    }
  }

  const source =
    typeof recordOrBankName === "string"
      ? recordOrBankName
      : recordOrBankName?.bankName || recordOrBankName?.bank || "";

  const normalized = source.toLowerCase().trim();
  return (
    BANK_ROUTE_ALIASES[normalized] ||
    normalized.replace(/\s+/g, "-").replace(/-bank$/, "")
  );
};
