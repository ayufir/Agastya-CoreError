import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Reusable Input component
const Input = ({ label, name, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <input
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full border p-2 rounded mt-1"
        />
    </div>
);

// Section wrapper
const Section = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
);

const ValuationForm = () => {
    const [formData, setFormData] = useState({});
    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Helper to download a file from blob
    const downloadFile = (file, fileName) => {
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Image handlers
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages((prev) => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    // Document handlers
    const handleDocumentUpload = (e) => {
        const files = Array.from(e.target.files);
        const newDocs = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
        }));
        setDocuments((prev) => [...prev, ...newDocs]);
    };

    const removeDocument = (index) => {
        setDocuments((prev) => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    // Download all images as a zip
    const downloadAllImages = async () => {
        if (images.length === 0) {
            alert("No images to download.");
            return;
        }

        const zip = new JSZip();
        const imgFolder = zip.folder("images");

        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const arrayBuffer = await img.file.arrayBuffer();
            imgFolder.file(img.file.name, arrayBuffer);
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "all_images.zip");
    };

    // Download all documents as a zip
    const downloadAllDocuments = async () => {
        if (documents.length === 0) {
            alert("No documents to download.");
            return;
        }

        const zip = new JSZip();
        const docFolder = zip.folder("documents");

        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            const arrayBuffer = await doc.file.arrayBuffer();
            docFolder.file(doc.file.name, arrayBuffer);
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "all_documents.zip");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        console.log("Images:", images);
        console.log("Documents:", documents);

        // Clear all fields
        setFormData({});
        // Revoke all image URLs
        images.forEach((img) => URL.revokeObjectURL(img.preview));
        setImages([]);
        // Revoke all document URLs
        documents.forEach((doc) => URL.revokeObjectURL(doc.preview));
        setDocuments([]);

        alert("All 137 Fields + Documents Submitted Successfully");
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">
                COMPLETE VALUATION REPORT
            </h1>

            {/* 1 GENERAL DETAILS */}
            <Section title="1. General Details">
                <Input label="Vendor Name" name="vendorName" value={formData.vendorName} onChange={handleChange} />
                <Input label="Loan Account No" name="loanAccountNo" value={formData.loanAccountNo} onChange={handleChange} />
                <Input label="Date" name="date" value={formData.date} onChange={handleChange} />
                <Input label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleChange} />
                <Input label="Geo Coordinates" name="geoCoordinates" value={formData.geoCoordinates} onChange={handleChange} />
            </Section>

            {/* 2 PROPERTY OVERVIEW */}
            <Section title="2. Property Overview">
                <Input label="Property Category" name="propertyCategory" value={formData.propertyCategory} onChange={handleChange} />
                <Input label="Property Type" name="propertyType" value={formData.propertyType} onChange={handleChange} />
                <Input label="Type of Loan" name="typeOfLoan" value={formData.typeOfLoan} onChange={handleChange} />
                <Input label="Property Location" name="propertyLocation" value={formData.propertyLocation} onChange={handleChange} />
                <Input label="Population" name="population" value={formData.population} onChange={handleChange} />
                <Input label="Rural / Urban" name="ruralUrban" value={formData.ruralUrban} onChange={handleChange} />
                <Input label="Zone" name="zone" value={formData.zone} onChange={handleChange} />
                <Input label="Property Area Limits" name="propertyAreaLimits" value={formData.propertyAreaLimits} onChange={handleChange} />
                <Input label="RERA No" name="reraNo" value={formData.reraNo} onChange={handleChange} />
            </Section>

            {/* 3 VISIT DETAILS */}
            <Section title="3. Visit Details">
                <Input label="Applicant Name" name="applicantName" value={formData.applicantName} onChange={handleChange} />
                <Input label="Mobile No" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
                <Input label="Person Met at Site" name="personMet" value={formData.personMet} onChange={handleChange} />
                <Input label="Relationship" name="relationship" value={formData.relationship} onChange={handleChange} />
                <Input label="Owner 1" name="owner1" value={formData.owner1} onChange={handleChange} />
                <Input label="Owner 2" name="owner2" value={formData.owner2} onChange={handleChange} />
                <Input label="Owner Source" name="ownerSource" value={formData.ownerSource} onChange={handleChange} />
                <Input label="Documents Available" name="documentsAvailable" value={formData.documentsAvailable} onChange={handleChange} />
                <Input label="Society Board Name" name="societyBoard" value={formData.societyBoard} onChange={handleChange} />
                <Input label="Legal Address" name="legalAddress" value={formData.legalAddress} onChange={handleChange} />
                <Input label="Site Address" name="siteAddress" value={formData.siteAddress} onChange={handleChange} />
                <Input label="Name on Door" name="nameOnDoor" value={formData.nameOnDoor} onChange={handleChange} />
                <Input label="Landmark" name="landmark" value={formData.landmark} onChange={handleChange} />
                <Input label="Occupancy" name="occupancy" value={formData.occupancy} onChange={handleChange} />
                <Input label="Occupied By" name="occupiedBy" value={formData.occupiedBy} onChange={handleChange} />
                <Input label="Usage" name="usage" value={formData.usage} onChange={handleChange} />
                <Input label="Property Identifiable" name="identifiable" value={formData.identifiable} onChange={handleChange} />
            </Section>

            {/* 4 LOCALITY */}
            <Section title="4. Locality">
                <Input label="Nearest City" name="nearestCity" value={formData.nearestCity} onChange={handleChange} />
                <Input label="Location Category" name="locationCategory" value={formData.locationCategory} onChange={handleChange} />
                <Input label="Distance from City Centre" name="distanceCityCenter" value={formData.distanceCityCenter} onChange={handleChange} />
                <Input label="Distance Railway" name="railway" value={formData.railway} onChange={handleChange} />
                <Input label="Distance Bus Stand" name="busStand" value={formData.busStand} onChange={handleChange} />
                <Input label="Distance Hospital" name="hospital" value={formData.hospital} onChange={handleChange} />
                <Input label="Road Width" name="roadWidth" value={formData.roadWidth} onChange={handleChange} />
                <Input label="Road Type" name="roadType" value={formData.roadType} onChange={handleChange} />
                <Input label="Occupancy in Project %" name="occupancyProject" value={formData.occupancyProject} onChange={handleChange} />
            </Section>

            {/* 5 NEGATIVE MARKERS */}
            <Section title="5. Negative Markers">
                <Input label="Negative Markers" name="negativeMarkers" value={formData.negativeMarkers} onChange={handleChange} />
                <Input label="Electricity Available" name="electricity" value={formData.electricity} onChange={handleChange} />
                <Input label="Water Available" name="water" value={formData.water} onChange={handleChange} />
                <Input label="Drainage Available" name="drainage" value={formData.drainage} onChange={handleChange} />
            </Section>

            {/* 6 PROPERTY PLAN */}
            <Section title="6. Property Plan">
                <Input label="NA Conversion Order" name="naConversion" value={formData.naConversion} onChange={handleChange} />
                <Input label="NA Order Number" name="naOrderNumber" value={formData.naOrderNumber} onChange={handleChange} />
                <Input label="NA Order Date" name="naOrderDate" value={formData.naOrderDate} onChange={handleChange} />
                <Input label="Layout Approved By" name="layoutApprovedBy" value={formData.layoutApprovedBy} onChange={handleChange} />
                <Input label="Layout Plan Number" name="layoutNumber" value={formData.layoutNumber} onChange={handleChange} />
                <Input label="Layout Date" name="layoutDate" value={formData.layoutDate} onChange={handleChange} />
                <Input label="Layout License No" name="layoutLicense" value={formData.layoutLicense} onChange={handleChange} />
                <Input label="Building Approved By" name="buildingApprovedBy" value={formData.buildingApprovedBy} onChange={handleChange} />
                <Input label="Building Plan Number" name="buildingNumber" value={formData.buildingNumber} onChange={handleChange} />
                <Input label="Building Plan Date" name="buildingDate" value={formData.buildingDate} onChange={handleChange} />
                <Input label="Commencement Approved By" name="commencementApprovedBy" value={formData.commencementApprovedBy} onChange={handleChange} />
                <Input label="Commencement Number" name="commencementNumber" value={formData.commencementNumber} onChange={handleChange} />
                <Input label="Commencement Date" name="commencementDate" value={formData.commencementDate} onChange={handleChange} />
                <Input label="Occupancy Approved By" name="occupancyApprovedBy" value={formData.occupancyApprovedBy} onChange={handleChange} />
                <Input label="Occupancy Number" name="occupancyNumber" value={formData.occupancyNumber} onChange={handleChange} />
                <Input label="Occupancy Date" name="occupancyDate" value={formData.occupancyDate} onChange={handleChange} />
                <Input label="Sub Plot Approved By" name="subPlotApprovedBy" value={formData.subPlotApprovedBy} onChange={handleChange} />
                <Input label="Sub Plot Number" name="subPlotNumber" value={formData.subPlotNumber} onChange={handleChange} />
                <Input label="Sub Plot Date" name="subPlotDate" value={formData.subPlotDate} onChange={handleChange} />
            </Section>

            {/* 7 NDMA */}
            <Section title="7. NDMA Guidelines">
                <Input label="Seismic Zone" name="seismicZone" value={formData.seismicZone} onChange={handleChange} />
                <Input label="Flood Zone" name="floodZone" value={formData.floodZone} onChange={handleChange} />
                <Input label="Cyclone Zone" name="cycloneZone" value={formData.cycloneZone} onChange={handleChange} />
                <Input label="Landslide Zone" name="landslideZone" value={formData.landslideZone} onChange={handleChange} />
                <Input label="CR Zone" name="crZone" value={formData.crZone} onChange={handleChange} />
                <Input label="Demolition Risk" name="demolitionRisk" value={formData.demolitionRisk} onChange={handleChange} />
                <Input label="Demolition Details" name="demolitionDetails" value={formData.demolitionDetails} onChange={handleChange} />
                <Input label="Follows NDMA" name="ndmaFollow" value={formData.ndmaFollow} onChange={handleChange} />
            </Section>

            {/* 8 BOUNDARIES */}
            <Section title="8. Boundaries">
                <Input label="North (Doc)" name="northDoc" value={formData.northDoc} onChange={handleChange} />
                <Input label="South (Doc)" name="southDoc" value={formData.southDoc} onChange={handleChange} />
                <Input label="East (Doc)" name="eastDoc" value={formData.eastDoc} onChange={handleChange} />
                <Input label="West (Doc)" name="westDoc" value={formData.westDoc} onChange={handleChange} />
                <Input label="North (Site)" name="northSite" value={formData.northSite} onChange={handleChange} />
                <Input label="South (Site)" name="southSite" value={formData.southSite} onChange={handleChange} />
                <Input label="East (Site)" name="eastSite" value={formData.eastSite} onChange={handleChange} />
                <Input label="West (Site)" name="westSite" value={formData.westSite} onChange={handleChange} />
                <Input label="Boundary Match" name="boundaryMatch" value={formData.boundaryMatch} onChange={handleChange} />
                <Input label="Demarcated" name="demarcated" value={formData.demarcated} onChange={handleChange} />
                <Input label="Boundary Remarks" name="boundaryRemarks" value={formData.boundaryRemarks} onChange={handleChange} />
                <Input label="Marketability" name="marketability" value={formData.marketability} onChange={handleChange} />
            </Section>

            {/* 9 STRUCTURAL */}
            <Section title="9. Structural Details">
                <Input label="Structure Type" name="structureType" value={formData.structureType} onChange={handleChange} />
                <Input label="Roof Type" name="roofType" value={formData.roofType} onChange={handleChange} />
                <Input label="Floors Permissible" name="floorsPermissible" value={formData.floorsPermissible} onChange={handleChange} />
                <Input label="Floors Actual" name="floorsActual" value={formData.floorsActual} onChange={handleChange} />
                <Input label="Units Per Floor" name="units" value={formData.units} onChange={handleChange} />
                <Input label="Quality" name="quality" value={formData.quality} onChange={handleChange} />
                <Input label="Age" name="age" value={formData.age} onChange={handleChange} />
                <Input label="Residual Age" name="residualAge" value={formData.residualAge} onChange={handleChange} />
                <Input label="Land Area" name="landArea" value={formData.landArea} onChange={handleChange} />
                <Input label="Linear Dimension" name="linearDimension" value={formData.linearDimension} onChange={handleChange} />
            </Section>

            {/* 10 VIOLATION */}
            <Section title="10. Violation Observed">
                <Input label="Demolition Violation" name="demolitionViolation" value={formData.demolitionViolation} onChange={handleChange} />
                <Input label="Violation Remarks" name="violationRemarks" value={formData.violationRemarks} onChange={handleChange} />
                <Input label="Encroachment" name="encroachment" value={formData.encroachment} onChange={handleChange} />
                <Input label="Encroachment Remarks" name="encroachmentRemarks" value={formData.encroachmentRemarks} onChange={handleChange} />
            </Section>

            {/* 11 VALUATION */}
            <Section title="11. Valuation (L1 / L2 / L3)">
                <Input label="Land Area L1" name="landAreaL1" value={formData.landAreaL1} onChange={handleChange} />
                <Input label="Land Rate L1" name="landRateL1" value={formData.landRateL1} onChange={handleChange} />
                <Input label="Land Value L1" name="landValueL1" value={formData.landValueL1} onChange={handleChange} />
                <Input label="Land Area L2" name="landAreaL2" value={formData.landAreaL2} onChange={handleChange} />
                <Input label="Land Rate L2" name="landRateL2" value={formData.landRateL2} onChange={handleChange} />
                <Input label="Land Value L2" name="landValueL2" value={formData.landValueL2} onChange={handleChange} />
                <Input label="Land Area L3" name="landAreaL3" value={formData.landAreaL3} onChange={handleChange} />
                <Input label="Land Rate L3" name="landRateL3" value={formData.landRateL3} onChange={handleChange} />
                <Input label="Land Value L3" name="landValueL3" value={formData.landValueL3} onChange={handleChange} />
                <Input label="Construction Area L1" name="constAreaL1" value={formData.constAreaL1} onChange={handleChange} />
                <Input label="Construction Rate L1" name="constRateL1" value={formData.constRateL1} onChange={handleChange} />
                <Input label="Construction Value L1" name="constValueL1" value={formData.constValueL1} onChange={handleChange} />
                <Input label="Construction Area L2" name="constAreaL2" value={formData.constAreaL2} onChange={handleChange} />
                <Input label="Construction Rate L2" name="constRateL2" value={formData.constRateL2} onChange={handleChange} />
                <Input label="Construction Value L2" name="constValueL2" value={formData.constValueL2} onChange={handleChange} />
                <Input label="Construction Area L3" name="constAreaL3" value={formData.constAreaL3} onChange={handleChange} />
                <Input label="Construction Rate L3" name="constRateL3" value={formData.constRateL3} onChange={handleChange} />
                <Input label="Construction Value L3" name="constValueL3" value={formData.constValueL3} onChange={handleChange} />
                <Input label="Amenities" name="amenities" value={formData.amenities} onChange={handleChange} />
                <Input label="Amenities Value" name="amenitiesValue" value={formData.amenitiesValue} onChange={handleChange} />
                <Input label="Lift Available" name="lift" value={formData.lift} onChange={handleChange} />
                <Input label="Building Height" name="buildingHeight" value={formData.buildingHeight} onChange={handleChange} />
                <Input label="Realizable Value" name="realizableValue" value={formData.realizableValue} onChange={handleChange} />
                <Input label="Construction Stage" name="constructionStage" value={formData.constructionStage} onChange={handleChange} />
                <Input label="Construction %" name="constructionPercent" value={formData.constructionPercent} onChange={handleChange} />
                <Input label="Current Stage Value" name="currentStageValue" value={formData.currentStageValue} onChange={handleChange} />
                <Input label="Govt Guideline Value" name="govtGuidelineValue" value={formData.govtGuidelineValue} onChange={handleChange} />
                <Input label="Estimate Customer" name="estimateCustomer" value={formData.estimateCustomer} onChange={handleChange} />
                <Input label="Estimate Recommended" name="estimateRecommended" value={formData.estimateRecommended} onChange={handleChange} />
                <Input label="Market Rate" name="marketRate" value={formData.marketRate} onChange={handleChange} />
                <Input label="As Per Plan" name="asPerPlan" value={formData.asPerPlan} onChange={handleChange} />
            </Section>

            {/* 12 IMAGES SECTION */}
            <Section title="12. Property Photos">
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mb-2"
                    />
                    <button
                        type="button"
                        onClick={downloadAllImages}
                        className="bg-purple-600 text-white px-4 py-2 rounded text-sm"
                    >
                        Download All Images as ZIP
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative border rounded p-2">
                            <img
                                src={img.preview}
                                alt={`Upload ${index}`}
                                className="h-32 w-full object-cover rounded"
                            />
                            <div className="flex justify-between mt-2">
                                {/* <button
                                    type="button"
                                    onClick={() => downloadFile(img.file, img.file.name)}
                                    className="bg-green-600 text-white px-2 py-1 text-xs rounded"
                                >
                                    Download
                                </button> */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* 13 DOCUMENTS SECTION */}
            <Section title="13. Supporting Documents">
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        multiple
                        accept="*/*"
                        onChange={handleDocumentUpload}
                        className="mb-2"
                    />
                    <button
                        type="button"
                        onClick={downloadAllDocuments}
                        className="bg-purple-600 text-white px-4 py-2 rounded text-sm"
                    >
                        Download All Documents as ZIP
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between border p-3 rounded">
                            <span className="truncate text-sm font-medium">{doc.name}</span>
                            <div className="flex space-x-2">
                                {/* <button
                                    type="button"
                                    onClick={() => downloadFile(doc.file, doc.name)}
                                    className="bg-green-600 text-white px-3 py-1 text-xs rounded"
                                >
                                    Download
                                </button> */}
                                <button
                                    type="button"
                                    onClick={() => removeDocument(index)}
                                    className="bg-red-600 text-white px-3 py-1 text-xs rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* 14 OBSERVATIONS */}
            <Section title="14. Observations">
                <textarea
                    name="observations"
                    value={formData.observations || ""}
                    onChange={handleChange}
                    className="w-full border p-3 rounded col-span-2"
                    rows="4"
                />
            </Section>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg">
                Submit Complete Report
            </button>
        </form>
    );
};

export default ValuationForm;