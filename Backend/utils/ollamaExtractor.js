

// require("dotenv").config();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function extractDataWithGemini(text) {
//     if (!text || text.length < 20) return {};

//     const prompt = `
// You are an AI document parser for bank loan verification. Extract the following fields from the document text. Return **ONLY valid JSON**. If a field is missing, use null. Normalize dates to YYYY-MM-DD. Convert Hindi/Hinglish to English where possible.

// Extract these fields:

// {
//   // LNT Assignment Details
//   "customerName": "",
//   "customerNo": "",
//   "propertyName": "",
//   "personMetDuringVisit": "",
//   "personContactNo": "",
//   "typeOfLoan": "",
//   "dateOfReport": "",
//   "refNo": "",
//   "evaluationType": "",
//   "unitType": "",
//   "documentsAvailable": "",
//   "latitude": "",
//   "longitude": "",

//   // General Details
//   "addressLegal": "",
//   "addressSite": "",
//   "city": "",
//   "nearbyLandmark": "",
//   "projectPinCode": "",
//   "zone": "",
//   "projectState": "",
//   "nameOnSocietyBoard": "",
//   "nameOnDoor": "",
//   "populationCensus2011": "",
//   "ruralUrban": "",
//   "statusOfOccupancy": "",
//   "occupiedBy": "",
//   "usageOfProperty": "",
//   "eraApplicable": "",
//   "ownershipType": "",
//   "numberAndDate": "",

//   // Locality & NDMA Details
//   "localityDevelopment": "",
//   "approachRoadType": "",
//   "approachRoadWidth": "",
//   "distanceFromCityCentre": "",
//   "distanceFromRailwayStation": "",
//   "distanceFromBusStand": "",
//   "distanceFromHospital": "",
//   "occupancyPercentage": "",
//   "habitationPercentage": "",
//   "proposedRoadWidening": "",
//   "cityCentreName": "",
//   "drainageConnection": "",
//   "waterElectricityConnection": "",
//   "nallahRiverHighTension": "",
//   "seismicZone": "",
//   "cycloneZone": "",
//   "landslideProneZone": "",
//   "degreeOfRisk": "",
//   "floodZone": "",
//   "crZone": "",
//   "followsNDMAGuidelines": "",
//   "localityDemolitionRisk": "",    // used in Locality step

//   // Property & Structural Details (directions flattened)
//   "northDocument": "",
//   "northActual": "",
//   "northPlan": "",
//   "southDocument": "",
//   "southActual": "",
//   "southPlan": "",
//   "eastDocument": "",
//   "eastActual": "",
//   "eastPlan": "",
//   "westDocument": "",
//   "westActual": "",
//   "westPlan": "",
//   "boundariesMatching": "",
//   "plotArea": "",
//   "isPropertyWithinLimit": "",
//   "marketability": "",
//   "typeOfStructure": "",
//   "qualityOfConstruction": "",
//   "ifQualityPoor": "",
//   "unitFlatConfiguration": "",
//   "noOfFloorsPermissible": "",
//   "noOfUnitFlatOnEachFloor": "",
//   "internalComposition": "",
//   "noOfFloorsActual": "",
//   "approxAgeOfProperty": "",
//   "constructionAsPerPlan": "",
//   "residualAge": "",
//   "constructionStatus": "",
//   "liftAvailable": "",
//   "buildingHeight": "",
//   "constructionStage": "",
//   "IfNoDetailRemak": "",
//   "propertyIsDemarcated": "",
//   "propertyEasilyIdentifiable": "",
//   "Dimension": "",

//   // Valuation Details
//   "documentLandArea": "",          // corresponds to "document" field in Valuation step
//   "landAreaPlan": "",
//   "landAreaSite": "",
//   "landAreaGF": "",
//   "builtUpAreaFF": "",
//   "builtUpAreaSF": "",
//   "existingBuiltUpGF": "",
//   "existingBuiltUpFF": "",
//   "existingBuiltUpSF": "",
//   "landAreaForValuation": "",
//   "siteArea": "",
//   "planArea": "",
//   "deedArea": "",
//   "landRate": "",
//   "constructionAreaForValuation": "",
//   "constructionRate": "",
//   "ValuationatPresentStage": "",
//   "ValuationasperGovtGuideline": "",
//   "realizableValue": "",
//   "valuationRemarks": [],

//   // Violation Observed
//   "deviationToPlan": "",
//   "deviationDetails": "",
//   "violationDemolitionRisk": "",   // used in Violation step
//   "demolitionDetails": "",
//   "encroachment": "",
//   "encroachmentDetails": ""
// }

// ----------------------------------

// Document Text:
// ${text}

// Return JSON:
// `;

//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
//         const result = await model.generateContent({
//             contents: [{ role: "user", parts: [{ text: prompt }] }],
//             generationConfig: { temperature: 0, topP: 0.95, maxOutputTokens: 4096 },
//         });

//         const raw = result.response.text();
//         console.log("RAW GEMINI RESPONSE:", raw);

//         const match = raw.match(/\{[\s\S]*\}/);
//         if (!match) return {};

//         return JSON.parse(match[0]);
//     } catch (err) {
//         console.log("GEMINI ERROR:", err.message);
//         return {};
//     }
// }

// module.exports = extractDataWithGemini;




require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractDataWithGemini(text, fields = {}, extraInstructions = "") {
    if (!text || text.length < 20) return fields;

    const fieldKeys = Object.keys(fields);

    //     const prompt = `
    // You are an expert property document parser.

    // Your task:
    // Extract ONLY the requested fields from valuation reports, sale deeds, or registry documents.

    // STRICT RULES:
    // - Return ONLY valid JSON
    // - Use EXACT field names provided
    // - If value missing → return null
    // - Do NOT add extra fields
    // - Convert Hinglish/Hindi → English
    // - Ignore irrelevant text
    // - Extract best possible meaning even if wording differs

    // SPECIAL EXTRACTION RULES:
    // • Boundaries may appear as:
    //   North / East / West / South
    //   or As per document / site visit
    // • Plot dimensions may appear like:
    //   22 x 45, 22*45, East-West & North-South
    // • Plot area may appear as land area / plot area / site area
    // • Document type MUST be returned in CAPITAL LETTERS

    // ${extraInstructions}

    // Return JSON in this exact structure:

    // ${JSON.stringify(fields, null, 2)}

    // DOCUMENT TEXT:
    // ${text}
    // `;

    const prompt = `
You are an expert property document parser.

Extract ONLY the requested fields.

STRICT RULES:
- Return ONLY valid JSON
- Use EXACT field names
- Missing → null
- Do NOT add extra fields
- Ignore irrelevant text
- Convert Hindi/Hinglish → English

==============================
DOCUMENT STRUCTURE HINTS:

This valuation or registry document may contain:

• "Documents Provided" → document type
• "Schedule of Property" → North/South/East/West boundaries
• "Plot Area Details" → plot size & dimensions
• "Address as per Site" or "Legal Address" → full address
• "Approved Usage" or "Type of Property" → property usage

BOUNDARY TABLE FORMAT:

North → boundary
South → boundary
East → boundary
West → boundary

DIMENSION FORMAT:

East to West = width
North to South = length

==============================

EXTRA INSTRUCTIONS:
${extraInstructions}

Return JSON in this exact structure:

${JSON.stringify(fields, null, 2)}

DOCUMENT TEXT:
${text}
`;


    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
        });

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0,
                maxOutputTokens: 2048,
            },
        });

        const raw = result.response.text();
        console.log("RAW AI RESPONSE:\n", raw);

        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) return fields;

        const parsed = JSON.parse(match[0]);

        const finalOutput = {};
        fieldKeys.forEach(key => {
            finalOutput[key] = parsed[key] ?? null;
        });

        return finalOutput;

    } catch (err) {
        console.log("AI ERROR:", err.message);
        return fields;
    }
}

module.exports = extractDataWithGemini;
