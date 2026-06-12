// function clean(text) {
//     return text.replace(/\s+/g, " ").trim();
// }

// function extractFields(text) {
//     const data = {};
//     const t = clean(text);

//     data.customerName =
//         t.match(/Name of Applicant\s*([A-Z\s]+)/i)?.[1];

//     data.sellerName =
//         t.match(/Seller details\s*Name\s*([A-Z\s]+)/i)?.[1];

//     data.buyerName =
//         t.match(/Buyer details\s*Name\s*([A-Z\s]+)/i)?.[1];

//     data.propertyAddress =
//         t.match(/Address of Property.*?:\s*(.+?)(?=Property|Pin|$)/i)?.[1];

//     data.plotSize =
//         t.match(/(\d+\s*x\s*\d+)/i)?.[1] ||
//         t.match(/(\d+\.\d+\s*SQMT)/i)?.[1];

//     data.saleAmount =
//         t.match(/₹?\s?(\d{1,2},\d{2},\d{3})/)?.[1];

//     data.agreementDate =
//         t.match(/Date of Report\s*([\d-]+)/i)?.[1];

//     data.propertyType =
//         t.match(/Type of the Property\s*([A-Z]+)/i)?.[1];

//     const latLong = t.match(/(\d+\.\d+)\s*,\s*(\d+\.\d+)/);
//     if (latLong) {
//         data.latitude = latLong[1];
//         data.longitude = latLong[2];
//     }

//     return data;
// }

// module.exports = extractFields;



function clean(text) {
    return text.replace(/\s+/g, " ").trim();
}

function extractFields(text) {
    const t = clean(text);
    const data = {};

    // 📍 Document Type
    data.documentType =
        t.match(/Documents Provided\s*([A-Z ]+)/i)?.[1]?.toUpperCase();

    // 📍 Boundaries
    data.northBoundary = t.match(/North\s*([A-Z0-9 .-]+)/i)?.[1];
    data.southBoundary = t.match(/South\s*([A-Z0-9 .-]+)/i)?.[1];
    data.eastBoundary = t.match(/East\s*([A-Z0-9 .-]+)/i)?.[1];
    data.westBoundary = t.match(/West\s*([A-Z0-9 .-]+)/i)?.[1];

    // 📍 Dimensions
    const eastWest = t.match(/East to West\s*(\d+)/i)?.[1];
    const northSouth = t.match(/North to South\s*(\d+)/i)?.[1];

    if (eastWest && northSouth) {
        data.plotDimensions = `${eastWest} ft x ${northSouth} ft`;
    }

    // 📍 Plot Area
    data.plotArea =
        t.match(/Land Area.*?(\d+)/i)?.[1] + " sq ft" ||
        t.match(/plot area.*?(\d+)/i)?.[1] + " sq ft";

    // 📍 Address
    data.propertyAddress =
        t.match(/Address as per Site\s*(.*?)\s{2,}/i)?.[1];

    // 📍 Usage
    data.propertyUsage =
        t.match(/Approved Usages\s*([A-Z]+)/i)?.[1] ||
        t.match(/RESIDENTIAL|COMMERCIAL/i)?.[0];

    // 📍 GPS
    const gps = t.match(/(\d+\.\d+)\s*,\s*(\d+\.\d+)/);
    if (gps) {
        data.latitude = gps[1];
        data.longitude = gps[2];
    }

    return data;
}

module.exports = extractFields;
