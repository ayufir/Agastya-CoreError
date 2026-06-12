

const extractText = require("../utils/extractText");
const extractFields = require("../utils/fieldExtractor");
const categorizePhoto = require("../utils/photoCategorizer");
const extractAI = require("../utils/ollamaExtractor");
const registryFields = require("../utils/registryFields");
const cleanText = require("../utils/cleanText");




exports.uploadDocuments = async (req, res) => {
    try {
        const files = req.files;

        let documentText = "";
        const photos = {};

        for (const file of files) {

            // 📄 Extract text from documents
            if (!file.mimetype.startsWith("image/")) {
                const text = await extractText(file.path, file.mimetype);

                if (text && text.trim()) {
                    documentText += text + "\n";
                }
            }
            // 📷 categorize photos
            else {
                const category = categorizePhoto(file.originalname);
                photos[category] = `${process.env.BACKEND_URL}/uploads/${file.filename}`;
            }
        }

        if (!documentText.trim()) {
            return res.status(400).json({ error: "No document text found" });
        }

        // ✅ Registry extraction instructions
        const extraInstructions = `
Extract registry details:

• seller & buyer name with S/O, W/O, D/O
• plot area
• plot dimensions
• four side boundaries
• full property address including:
  plot no, khasra no, ward no, tehsil, district, state, pincode
• usage of property
• document type
`;

        console.log("📄 DOCUMENT TEXT LENGTH:", documentText.length);

        // rule-based extraction
        const ruleData = extractFields(documentText);

        documentText = cleanText(documentText);

        // AI extraction (STRICT fields)
        const aiData = await extractAI(
            documentText,
            registryFields,
            extraInstructions
        );

        const finalData = { ...registryFields };

        Object.keys(finalData).forEach(key => {
            finalData[key] =
                ruleData[key] ??
                aiData[key] ??
                registryFields[key];
        });


        // merge results
        // const finalData = {
        //     ...registryFields,
        //     ...aiData,
        //     ...ruleData
        // };

        console.log("✅ FINAL DATA:", finalData);

        res.json({
            formData: finalData,
            photos,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Extraction failed" });
    }
};
