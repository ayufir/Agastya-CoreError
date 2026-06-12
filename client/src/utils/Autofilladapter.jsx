/**
 * ─────────────────────────────────────────────────────────────────────────────
 * autoFillAdapter.js
 *
 * UNIVERSAL AutoFill Adapter — ek baar banao, har bank me use karo.
 *
 * HOW IT WORKS:
 *   AutoFillForm extractedData ko call karta hai setFormData ke saath.
 *   Ye adapter us extracted data ko BANK-SPECIFIC field names me translate karta hai.
 *
 * USAGE (kisi bhi bank component me):
 *   import { createAutoFillAdapter } from "../utils/autoFillAdapter";
 *   import { TRENCH_MAPPING } from "../config/bankFieldMappings";
 *
 *   const handleAutoFill = createAutoFillAdapter(TRENCH_MAPPING, (mapped) => {
 *     setFormData(prev => ({ ...prev, ...mapped }));
 *     form.setFieldsValue(mapped);
 *   });
 *
 *   <AutoFillForm setFormData={handleAutoFill} />
 *
 * MAPPING FORMAT:
 *   {
 *     targetFieldName: "sourceFieldFromExtractedData",
 *     // OR multiple fallback sources (first non-null wins):
 *     targetFieldName: ["source1", "source2", "source3"],
 *     // OR custom transform function:
 *     targetFieldName: (extractedData) => extractedData.someField?.toUpperCase(),
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Safely get a value from a nested object using dot-notation path.
 * @param {object} obj
 * @param {string} path - e.g. "property.address.district"
 * @param {*} defaultValue
 */
const deepGet = (obj, path, defaultValue = null) =>
    path
        .split(".")
        .reduce(
            (acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue),
            obj
        );

/**
 * Resolve a single mapping rule against extracted data.
 *
 * @param {*} rule - string | string[] | function
 * @param {object} extractedData - the raw data from AutoFillForm
 * @returns {*} resolved value or null
 */
const resolveRule = (rule, extractedData) => {
    // Function rule — custom transform
    if (typeof rule === "function") {
        try {
            const result = rule(extractedData);
            return result !== undefined && result !== "" ? result : null;
        } catch {
            return null;
        }
    }

    // Array rule — try each source key, return first non-null
    if (Array.isArray(rule)) {
        for (const key of rule) {
            const value = deepGet(extractedData, key);
            if (value !== null && value !== undefined && value !== "") {
                return value;
            }
        }
        return null;
    }

    // String rule — direct key lookup (supports dot notation)
    if (typeof rule === "string") {
        const value = deepGet(extractedData, rule);
        return value !== undefined && value !== "" ? value : null;
    }

    return null;
};

const cloneValue = (value) => {
    if (Array.isArray(value)) {
        return value.map(cloneValue);
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, nestedValue]) => [
                key,
                cloneValue(nestedValue),
            ])
        );
    }

    return value;
};

const deepMerge = (target, source) => {
    if (!source || typeof source !== "object" || Array.isArray(source)) return source;
    if (!target || typeof target !== "object" || Array.isArray(target)) target = {};
    const result = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
            result[key] = deepMerge(result[key], source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
};

export const applyMappedFields = (baseObject, mappedFields) => {
    const nextState = cloneValue(baseObject ?? {});

    Object.entries(mappedFields || {}).forEach(([targetPath, value]) => {
        if (!targetPath) return;

        const pathParts = targetPath.split(".");
        let cursor = nextState;

        for (let index = 0; index < pathParts.length - 1; index += 1) {
            const key = pathParts[index];

            if (
                cursor[key] === null ||
                cursor[key] === undefined ||
                typeof cursor[key] !== "object" ||
                Array.isArray(cursor[key])
            ) {
                cursor[key] = {};
            }

            cursor = cursor[key];
        }

        const lastPart = pathParts[pathParts.length - 1];
        if (value && typeof value === "object" && !Array.isArray(value)) {
            cursor[lastPart] = deepMerge(cursor[lastPart] || {}, value);
        } else {
            cursor[lastPart] = value;
        }
    });

    return nextState;
};

const DROPDOWN_OPTIONS = {
    // Aditya Birla
    "locationDetails.valuatorDoneBefore": ["No", "Yes"],
    "locationDetails.propertyType": ["Commercial", "Residential", "Industrial", "Institutional", "Agriculture"],
    "locationDetails.locality": ["Well Developed", "Developing", "Under Develop", "Slum"],
    "locationDetails.propertyFallingWithin": ["Municipal Corporation", "Gram Panchayat", "Town Planning Authority", "Development Authority", "Municipality"],
    "locationDetails.occupancyLevel": ["Densely Populated", "Moderately Populated", "Low Population density"],
    "locationDetails.conditionOfSite": ["Well Developed", "Developing", "Under Developed"],
    "locationDetails.distancePlotMainRoad": ["Not Applicable (Prop on Md Road)", "Less than 200 m", "200 to 500 m", "above 500 m"],
    "locationDetails.widthApproachRoad": ["Width is >40 ft.", "Width 20 to 40 ft.", "Clear width <10ft", "Mud Road", "Illegal Road (Without document)"],
    "locationDetails.physicalApproach": ["Clear", "Partially Clear", "Not Clear"],
    "locationDetails.legalApproach": ["Clear", "Partially Clear", "Not Clear"],
    "locationDetails.otherFeatures": ["YES", "NO"],
    "propertyDetails.occupancy": ["Occupied", "Vacant", "Self Occupied"],
    "propertyDetails.propertyDemarcated": ["Yes", "No"],
    "propertyDetails.propertyIdentification": ["YES", "NO"],
    "boundaryDetails.boundaryMatching": ["YES", "NO"],
    "accommodationDetails.flatType": ["Normal", "Duplex", "Penthouse"],
    "accommodationDetails.flatConfiguration": ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "NA"],
    "accommodationDetails.propertyHolding": ["Freehold", "Leasehold"],
    "accommodationDetails.liftFacility": ["YES / N", "YES", "NO"],
    "accommodationDetails.parkingFacility": ["YES / N", "YES", "NO"],
    "accommodationDetails.qualityOfConstruction": ["Class A", "Class B", "Class C"],
    "accommodationDetails.typeOfParking": ["Open CP", "Stilt CP", "Basement CP", "NA"],
    "accommodationDetails.shapeOfProperty": ["Regular", "Irregular"],
    "accommodationDetails.amenities": ["Excellent", "Good", "Average", "Poor"],
    "accommodationDetails.marketability": ["Excellent", "Good", "Average", "Poor"],
    "accommodationDetails.exteriorsOfProperty": ["Excellent", "Good", "Average", "Poor"],
    "accommodationDetails.interiorsOfProperty": ["Excellent", "Good", "Average", "Poor"],
    "accommodationDetails.maintenanceOfProperty": ["Excellent", "Good", "Average", "Poor"],
    "accommodationDetails.cautiousLocation": ["YES", "NO", "NA"],
    "builtUpArea.groundFloorDeviation": ["No", "Yes"],
    "builtUpArea.firstFloorDeviation": ["No", "Yes"],
    "builtUpArea.totalDeviation": ["No", "Yes"],

    // Manappuram
    "propertyInfo.documentProduced": ["SALEDEED", "PARTITION DEED", "GIFT DEED", "SETTLEMENT DEED", "WILL DEED", "OTHER"],
    "propertyInfo.typeOfProperty": ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "AGRICULTURAL"],
    "propertyInfo.currentUsage": ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "AGRICULTURAL", "OPEN PLOT"],
    "propertyInfo.holdingType": ["Free Hold", "Lease Hold"],
    "propertyInfo.propertyUsage": ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "AGRICULTURAL", "OPEN PLOT"],
    "propertyInfo.occupancyStatus": ["VACANT", "OCCUPIED BY OWNER", "TENANTED"],
    "propertyInfo.locationOfProperty": ["METROPOLITAN", "URBAN", "SEMI URBAN", "RURAL"],
    "siteBoundaries.boundariesTallied": ["YES", "NO"],
    "accessibility.connectivity": ["Good", "Average", "Poor"],
    "accessibility.siteAccess": ["WELL DEV", "UNDER DEV", "NO ACCESS"],
    "accessibility.withinMunicipalLimits": ["MC", "GP", "TP", "DA", "MUN"],
    "accessibility.adverseFactors": ["Yes", "No"],
    "municipalDetails.sanctionPlanProvided": ["Produced", "Not produced"],
    "municipalDetails.dateOfSanction": ["Produced", "Not produced"],
    "municipalDetails.sanctionedArea": ["Produced", "Not produced"],
    "municipalDetails.municipalCompliance": ["Produced", "Not produced"],
    "technicalDetails.independentAccess": ["Independent Access", "Common Access"],
};

const findBestMatch = (value, options) => {
    if (value === undefined || value === null || value === "") return null;
    if (!Array.isArray(options) || options.length === 0) return value;

    const cleanStr = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

    const cleanedVal = cleanStr(value);
    if (!cleanedVal) return value;

    // Direct match
    for (const opt of options) {
        if (cleanStr(opt) === cleanedVal) {
            return opt;
        }
    }

    // Custom aliases
    if (cleanedVal === "gp" || cleanedVal === "panchayat" || cleanedVal.includes("panchayat")) {
        for (const opt of options) {
            const co = cleanStr(opt);
            if (co.includes("grampanchayat") || co === "gp") return opt;
        }
    }
    if (cleanedVal === "mc" || cleanedVal === "municipalcorporation") {
        for (const opt of options) {
            const co = cleanStr(opt);
            if (co.includes("municipalcorporation") || co === "mc") return opt;
        }
    }
    if (cleanedVal === "mun" || cleanedVal === "municipality") {
        for (const opt of options) {
            const co = cleanStr(opt);
            if (co === "municipality" || co === "mun") return opt;
        }
    }

    if (cleanedVal === "y" || cleanedVal === "yes") {
        for (const opt of options) {
            const co = cleanStr(opt);
            if (co === "yes" || co === "yesn" || co === "yesno") return opt;
        }
    }
    if (cleanedVal === "n" || cleanedVal === "no") {
        for (const opt of options) {
            const co = cleanStr(opt);
            if (co === "no" || co === "yesn" || co === "yesno") return opt;
        }
    }
    if (cleanedVal === "freehold") {
        for (const opt of options) {
            if (cleanStr(opt) === "freehold") return opt;
        }
    }
    if (cleanedVal === "leasehold") {
        for (const opt of options) {
            if (cleanStr(opt) === "leasehold") return opt;
        }
    }

    // Containment match
    for (const opt of options) {
        const co = cleanStr(opt);
        if (co.includes(cleanedVal) || cleanedVal.includes(co)) {
            return opt;
        }
    }

    return value;
};

/**
 * Core adapter factory.
 *
 * @param {object} mapping       - Bank-specific field mapping config
 * @param {function} onMapped    - Callback with the mapped + filtered data object
 * @returns {function}           - A function to pass as `setFormData` to AutoFillForm
 *
 * The returned function:
 *   - Receives extracted data from AutoFillForm
 *   - Translates it using the provided mapping
 *   - Strips out null/undefined values
 *   - Calls onMapped with the clean result
 */
export const createAutoFillAdapter = (mapping, onMapped) => {
    return (extractedData) => {
        if (!extractedData || typeof extractedData !== "object") return;

        const mapped = {};

        Object.entries(mapping).forEach(([targetField, rule]) => {
            const value = resolveRule(rule, extractedData);
            if (value !== null && value !== undefined) {
                const options = DROPDOWN_OPTIONS[targetField];
                if (options) {
                    mapped[targetField] = findBestMatch(value, options);
                } else {
                    mapped[targetField] = value;
                }
            }
        });

        // Preserve all unmapped data from extractedData as well
        const finalMapped = { ...extractedData, ...mapped };

        // Strip database/metadata keys to prevent duplicate/incorrect keys on save
        const keysToStrip = ['_id', 'id', '__v', 'createdAt', 'updatedAt', 'createdBy', 'assignedTo', 'status', 'approvalStatus', 'isReportSubmitted'];
        keysToStrip.forEach(k => {
            delete finalMapped[k];
        });

        if (Object.keys(finalMapped).length > 0) {
            onMapped(finalMapped, extractedData);
        }
    };
};

export default createAutoFillAdapter;
