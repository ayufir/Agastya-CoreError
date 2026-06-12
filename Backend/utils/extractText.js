// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const pdfjsLib = require("pdfjs-dist/legacy/build/pdf");


// const { createCanvas } = require("canvas");
// const Tesseract = require("tesseract.js");
// const XLSX = require("xlsx");

// // OCR helper
// async function ocrImage(imageBuffer) {
//     try {
//         const { data } = await Tesseract.recognize(imageBuffer, "eng+hin");
//         return data.text;
//     } catch (err) {
//         console.log("OCR failed:", err.message);
//         return "";
//     }
// }

// // Extract PDF text or OCR pages
// async function extractFromPDF(filePath) {
//     const buffer = fs.readFileSync(filePath);

//     // ✅ try normal text extraction
//     const parsed = await pdfParse(buffer);
//     if (parsed.text && parsed.text.trim().length > 50) {
//         return parsed.text;
//     }

//     console.log("No text → scanning pages for images...");

//     const pdf = await pdfjsLib.getDocument(buffer).promise;
//     let fullText = "";

//     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//         const page = await pdf.getPage(pageNum);
//         const viewport = page.getViewport({ scale: 2 });

//         const canvas = createCanvas(viewport.width, viewport.height);
//         const ctx = canvas.getContext("2d");

//         await page.render({ canvasContext: ctx, viewport }).promise;

//         const imgBuffer = canvas.toBuffer();

//         // skip blank pages
//         if (imgBuffer.length < 1000) continue;

//         const text = await ocrImage(imgBuffer);
//         fullText += text + "\n";
//     }

//     return fullText;
// }

// // Extract Excel text + images
// async function extractFromExcel(filePath) {
//     const workbook = XLSX.readFile(filePath);
//     let text = "";

//     workbook.SheetNames.forEach(name => {
//         const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
//         text += JSON.stringify(sheet) + "\n";
//     });

//     // extract embedded images if present
//     if (workbook.media) {
//         for (const img of workbook.media) {
//             const ocrText = await ocrImage(img.data);
//             text += ocrText + "\n";
//         }
//     }

//     return text;
// }

// async function extractText(filePath, mimetype) {
//     if (mimetype === "application/pdf") {
//         return await extractFromPDF(filePath);
//     }

//     if (mimetype.startsWith("image/")) {
//         return await ocrImage(filePath);
//     }

//     if (mimetype.includes("sheet")) {
//         return await extractFromExcel(filePath);
//     }

//     return "";
// }

// module.exports = extractText;



const fs = require("fs");
const pdfParse = require("pdf-parse");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf");
const { createCanvas } = require("canvas");
const Tesseract = require("tesseract.js");
const XLSX = require("xlsx");

async function ocrImage(buffer) {
    try {
        const { data } = await Tesseract.recognize(buffer, "eng+hin", {
            logger: m => { }
        });
        return data.text;
    } catch (err) {
        console.log("OCR failed:", err.message);
        return "";
    }
}

async function extractFromPDF(filePath) {
    const buffer = fs.readFileSync(filePath);

    const parsed = await pdfParse(buffer);

    // ✅ If PDF contains real text
    if (parsed.text && parsed.text.trim().length > 50) {
        return parsed.text;
    }

    console.log("📄 Scanned PDF detected → running OCR...");

    const pdf = await pdfjsLib.getDocument(buffer).promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = createCanvas(viewport.width, viewport.height);
        const ctx = canvas.getContext("2d");

        await page.render({ canvasContext: ctx, viewport }).promise;

        const imgBuffer = canvas.toBuffer();

        if (imgBuffer.length < 5000) continue;

        const text = await ocrImage(imgBuffer);
        fullText += text + "\n";
    }

    return fullText;
}

async function extractFromExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    let text = "";

    workbook.SheetNames.forEach(name => {
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
        text += JSON.stringify(sheet) + "\n";
    });

    return text;
}

async function extractText(filePath, mimetype) {
    if (mimetype === "application/pdf") {
        return await extractFromPDF(filePath);
    }

    if (mimetype.startsWith("image/")) {
        const buffer = fs.readFileSync(filePath);
        return await ocrImage(buffer);
    }

    if (mimetype.includes("sheet")) {
        return await extractFromExcel(filePath);
    }

    return "";
}

module.exports = extractText;
