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

export const getDisplayAddress = (record) =>
  readRecordValue(record, [
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

export const getDisplayCity = (record) => {
  const city = readRecordValue(
    record,
    [
      "propertyCity",
      "city",
      "nearestCityTown",
      "locationDetails.mainLocality",
      "basicDetails.city",
      "propertyInfo.city",
      "summary.city",
    ],
    ""
  );

  if (city && city !== "N/A") return city;

  // Fallback: try to find common cities in address
  const address = getDisplayAddress(record).toLowerCase();
  const commonCities = ["bhopal", "indore", "jabalpur", "gwalior", "dehradun"];
  for (const c of commonCities) {
    if (address.includes(c)) return c.charAt(0).toUpperCase() + c.slice(1);
  }

  return "Other";
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

      return normalizedRoute[0] === "bank"
        ? normalizedRoute[1] || ""
        : normalizedRoute[0] || "";
    }

    if (recordOrBankName.bankSlug) {
      return String(recordOrBankName.bankSlug).trim();
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
