/**
 * Cluster Helper Utility for Regional & Combined Multi-City Groupings
 */

const BJG_MEMBER_CITIES = ["bhopal", "gwalior", "jabalpur"];
const BJG_CLUSTER_ALIASES = ["combined bjg", "bjg", "combined_bjg", "central"];

const normalizeCity = (city) => {
  if (!city) return "";
  return String(city).trim().toLowerCase();
};

/**
 * Check if a city/cluster name is an alias for the BJG Cluster
 */
const isBJGCluster = (city) => {
  const norm = normalizeCity(city);
  return BJG_CLUSTER_ALIASES.includes(norm) || norm.includes("combined bjg");
};

/**
 * Check if a user belongs to the BJG cluster (either as Combined BJG or any member city)
 */
const isBJGMember = (assignedCity) => {
  const norm = normalizeCity(assignedCity);
  if (!norm) return false;
  return isBJGCluster(norm) || BJG_MEMBER_CITIES.includes(norm);
};

/**
 * Expand a city or cluster name to an array of actual city strings
 */
const resolveCities = (city) => {
  const norm = normalizeCity(city);
  if (!norm) return [];
  if (isBJGCluster(norm)) {
    return [...BJG_MEMBER_CITIES];
  }
  return [norm];
};

/**
 * Check if a given case's city matches the target filter city/cluster
 */
const matchesCity = (caseCity, filterCity) => {
  const normCaseCity = normalizeCity(caseCity);
  const normFilterCity = normalizeCity(filterCity);

  if (!normCaseCity || !normFilterCity) return false;

  if (isBJGCluster(normFilterCity)) {
    return (
      BJG_MEMBER_CITIES.some(
        (c) => normCaseCity === c || normCaseCity.includes(c)
      ) || normCaseCity.includes("bjg")
    );
  }

  return normCaseCity === normFilterCity || normCaseCity.includes(normFilterCity);
};

/**
 * Check if a user with assignedCity is allowed to view a case with caseCity
 */
const isUserAllowedCaseCity = (userAssignedCity, caseCity, userRole) => {
  if (!userRole || userRole === "SuperAdmin") return true;
  const normUserCity = normalizeCity(userAssignedCity);
  const normCaseCity = normalizeCity(caseCity);

  if (!normUserCity) return true; // Unassigned user follows default role filter
  if (!normCaseCity) return true; // Cases with no city match owner/creator rules

  if (isBJGMember(normUserCity)) {
    return (
      BJG_MEMBER_CITIES.some(
        (c) => normCaseCity === c || normCaseCity.includes(c)
      ) || normCaseCity.includes("bjg")
    );
  }

  return normCaseCity === normUserCity || normCaseCity.includes(normUserCity);
};

/**
 * Build MongoDB regex for city filtering
 */
const getCityMongoRegex = (city) => {
  const norm = normalizeCity(city);
  if (isBJGCluster(norm)) {
    return { $regex: /^\s*(bhopal|gwalior|jabalpur|combined bjg)\s*$/i };
  }
  return { $regex: new RegExp(`^\\s*${norm}\\s*$`, "i") };
};

module.exports = {
  BJG_MEMBER_CITIES,
  BJG_CLUSTER_ALIASES,
  normalizeCity,
  isBJGCluster,
  isBJGMember,
  resolveCities,
  matchesCity,
  isUserAllowedCaseCity,
  getCityMongoRegex,
};
