


// /**
//  * ─────────────────────────────────────────────────────────────────────────────
//  * ai.service.js  —  Universal Document Extraction Service
//  *
//  * Supported file types:
//  *   📄 PDF          → Gemini vision (inline base64)
//  *   🖼️  Images       → Gemini vision (inline base64) — jpg, jpeg, png, webp, gif, bmp
//  *   📊 Excel        → xlsx → structured text → Gemini text
//  *   📋 CSV          → raw text → Gemini text
//  *
//  * Public API:
//  *   extractRegistryDetails(base64, mimeType)   — PDF / images
//  *   extractFromExcel(buffer)                    — .xlsx / .xls
//  *   extractFromCsv(buffer)                      — .csv
//  * ─────────────────────────────────────────────────────────────────────────────
//  */

// const { GoogleGenAI } = require("@google/genai");
// const XLSX = require("xlsx");

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// // ─────────────────────────────────────────────────────────────────────────────
// // Shared extraction prompt — same for all file types
// // ─────────────────────────────────────────────────────────────────────────────
// const SYSTEM_INSTRUCTION = `
// You are a professional Indian property registry document extraction AI.

// STRICT RULES:
// - Return ONLY valid JSON. No explanation, no markdown, no backticks.
// - If any field is missing or not found, return null for that field.
// - Document type must be in CAPITAL LETTERS (e.g. "SALE DEED", "GIFT DEED").

// LANGUAGE RULES (VERY IMPORTANT):
// - ALL text values must be written in HINGLISH (Roman script Hindi).
// - This means: write Hindi words using English/Roman letters. Do NOT use Devanagari script.
// - Examples:
//     - "राम कुमार" → "Ram Kumar"
//     - "ग्राम पंचायत" → "Gram Panchayat"
//     - "वार्ड नंबर 5, कॉलोनी, भोपाल" → "Ward Number 5, Colony, Bhopal"
//     - "खसरा नंबर 123/1" → "Khasra Number 123/1"
//     - "पटवारी हल्का नंबर 10" → "Patwari Halka Number 10"
//     - "तहसील होशंगाबाद" → "Tehsil Hoshangabad"
//     - "जिला नर्मदापुरम" → "Jila Narmadapuram"
//     - "आवासीय" → "Aawasiya"
//     - "भूखण्ड" → "Bhukhanda"
//     - "मकान" → "Makan"
//     - "पुत्र" → "Putra"
//     - "पत्नी" → "Patni"
// - Keep English words (numbers, proper nouns already in English) as-is.
// - Convert ALL Devanagari text to Hinglish Roman script.
// `;

// const EXTRACTION_PROMPT = `\nExtract ONLY the following details from the property/registry document or data.\nThe input may be a registry document, a site visit sheet, or a bank valuation report.\n\nReturn JSON in this exact format (all text values in English):\n\n{\n  "document_type": "",\n  "registration_number": "",\n  "registration_date": "",\n\n  "seller": [ { "name": "", "relation": "" } ],\n  "buyer": [ { "name": "", "relation": "" } ],\n\n  "property": {\n    "plot_area": "",\n    "plot_dimensions": "",\n    "dimension_width": "",\n    "dimension_depth": "",\n    "property_use": "",\n    "property_type": "",\n    "property_sub_type": "",\n    "owner_name": "",\n    "applicant_name": "",\n    "contact_person": "",\n    "contact_number": "",\n    "report_remarks": "",\n    "latitude": "",\n    "longitude": "",\n    "Mobile No.": "",\n    "dateOfReport": "",\n    "duringPropertyVisit": "",\n    "LandArea": "",\n\n    "bank_specific_details": {\n      "file_no": "",\n      "lan_no": "",\n      "branch": "",\n      "loan_category": "",\n      "brq_no": ""\n    },\n\n    "structural_engineering": {\n      "steel_grade": "",\n      "concrete_grade": "",\n      "fire_exit": "",\n      "footing_type": "",\n      "no_of_lifts": "",\n      "type_of_masonry": "",\n      "seismic_zone": "",\n      "flood_prone_area": "",\n      "roof_type": ""\n    },\n\n    "infrastructure_details": {\n      "water_supply": "",\n      "electricity_available": "",\n      "electricity_distributor": "",\n      "water_distributor": "",\n      "sewer_line_connected": "",\n      "any_demolition_threat": ""\n    },\n\n    "legal_and_compliance": {\n      "jurisdiction": "",\n      "risk_of_demolition": "",\n      "is_property_in_negative_area": "",\n      "approving_authority": ""\n    },\n\n    "address": {\n      "full_address": "",\n      "plot_number": "",\n      "survey_number": "",\n      "khasra_number": "",\n      "ward_number": "",\n      "colony_area": "",\n      "village_name": "",\n      "patwari_halka_number": "",\n      "tehsil": "",\n      "district": "",\n      "state": "",\n      "pincode": "",\n      "main_locality": "",\n      "sub_locality": ""\n    },\n\n    "boundaries": {\n      "east_as_per_deed": "",\n      "west_as_per_deed": "",\n      "north_as_per_deed": "",\n      "south_as_per_deed": "",\n      "east_actual": "",\n      "west_actual": "",\n      "north_actual": "",\n      "south_actual": ""\n    },\n\n    "location_details": {\n      "micro_location": "",\n      "landmark": "",\n      "valuator_done_before": "",\n      "if_yes_when": "",\n      "locality": "",\n      "property_falling_within": "",\n      "occupancy_level": "",\n      "condition_of_site": "",\n      "distance_railway_station": "",\n      "distance_bus_stop": "",\n      "distance_plot_main_road": "",\n      "distance_city_centre": "",\n      "distance_abcl_branch": "",\n      "width_approach_road": "",\n      "physical_approach": "",\n      "legal_approach": "",\n      "other_features": "",\n      "connectivity": "",\n      "site_access": "",\n      "proximity_to_amenities": "",\n      "comments_on_property": "",\n      "adverse_factors": ""\n    },\n\n    "property_details": {\n      "occupancy": "",\n      "occupied_by": "",\n      "occupied_since": "",\n      "name_of_occupant": "",\n      "property_demarcated": "",\n      "property_identification": "",\n      "identification_through": ""\n    },\n\n    "municipal_details": {\n      "sanction_plan_provided": "",\n      "date_of_sanction": "",\n      "sanctioned_area": "",\n      "municipal_compliance": ""\n    },\n\n    "valuation_details": {\n      "plot_area_in_deed": "",\n      "plot_area_physical": "",\n      "plot_area_physical_rate": "",\n      "built_up_area_norms": "",\n      "built_up_area_norms_rate": "",\n      "built_up_area_tinshed": "",\n      "built_up_area_tinshed_rate": "",\n      "super_built_up_area": "",\n      "super_built_up_rate": "",\n      "carpet_area_plan": "",\n      "carpet_area_plan_rate": "",\n      "carpet_area_measurement": "",\n      "carpet_area_measurement_rate": "",\n      "car_park": "",\n      "car_park_rate": "",\n      "amenities_val": "",\n      "amenities_rate": "",\n      "land_rate": "",\n      "construction_rate": "",\n      "total_value": "",\n      "distress_value": "",\n      "insurance_value": "",\n      "government_value": "",\n      "completion_percentage": "",\n      "recommendation_percentage": ""\n    },\n\n    "built_up_area": {\n      "ground_floor_area": "",\n      "first_floor_area": "",\n      "total_area": "",\n      "ground_floor_deviation": "",\n      "first_floor_deviation": "",\n      "total_deviation": "",\n      "ground_floor_deviation_remarks": "",\n      "first_floor_deviation_remarks": "",\n      "ground_floor_remarks": "",\n      "first_floor_remarks": ""\n    },\n\n    "basic_details": {\n      "valuer_name": "",\n      "client_name": "",\n      "vertical": "",\n      "case_reference_number": "",\n      "initiation_date": "",\n      "visit_date": "",\n      "report_date": ""\n    },\n\n    "setbacks": {\n      "front_plan": "",\n      "front_actual": "",\n      "rear_plan": "",\n      "rear_actual": "",\n      "side1_plan": "",\n      "side1_actual": "",\n      "side2_plan": "",\n      "side2_actual": ""\n    },\n\n    "engineer_details": {\n      "visited_engineer": "",\n      "appraiser_name": "",\n      "prepared_by": "",\n      "finalized_by": ""\n    },\n\n    "accommodation_details": {\n      "total_floors": "",\n      "property_holding": "",\n      "type_of_structure": "",\n      "age_of_property": "",\n      "residual_age": "",\n      "project_category": "",\n      "flat_type": "",\n      "flat_configuration": "",\n      "area_of_flat": "",\n      "lift_facility": "",\n      "amenities": "",\n      "marketability": "",\n      "view_of_property": "",\n      "parking_facility": "",\n      "quality_of_construction": "",\n      "type_of_parking": "",\n      "shape_of_property": "",\n      "placement_of_property": "",\n      "exteriors_of_property": "",\n      "interiors_of_property": "",\n      "source_of_age": "",\n      "maintenance_of_property": "",\n      "cautious_location": "",\n      "independent_access": ""\n    },\n\n    "document_details": {\n      "sale_deed_details": "",\n      "sanctioned_plan_details": "",\n      "cc_oc_details": "",\n      "agreement_to_sale_details": "",\n      "mutation_possession_details": "",\n      "tax_receipt_details": "",\n      "electricity_bill_details": "",\n      "conversion_details": ""\n    }\n  }\n}\n\nRules:\n- CRITICAL: Extract all values SAME-TO-SAME exactly as they are written in the document. Do NOT modify, translate, or adapt the values. If the document has a choice like "Yes", "No", "Clear", "Densely Populated", or custom text, you MUST extract that exact value.\n- If a field is not found, return null.\n- Numbers can stay as numbers or English.\n- Registration date format: DD/MM/YYYY\n- Latitude and longitude, if present, should be extracted as strings (e.g., "26.285941").\n- If the data comes from Excel/CSV, look at column headers and row values carefully to map to the above JSON structure.\n- Use these aliases and contextual mapping rules to locate and extract each field accurately from the PDF, image, Excel or CSV data:\n\n  1. Address aliases:\n     - "Full Address", "Address", "Property Address", "Site Address", "Address as per Document" -> property.address.full_address\n     - "Property Address as Per TRF" -> property.address.full_address\n     - "Property Address as Per Visit" -> property.address.full_address\n     - "Property Address as Per Docs" or "Property Address as Per \"Docs\"" -> property.address.full_address\n     - "Main Locality" -> property.address.main_locality\n     - "Sub Locality" -> property.address.sub_locality\n\n  2. General Owner / Client / Contact aliases:\n     - "Name of Property Owner", "Owner Name", "Name of the Property Owner", "Property Owner Name", "Property Owner" -> property.owner_name, property.basic_details.property_owner_name\n     - "Applicant Name", "Name of Client", "Customer Name", "Name of Customer", "Name of the Client", "Client Name", "Name of applicant" -> property.applicant_name, property.basic_details.client_name\n     - "Contacted Person", "During Property Visit", "Person Met During Visit", "Person Met" -> property.contact_person\n     - "Contact No.", "Phone No.", "Mobile No." -> property.contact_number\n     - "Remarks", "Observations", "Observations Remark", "Remarks / Observations" -> property.report_remarks\n     - "Case Ref No.", "Case Reference Number", "Loan Ref No.", "Ref No", "File No" -> property.bank_specific_details.file_no, registration_number, property.basic_details.case_reference_number\n     - "LAN No", "Loan Account Number" -> property.bank_specific_details.lan_no\n     - "Branch" -> property.bank_specific_details.branch\n     - "Loan Category" -> property.bank_specific_details.loan_category\n     - "BRQ No", "BRQ Number" -> property.bank_specific_details.brq_no\n     - "Date of Report", "Report Date", "Date of report", "Report date" -> registration_date, property.basic_details.report_date when registry date is unavailable\n     - "Name of the Valuer", "Valuer Name", "Name of Valuer" -> property.basic_details.valuer_name\n     - "Initiation Date", "Date of Initiation" -> property.basic_details.initiation_date\n     - "Visit Date", "Date of Visit", "Date of visit" -> property.basic_details.visit_date\n     - "Vertical", "Segment", "Vertical Name" -> property.basic_details.vertical\n\n  3. Detailing / Valuation Table:\n     - Row "Plot Area (in Deed)": extract Area into "property.valuation_details.plot_area_in_deed"\n     - Row "Plot Area (as per physical)" or "Plot Area Physical": extract Area into "property.valuation_details.plot_area_physical", Rate into "property.valuation_details.plot_area_physical_rate"\n     - Row "Carpet Area (as per plan)" or "Carpet Area (Plan)": extract Area into "property.valuation_details.carpet_area_plan", Rate into "property.valuation_details.carpet_area_plan_rate"\n     - Row "Carpet Area (as per measurement)" or "Carpet Area (Measurement)": extract Area into "property.valuation_details.carpet_area_measurement", Rate into "property.valuation_details.carpet_area_measurement_rate"\n     - Row "Built Up Area (as per Norms)" or "Built Up Area Norms": extract Area into "property.valuation_details.built_up_area_norms", Rate into "property.valuation_details.built_up_area_norms_rate"\n     - Row "Built Up Area (TIN SHED)" or "Built Up Area Tin Shed": extract Area into "property.valuation_details.built_up_area_tinshed", Rate into "property.valuation_details.built_up_area_tinshed_rate"\n     - Row "Super Built-Up Area" or "Super Built Up Area": extract Area into "property.valuation_details.super_built_up_area", Rate into "property.valuation_details.super_built_up_rate"\n     - Row "Car Park": extract Area/Value into "property.valuation_details.car_park", Rate into "property.valuation_details.car_park_rate"\n     - Row "Amenities": extract Area/Value into "property.valuation_details.amenities_val", Rate into "property.valuation_details.amenities_rate"\n     - Row "Total Value (₹)": extract value into "property.valuation_details.total_value"\n     - Row "Distress Value (80%) (₹)": extract value into "property.valuation_details.distress_value"\n     - Row "Insurance Value (₹)": extract value into "property.valuation_details.insurance_value"\n     - Row "Government Value (₹)": extract value into "property.valuation_details.government_value"\n     - Row "Percentage Completion": extract value into "property.valuation_details.completion_percentage"\n     - Row "Percentage Recommendation": extract value into "property.valuation_details.recommendation_percentage"\n\n  4. Setbacks Table:\n     - Columns: "As per plan/Bye laws" / "Plan" vs. "Actual at site" / "Actual"\n     - Row "Front" -> "property.setbacks.front_plan" / "property.setbacks.front_actual"\n     - Row "Side1(Left)" or "Side 1" -> "property.setbacks.side1_plan" / "property.setbacks.side1_actual"\n     - Row "Side2(Right)" or "Side 2" -> "property.setbacks.side2_plan" / "property.setbacks.side2_actual"\n     - Row "Rear" -> "property.setbacks.rear_plan" / "property.setbacks.rear_actual"\n\n  5. Built Up Area Table:\n     - Row "Ground Floor": extract Area to "property.built_up_area.ground_floor_area", Deviation dropdown (Yes/No) to "property.built_up_area.ground_floor_deviation", Deviation remarks to "property.built_up_area.ground_floor_deviation_remarks", general remarks to "property.built_up_area.ground_floor_remarks".\n     - Row "FIRST FLOOR": extract Area to "property.built_up_area.first_floor_area", Deviation dropdown (Yes/No) to "property.built_up_area.first_floor_deviation", Deviation remarks to "property.built_up_area.first_floor_deviation_remarks", general remarks to "property.built_up_area.first_floor_remarks".\n     - Row "Total": extract Area to "property.built_up_area.total_area", Deviation dropdown to "property.built_up_area.total_deviation".\n\n  6. Boundaries Table:\n     - Under boundaries section, "As per docs." or "As per Document" or "Deed" maps to "east_as_per_deed", "west_as_per_deed", "north_as_per_deed", "south_as_per_deed".\n     - "As per Actual" or "Actual at site" or "Actual" maps to "east_actual", "west_actual", "north_actual", "south_actual".\n\n  7. Dimension & Type aliases:\n     - "Dimensions of the Property" or "Dimension" -> property.plot_dimensions\n     - "Width in feet" or "dimensionWidth" -> property.dimension_width\n     - "Depth in Feet" or "dimensionDepth" -> property.dimension_depth\n     - "Property Sub Type" -> property.property_sub_type\n\n  8. Engineer Details:\n     - "Name of the Engineer visited", "Engineer Visited", "Visited Engineer", "Name of Engineer Visited" -> property.engineer_details.visited_engineer\n     - "Name of Appraiser", "Appraiser Name", "Appraiser" -> property.engineer_details.appraiser_name\n     - "Report Prepared by", "Prepared by" -> property.engineer_details.prepared_by\n     - "Report Finalized by", "Finalized by" -> property.engineer_details.finalized_by\n\n  9. Structural & Infrastructure Details:\n     - "Steel Grade" -> property.structural_engineering.steel_grade\n     - "Concrete Grade" -> property.structural_engineering.concrete_grade\n     - "Type of Masonry" -> property.structural_engineering.type_of_masonry\n     - "Footing Type" -> property.structural_engineering.footing_type\n     - "Seismic Zone" -> property.structural_engineering.seismic_zone\n     - "Flood Prone Area" -> property.structural_engineering.flood_prone_area\n     - "Fire Exit" -> property.structural_engineering.fire_exit\n     - "No of Lifts", "Lifts" -> property.structural_engineering.no_of_lifts\n     - "Roof Type" -> property.structural_engineering.roof_type\n     - "Water Supply" -> property.infrastructure_details.water_supply\n     - "Electricity Available" -> property.infrastructure_details.electricity_available\n     - "Electricity Distributor" -> property.infrastructure_details.electricity_distributor\n     - "Water Distributor" -> property.infrastructure_details.water_distributor\n     - "Sewer Line Connected" -> property.infrastructure_details.sewer_line_connected\n     - "Risk of Demolition", "Any Demolition Threat" -> property.legal_and_compliance.risk_of_demolition\n     - "Jurisdiction" -> property.legal_and_compliance.jurisdiction\n     - "Property in Negative Area" -> property.legal_and_compliance.is_property_in_negative_area\n     - "Approving Authority" -> property.legal_and_compliance.approving_authority\n\n  10. Document Details Table (the table with section heading "Document Details"):\n     This section is a table with two columns: a label column and a value column.\n     Extract the value in the second column for each of the following rows:\n     - Row "Sale Deed/allotment Letter Details" or "Sale Deed Details" or "Allotment Letter" -> property.document_details.sale_deed_details\n     - Row "Sanctioned Plan Details" or "Sanction Plan" or "Approved Plan" -> property.document_details.sanctioned_plan_details\n     - Row "CC/OC Details" or "CC Details" or "OC Details" or "Completion Certificate" or "Occupancy Certificate" -> property.document_details.cc_oc_details\n     - Row "Agreement to Sale Details" or "Agreement to Sell" or "ATS" -> property.document_details.agreement_to_sale_details\n     - Row "Mutation/Possession Letter Details" or "Mutation Details" or "Possession Letter" -> property.document_details.mutation_possession_details\n     - Row "Tax Receipt Details" or "Property Tax" or "Tax Receipt" -> property.document_details.tax_receipt_details\n     - Row "Electricity Bill Details" or "Electricity Bill" or "EB Details" -> property.document_details.electricity_bill_details\n     - Row "Conversion Details" or "Land Conversion" or "Diversion" or "N.A. Order" -> property.document_details.conversion_details\n     IMPORTANT: Extract the FULL cell value as-is from the document (e.g. "12345 / 01.01.2024"). Do NOT split or modify it.\n\n- STRICT SELECT/DROPDOWN VALUE MATCHING:\n  When extracting values for fields that map to dropdown select lists, choose one of these exact values verbatim from the options list below where possible:\n  - "locality": "Well Developed", "Developing", "Under Develop", "Slum"\n  - "property_falling_within": "Municipal Corporation", "Gram Panchayat", "Town Planning Authority", "Development Authority", "Municipality"\n  - "occupancy_level": "Densely Populated", "Moderately Populated", "Low Population density"\n  - "condition_of_site": "Well Developed", "Developing", "Under Developed"\n  - "distance_plot_main_road": "Not Applicable (Prop on Md Road)", "Less than 200 m", "200 to 500 m", "above 500 m"\n  - "width_approach_road": "Width is >40 ft.", "Width 20 to 40 ft.", "Clear width <10ft", "Mud Road", "Illegal Road (Without document)"\n  - "physical_approach": "Clear", "Partially Clear", "Not Clear"\n  - "legal_approach": "Clear", "Partially Clear", "Not Clear"\n  - "property_demarcated": "Yes", "Partially", "No"\n  - "property_identification": "YES", "NO"\n  - "identification_through": "LOCAL ENQUIRY", "DOCUMENT", "BOTH"\n  - "flat_type": "Normal", "Duplex", "Penthouse"\n  - "flat_configuration": "1 BHK", "2 BHK", "3 BHK", "4 BHK", "NA"\n  - "property_holding" / "holding_type": "Freehold", "Leasehold"\n  - "lift_facility": "YES", "NO"\n  - "parking_facility": "YES", "NO"\n  - "quality_of_construction": "Class A", "Class B", "Class C"\n  - "type_of_parking": "Open CP", "Stilt CP", "Basement CP", "NA"\n  - "shape_of_property": "Regular", "Irregular"\n  - "amenities", "marketability", "exteriors_of_property", "interiors_of_property", "maintenance_of_property": "Excellent", "Good", "Average", "Poor"\n  - "ground_floor_deviation", "first_floor_deviation", "total_deviation": "No", "Yes"\n\n- If seller/buyer are not explicitly present but owner/applicant names are available in a valuation report, still fill property.owner_name and property.applicant_name.\n- If the boundaries are given separately as deed boundaries and physical/site boundaries, extract them into deed vs actual fields. If only a single list of boundaries is given, populate both deed and actual fields with those boundaries.\n`

// // ─────────────────────────────────────────────────────────────────────────────
// // Helper: parse Gemini response → clean JSON
// // ─────────────────────────────────────────────────────────────────────────────
// const parseGeminiResponse = (rawText) => {
//   let output = rawText
//     .replace(/```json\s*/gi, "")
//     .replace(/```\s*/g, "")
//     .trim();
//   return JSON.parse(output);
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // 1. PDF & IMAGE extraction — Gemini vision (multimodal)
// // ─────────────────────────────────────────────────────────────────────────────
// const extractRegistryDetails = async (base64, mimeType = "application/pdf") => {
//   try {
//     const cleanedBase64 = base64.includes("base64,")
//       ? base64.split("base64,")[1]
//       : base64;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       systemInstruction: SYSTEM_INSTRUCTION,
//       contents: [
//         {
//           role: "user",
//           parts: [
//             { text: EXTRACTION_PROMPT },
//             {
//               inlineData: {
//                 mimeType: mimeType,
//                 data: cleanedBase64,
//               },
//             },
//           ],
//         },
//       ],
//     });

//     return parseGeminiResponse(response.text);
//   } catch (error) {
//     console.error("AI PDF/Image Extraction Error:", error);
//     throw error;
//   }
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // 2. EXCEL extraction — convert xlsx/xls → structured text → Gemini
// //
// //    Strategy:
// //      a) Parse all sheets using xlsx library
// //      b) Convert each sheet to readable text table (headers + rows)
// //      c) Also try to extract any embedded images (as base64) and send them too
// //      d) Send structured text to Gemini for extraction
// // ─────────────────────────────────────────────────────────────────────────────
// const extractFromExcel = async (buffer) => {
//   try {
//     // Parse workbook from buffer
//     const workbook = XLSX.read(buffer, {
//       type: "buffer",
//       cellDates: true,      // parse dates properly
//       cellNF: true,         // keep number formats
//       cellText: true,       // keep formatted text
//     });

//     // Convert ALL sheets to readable text
//     const allSheetsText = workbook.SheetNames.map((sheetName) => {
//       const sheet = workbook.Sheets[sheetName];

//       // Get sheet data as array of arrays (AOA)
//       const aoa = XLSX.utils.sheet_to_json(sheet, {
//         header: 1,          // numeric header — gives raw rows
//         defval: "",         // empty string for missing cells
//         raw: false,         // formatted text values
//       });

//       // Filter out completely empty rows
//       const nonEmptyRows = aoa.filter((row) =>
//         row.some((cell) => cell !== "" && cell !== null && cell !== undefined)
//       );

//       if (nonEmptyRows.length === 0) return null;

//       // Convert to readable text table
//       const rowsText = nonEmptyRows
//         .map((row) => row.map((cell) => String(cell).trim()).join(" | "))
//         .join("\n");

//       return `=== SHEET: ${sheetName} ===\n${rowsText}`;
//     })
//       .filter(Boolean)
//       .join("\n\n");

//     if (!allSheetsText.trim()) {
//       throw new Error("Excel file mein koi data nahi mila.");
//     }

//     const fullPrompt = `
// The following is data extracted from an Excel file. Each sheet is separated clearly.
// Column values are separated by " | " and rows are on separate lines.

// EXCEL DATA:
// ${allSheetsText}

// ---

// ${EXTRACTION_PROMPT}
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       systemInstruction: SYSTEM_INSTRUCTION,
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: fullPrompt }],
//         },
//       ],
//     });

//     return parseGeminiResponse(response.text);
//   } catch (error) {
//     console.error("AI Excel Extraction Error:", error);
//     throw error;
//   }
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // 3. CSV extraction — read as text → Gemini
// // ─────────────────────────────────────────────────────────────────────────────
// const extractFromCsv = async (buffer) => {
//   try {
//     // Detect encoding — try UTF-8 first, fallback to latin1 for Hindi CSVs
//     let csvText;
//     try {
//       csvText = buffer.toString("utf-8");
//     } catch {
//       csvText = buffer.toString("latin1");
//     }

//     if (!csvText.trim()) {
//       throw new Error("CSV file mein koi data nahi mila.");
//     }

//     const fullPrompt = `
// The following is data from a CSV file. Columns are comma-separated and rows are on separate lines.

// CSV DATA:
// ${csvText}

// ---

// ${EXTRACTION_PROMPT}
// `;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       systemInstruction: SYSTEM_INSTRUCTION,
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: fullPrompt }],
//         },
//       ],
//     });

//     return parseGeminiResponse(response.text);
//   } catch (error) {
//     console.error("AI CSV Extraction Error:", error);
//     throw error;
//   }
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // 4. MULTI-FILE extraction — merge results from multiple files
// //    Used when user uploads several files at once (e.g. PDF + image together)
// // ─────────────────────────────────────────────────────────────────────────────
// const mergeExtractionResults = (results) => {
//   // Deep merge — later non-null values overwrite earlier null ones
//   const merged = {};

//   const deepMerge = (target, source) => {
//     Object.keys(source || {}).forEach((key) => {
//       const srcVal = source[key];
//       const tgtVal = target[key];

//       if (srcVal === null || srcVal === undefined) return; // skip nulls from source

//       if (Array.isArray(srcVal)) {
//         // Arrays: use source if target is empty
//         if (!Array.isArray(tgtVal) || tgtVal.length === 0) {
//           target[key] = srcVal;
//         }
//       } else if (typeof srcVal === "object") {
//         // Objects: recurse
//         if (!target[key] || typeof target[key] !== "object") {
//           target[key] = {};
//         }
//         deepMerge(target[key], srcVal);
//       } else {
//         // Primitives: use source if target is null/empty
//         if (tgtVal === null || tgtVal === undefined || tgtVal === "") {
//           target[key] = srcVal;
//         }
//       }
//     });
//   };

//   results.forEach((result) => deepMerge(merged, result));
//   return merged;
// };

// module.exports = {
//   extractRegistryDetails,  // PDF + images
//   extractFromExcel,         // .xlsx / .xls
//   extractFromCsv,           // .csv
//   mergeExtractionResults,   // merge multiple file results
// };




/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ai.service.js  —  Universal Document Extraction Service
 *
 * Supported file types:
 *   📄 PDF          → Gemini vision (inline base64)
 *   🖼️  Images       → Gemini vision (inline base64) — jpg, jpeg, png, webp, gif, bmp
 *   📊 Excel        → xlsx → structured text → Gemini text
 *   📋 CSV          → raw text → Gemini text
 *
 * Public API:
 *   extractRegistryDetails(base64, mimeType)   — PDF / images
 *   extractFromExcel(buffer)                    — .xlsx / .xls
 *   extractFromCsv(buffer)                      — .csv
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { GoogleGenAI } = require("@google/genai");
const XLSX = require("xlsx");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// Shared extraction prompt — same for all file types
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_INSTRUCTION = `
You are a professional Indian property registry and bank valuation report document extraction AI.

STRICT RULES:
- Return ONLY valid JSON. No explanation, no markdown, no backticks.
- If any field is missing or not found, return null for that field.
- Document type must be in CAPITAL LETTERS (e.g. "SALE DEED", "GIFT DEED", "VALUATION REPORT").

LANGUAGE & EXTRACTION RULES (CRITICAL):
- Extract the values SAME-TO-SAME exactly as they appear in the uploaded document.
- Do NOT translate, modify, paraphrase, or change any values. E.g., if the value in the document is "Clear", return "Clear". If it is "Yes", return "Yes". If it is "High Population density", return "High Population density". If it is "Densely Populated", return "Densely Populated". If it is "GP", return "GP". If it is "Gram Panchayat", return "Gram Panchayat".
- If the original text is in Devanagari script (Hindi), write it in Roman/English characters (e.g. "राम" -> "Ram"), but do NOT change or translate proper nouns/names/places.
- Do NOT use Devanagari script in the output JSON.
`;

const EXTRACTION_PROMPT = `
Extract ONLY the following details from the property/registry document or data.
The input may be a registry document, a site visit sheet, or a bank valuation report.

Return JSON in this exact format (all text values in English):

{
  "document_type": "",
  "registration_number": "",
  "registration_date": "",

  "seller": [
    {
      "name": "",
      "relation": ""
    }
  ],

  "buyer": [
    {
      "name": "",
      "relation": ""
    }
  ],

  "property": {
    "plot_area": "",
    "plot_dimensions": "",
    "dimension_width": "",
    "dimension_depth": "",
    "property_use": "",
    "property_type": "",
    "property_sub_type": "",
    "owner_name": "",
    "applicant_name": "",
    "contact_person": "",
    "contact_number": "",
    "report_remarks": "",
    "latitude": "",
    "longitude": "",
    "Mobile No.":"",
    "dateOfReport":"",
    "duringPropertyVisit":"",
    "LandArea":"",

    "address": {
      "full_address": "",
      "plot_number": "",
      "survey_number": "",
      "khasra_number": "",
      "ward_number": "",
      "colony_area": "",
      "village_name": "",
      "patwari_halka_number": "",
      "tehsil": "",
      "district": "",
      "state": "",
      "pincode": "",
      "main_locality": "",
      "sub_locality": ""
    },

    "boundaries": {
      "east_as_per_deed": "",
      "west_as_per_deed": "",
      "north_as_per_deed": "",
      "south_as_per_deed": "",
      "east_actual": "",
      "west_actual": "",
      "north_actual": "",
      "south_actual": ""
    },

    "location_details": {
      "micro_location": "",
      "landmark": "",
      "valuator_done_before": "",
      "if_yes_when": "",
      "locality": "",
      "property_falling_within": "",
      "occupancy_level": "",
      "condition_of_site": "",
      "distance_railway_station": "",
      "distance_bus_stop": "",
      "distance_plot_main_road": "",
      "distance_city_centre": "",
      "distance_abcl_branch": "",
      "width_approach_road": "",
      "physical_approach": "",
      "legal_approach": "",
      "other_features": "",
      "connectivity": "",
      "site_access": "",
      "proximity_to_amenities": "",
      "comments_on_property": "",
      "adverse_factors": ""
    },

    "property_details": {
      "occupancy": "",
      "occupied_by": "",
      "occupied_since": "",
      "name_of_occupant": "",
      "property_demarcated": "",
      "property_identification": "",
      "identification_through": ""
    },

    "municipal_details": {
      "sanction_plan_provided": "",
      "date_of_sanction": "",
      "sanctioned_area": "",
      "municipal_compliance": ""
    },

    "valuation_details": {
      "plot_area_in_deed": "",
      "plot_area_physical": "",
      "plot_area_physical_rate": "",
      "built_up_area_norms": "",
      "built_up_area_norms_rate": "",
      "built_up_area_tinshed": "",
      "built_up_area_tinshed_rate": "",
      "super_built_up_area": "",
      "super_built_up_rate": "",
      "carpet_area_plan": "",
      "carpet_area_plan_rate": "",
      "carpet_area_measurement": "",
      "carpet_area_measurement_rate": "",
      "car_park": "",
      "car_park_rate": "",
      "amenities_val": "",
      "amenities_rate": "",
      "land_rate": "",
      "construction_rate": "",
      "total_value": "",
      "distress_value": "",
      "insurance_value": "",
      "government_value": "",
      "completion_percentage": "",
      "recommendation_percentage": ""
    },

    "built_up_area": {
      "ground_floor_area": "",
      "first_floor_area": "",
      "total_area": "",
      "ground_floor_deviation": "",
      "first_floor_deviation": "",
      "total_deviation": "",
      "ground_floor_deviation_remarks": "",
      "first_floor_deviation_remarks": "",
      "ground_floor_remarks": "",
      "first_floor_remarks": ""
    },

    "basic_details": {
      "valuer_name": "",
      "client_name": "",
      "vertical": "",
      "case_reference_number": "",
      "initiation_date": "",
      "visit_date": "",
      "report_date": ""
    },

    "setbacks": {
      "front_plan": "",
      "front_actual": "",
      "rear_plan": "",
      "rear_actual": "",
      "side1_plan": "",
      "side1_actual": "",
      "side2_plan": "",
      "side2_actual": ""
    },

    "engineer_details": {
      "visited_engineer": "",
      "appraiser_name": "",
      "prepared_by": "",
      "finalized_by": ""
    },

    "accommodation_details": {
      "total_floors": "",
      "property_holding": "",
      "type_of_structure": "",
      "age_of_property": "",
      "residual_age": "",
      "project_category": "",
      "flat_type": "",
      "flat_configuration": "",
      "area_of_flat": "",
      "lift_facility": "",
      "amenities": "",
      "marketability": "",
      "view_of_property": "",
      "parking_facility": "",
      "quality_of_construction": "",
      "type_of_parking": "",
      "shape_of_property": "",
      "placement_of_property": "",
      "exteriors_of_property": "",
      "interiors_of_property": "",
      "source_of_age": "",
      "maintenance_of_property": "",
      "cautious_location": "",
      "independent_access": ""
    },

    "document_details": {
      "sale_deed_details": "",
      "sanctioned_plan_details": "",
      "cc_oc_details": "",
      "agreement_to_sale_details": "",
      "mutation_possession_details": "",
      "tax_receipt_details": "",
      "electricity_bill_details": "",
      "conversion_details": ""
    }
  }
}

Rules:
- CRITICAL: Extract all values SAME-TO-SAME exactly as they are written in the document. Do NOT modify, translate, or adapt the values. If the document has a choice like "Yes", "No", "Clear", "Densely Populated", or custom text, you MUST extract that exact value.
- If a field is not found, return null.
- Numbers can stay as numbers or English.
- Registration date format: DD/MM/YYYY
- Latitude and longitude, if present, should be extracted as strings (e.g., "26.285941").
- If the data comes from Excel/CSV, look at column headers and row values carefully to map to the above JSON structure.
- Use these aliases and contextual mapping rules to locate and extract each field accurately from the PDF, image, Excel or CSV data:

  1. Address aliases:
     - "Full Address", "Address", "Property Address", "Site Address", "Address as per Document" -> property.address.full_address
     - "Property Address as Per TRF" -> property.address.full_address
     - "Property Address as Per Visit" -> property.address.full_address
     - "Property Address as Per Docs" or "Property Address as Per \"Docs\"" -> property.address.full_address
     - "Main Locality" -> property.address.main_locality
     - "Sub Locality" -> property.address.sub_locality

  2. General Owner / Client / Contact aliases:
     - "Name of Property Owner", "Owner Name", "Name of the Property Owner", "Property Owner Name", "Property Owner" -> property.owner_name, property.basic_details.property_owner_name
     - "Applicant Name", "Name of Client", "Customer Name", "Name of Customer", "Name of the Client", "Client Name", "Name of applicant" -> property.applicant_name, property.basic_details.client_name
     - "Contacted Person", "During Property Visit", "Person Met During Visit", "Person Met" -> property.contact_person
     - "Contact No.", "Phone No.", "Mobile No." -> property.contact_number
     - "Remarks", "Observations", "Observations Remark", "Remarks / Observations" -> property.report_remarks
     - "Case Ref No.", "Case Reference Number", "Loan Ref No.", "Ref No" -> registration_number, property.basic_details.case_reference_number when registry number is unavailable
     - "Date of Report", "Report Date", "Date of report", "Report date" -> registration_date, property.basic_details.report_date when registry date is unavailable
     - "Name of the Valuer", "Valuer Name", "Name of Valuer" -> property.basic_details.valuer_name
     - "Initiation Date", "Date of Initiation" -> property.basic_details.initiation_date
     - "Visit Date", "Date of Visit", "Date of visit" -> property.basic_details.visit_date
     - "Vertical", "Segment", "Vertical Name" -> property.basic_details.vertical

  3. Detailing / Valuation Table:
     - Row "Plot Area (in Deed)": extract Area into "property.valuation_details.plot_area_in_deed"
     - Row "Plot Area (as per physical)" or "Plot Area Physical": extract Area into "property.valuation_details.plot_area_physical", Rate into "property.valuation_details.plot_area_physical_rate"
     - Row "Carpet Area (as per plan)" or "Carpet Area (Plan)": extract Area into "property.valuation_details.carpet_area_plan", Rate into "property.valuation_details.carpet_area_plan_rate"
     - Row "Carpet Area (as per measurement)" or "Carpet Area (Measurement)": extract Area into "property.valuation_details.carpet_area_measurement", Rate into "property.valuation_details.carpet_area_measurement_rate"
     - Row "Built Up Area (as per Norms)" or "Built Up Area Norms": extract Area into "property.valuation_details.built_up_area_norms", Rate into "property.valuation_details.built_up_area_norms_rate"
     - Row "Built Up Area (TIN SHED)" or "Built Up Area Tin Shed": extract Area into "property.valuation_details.built_up_area_tinshed", Rate into "property.valuation_details.built_up_area_tinshed_rate"
     - Row "Super Built-Up Area" or "Super Built Up Area": extract Area into "property.valuation_details.super_built_up_area", Rate into "property.valuation_details.super_built_up_rate"
     - Row "Car Park": extract Area/Value into "property.valuation_details.car_park", Rate into "property.valuation_details.car_park_rate"
     - Row "Amenities": extract Area/Value into "property.valuation_details.amenities_val", Rate into "property.valuation_details.amenities_rate"
     - Row "Total Value (₹)": extract value into "property.valuation_details.total_value"
     - Row "Distress Value (80%) (₹)": extract value into "property.valuation_details.distress_value"
     - Row "Insurance Value (₹)": extract value into "property.valuation_details.insurance_value"
     - Row "Government Value (₹)": extract value into "property.valuation_details.government_value"
     - Row "Percentage Completion": extract value into "property.valuation_details.completion_percentage"
     - Row "Percentage Recommendation": extract value into "property.valuation_details.recommendation_percentage"

  4. Setbacks Table:
     - Columns: "As per plan/Bye laws" / "Plan" vs. "Actual at site" / "Actual"
     - Row "Front" -> "property.setbacks.front_plan" / "property.setbacks.front_actual"
     - Row "Side1(Left)" or "Side 1" -> "property.setbacks.side1_plan" / "property.setbacks.side1_actual"
     - Row "Side2(Right)" or "Side 2" -> "property.setbacks.side2_plan" / "property.setbacks.side2_actual"
     - Row "Rear" -> "property.setbacks.rear_plan" / "property.setbacks.rear_actual"

  5. Built Up Area Table:
     - Row "Ground Floor": extract Area to "property.built_up_area.ground_floor_area", Deviation dropdown (Yes/No) to "property.built_up_area.ground_floor_deviation", Deviation remarks to "property.built_up_area.ground_floor_deviation_remarks", general remarks to "property.built_up_area.ground_floor_remarks".
     - Row "FIRST FLOOR": extract Area to "property.built_up_area.first_floor_area", Deviation dropdown (Yes/No) to "property.built_up_area.first_floor_deviation", Deviation remarks to "property.built_up_area.first_floor_deviation_remarks", general remarks to "property.built_up_area.first_floor_remarks".
     - Row "Total": extract Area to "property.built_up_area.total_area", Deviation dropdown to "property.built_up_area.total_deviation".

  6. Boundaries Table:
     - Under boundaries section, "As per docs." or "As per Document" or "Deed" maps to "east_as_per_deed", "west_as_per_deed", "north_as_per_deed", "south_as_per_deed".
     - "As per Actual" or "Actual at site" or "Actual" maps to "east_actual", "west_actual", "north_actual", "south_actual".

  7. Dimension & Type aliases:
     - "Dimensions of the Property" or "Dimension" -> property.plot_dimensions
     - "Width in feet" or "dimensionWidth" -> property.dimension_width
     - "Depth in Feet" or "dimensionDepth" -> property.dimension_depth
     - "Property Sub Type" -> property.property_sub_type

  8. Engineer Details:
     - "Name of the Engineer visited", "Engineer Visited", "Visited Engineer", "Name of Engineer Visited" -> property.engineer_details.visited_engineer
     - "Name of Appraiser", "Appraiser Name", "Appraiser" -> property.engineer_details.appraiser_name
     - "Report Prepared by", "Prepared by" -> property.engineer_details.prepared_by
     - "Report Finalized by", "Finalized by" -> property.engineer_details.finalized_by

  9. Document Details Table (the table with section heading "Document Details"):
     This section is a table with two columns: a label column and a value column.
     Extract the value in the second column for each of the following rows:
     - Row "Sale Deed/allotment Letter Details" or "Sale Deed Details" or "Allotment Letter" -> property.document_details.sale_deed_details
     - Row "Sanctioned Plan Details" or "Sanction Plan" or "Approved Plan" -> property.document_details.sanctioned_plan_details
     - Row "CC/OC Details" or "CC Details" or "OC Details" or "Completion Certificate" or "Occupancy Certificate" -> property.document_details.cc_oc_details
     - Row "Agreement to Sale Details" or "Agreement to Sell" or "ATS" -> property.document_details.agreement_to_sale_details
     - Row "Mutation/Possession Letter Details" or "Mutation Details" or "Possession Letter" -> property.document_details.mutation_possession_details
     - Row "Tax Receipt Details" or "Property Tax" or "Tax Receipt" -> property.document_details.tax_receipt_details
     - Row "Electricity Bill Details" or "Electricity Bill" or "EB Details" -> property.document_details.electricity_bill_details
     - Row "Conversion Details" or "Land Conversion" or "Diversion" or "N.A. Order" -> property.document_details.conversion_details
     IMPORTANT: Extract the FULL cell value as-is from the document (e.g. "12345 / 01.01.2024"). Do NOT split or modify it.

- STRICT SELECT/DROPDOWN VALUE MATCHING:
  When extracting values for fields that map to dropdown select lists, choose one of these exact values verbatim from the options list below where possible:
  - "locality": "Well Developed", "Developing", "Under Develop", "Slum"
  - "property_falling_within": "Municipal Corporation", "Gram Panchayat", "Town Planning Authority", "Development Authority", "Municipality"
  - "occupancy_level": "Densely Populated", "Moderately Populated", "Low Population density"
  - "condition_of_site": "Well Developed", "Developing", "Under Developed"
  - "distance_plot_main_road": "Not Applicable (Prop on Md Road)", "Less than 200 m", "200 to 500 m", "above 500 m"
  - "width_approach_road": "Width is >40 ft.", "Width 20 to 40 ft.", "Clear width <10ft", "Mud Road", "Illegal Road (Without document)"
  - "physical_approach": "Clear", "Partially Clear", "Not Clear"
  - "legal_approach": "Clear", "Partially Clear", "Not Clear"
  - "property_demarcated": "Yes", "Partially", "No"
  - "property_identification": "YES", "NO"
  - "identification_through": "LOCAL ENQUIRY", "DOCUMENT", "BOTH"
  - "flat_type": "Normal", "Duplex", "Penthouse"
  - "flat_configuration": "1 BHK", "2 BHK", "3 BHK", "4 BHK", "NA"
  - "property_holding" / "holding_type": "Freehold", "Leasehold"
  - "lift_facility": "YES", "NO"
  - "parking_facility": "YES", "NO"
  - "quality_of_construction": "Class A", "Class B", "Class C"
  - "type_of_parking": "Open CP", "Stilt CP", "Basement CP", "NA"
  - "shape_of_property": "Regular", "Irregular"
  - "amenities", "marketability", "exteriors_of_property", "interiors_of_property", "maintenance_of_property": "Excellent", "Good", "Average", "Poor"
  - "ground_floor_deviation", "first_floor_deviation", "total_deviation": "No", "Yes"

- If seller/buyer are not explicitly present but owner/applicant names are available in a valuation report, still fill property.owner_name and property.applicant_name.
- If the boundaries are given separately as deed boundaries and physical/site boundaries, extract them into deed vs actual fields. If only a single list of boundaries is given, populate both deed and actual fields with those boundaries.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Helper: parse Gemini response → clean JSON
// ─────────────────────────────────────────────────────────────────────────────
const parseGeminiResponse = (rawText) => {
  let output = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  return JSON.parse(output);
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. PDF & IMAGE extraction — Gemini vision (multimodal)
// ─────────────────────────────────────────────────────────────────────────────
const extractRegistryDetails = async (base64, mimeType = "application/pdf") => {
  try {
    const cleanedBase64 = base64.includes("base64,")
      ? base64.split("base64,")[1]
      : base64;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [
        {
          role: "user",
          parts: [
            { text: EXTRACTION_PROMPT },
            {
              inlineData: {
                mimeType: mimeType,
                data: cleanedBase64,
              },
            },
          ],
        },
      ],
    });

    return parseGeminiResponse(response.text);
  } catch (error) {
    console.error("AI PDF/Image Extraction Error:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXCEL extraction — convert xlsx/xls → structured text → Gemini
//
//    Strategy:
//      a) Parse all sheets using xlsx library
//      b) Convert each sheet to readable text table (headers + rows)
//      c) Also try to extract any embedded images (as base64) and send them too
//      d) Send structured text to Gemini for extraction
// ─────────────────────────────────────────────────────────────────────────────
const extractFromExcel = async (buffer) => {
  try {
    // Parse workbook from buffer
    const workbook = XLSX.read(buffer, {
      type: "buffer",
      cellDates: true,      // parse dates properly
      cellNF: true,         // keep number formats
      cellText: true,       // keep formatted text
    });

    // Convert ALL sheets to readable text
    const allSheetsText = workbook.SheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];

      // Get sheet data as array of arrays (AOA)
      const aoa = XLSX.utils.sheet_to_json(sheet, {
        header: 1,          // numeric header — gives raw rows
        defval: "",         // empty string for missing cells
        raw: false,         // formatted text values
      });

      // Filter out completely empty rows
      const nonEmptyRows = aoa.filter((row) =>
        row.some((cell) => cell !== "" && cell !== null && cell !== undefined)
      );

      if (nonEmptyRows.length === 0) return null;

      // Convert to readable text table
      const rowsText = nonEmptyRows
        .map((row) => row.map((cell) => String(cell).trim()).join(" | "))
        .join("\n");

      return `=== SHEET: ${sheetName} ===\n${rowsText}`;
    })
      .filter(Boolean)
      .join("\n\n");

    if (!allSheetsText.trim()) {
      throw new Error("Excel file mein koi data nahi mila.");
    }

    const fullPrompt = `
The following is data extracted from an Excel file. Each sheet is separated clearly.
Column values are separated by " | " and rows are on separate lines.

EXCEL DATA:
${allSheetsText}

---

${EXTRACTION_PROMPT}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    return parseGeminiResponse(response.text);
  } catch (error) {
    console.error("AI Excel Extraction Error:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. CSV extraction — read as text → Gemini
// ─────────────────────────────────────────────────────────────────────────────
const extractFromCsv = async (buffer) => {
  try {
    // Detect encoding — try UTF-8 first, fallback to latin1 for Hindi CSVs
    let csvText;
    try {
      csvText = buffer.toString("utf-8");
    } catch {
      csvText = buffer.toString("latin1");
    }

    if (!csvText.trim()) {
      throw new Error("CSV file mein koi data nahi mila.");
    }

    const fullPrompt = `
The following is data from a CSV file. Columns are comma-separated and rows are on separate lines.

CSV DATA:
${csvText}

---

${EXTRACTION_PROMPT}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    return parseGeminiResponse(response.text);
  } catch (error) {
    console.error("AI CSV Extraction Error:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. MULTI-FILE extraction — merge results from multiple files
//    Used when user uploads several files at once (e.g. PDF + image together)
// ─────────────────────────────────────────────────────────────────────────────
const mergeExtractionResults = (results) => {
  // Deep merge — later non-null values overwrite earlier null ones
  const merged = {};

  const deepMerge = (target, source) => {
    Object.keys(source || {}).forEach((key) => {
      const srcVal = source[key];
      const tgtVal = target[key];

      if (srcVal === null || srcVal === undefined) return; // skip nulls from source

      if (Array.isArray(srcVal)) {
        // Arrays: use source if target is empty
        if (!Array.isArray(tgtVal) || tgtVal.length === 0) {
          target[key] = srcVal;
        }
      } else if (typeof srcVal === "object") {
        // Objects: recurse
        if (!target[key] || typeof target[key] !== "object") {
          target[key] = {};
        }
        deepMerge(target[key], srcVal);
      } else {
        // Primitives: use source if target is null/empty
        if (tgtVal === null || tgtVal === undefined || tgtVal === "") {
          target[key] = srcVal;
        }
      }
    });
  };

  results.forEach((result) => deepMerge(merged, result));
  return merged;
};

module.exports = {
  extractRegistryDetails,  // PDF + images
  extractFromExcel,         // .xlsx / .xls
  extractFromCsv,           // .csv
  mergeExtractionResults,   // merge multiple file results
};
