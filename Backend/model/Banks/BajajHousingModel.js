// models/Banks/BajajHousingModel.js
const mongoose = require("mongoose");
// import mongoose from "mongoose";

const BajajHousingSchema = new mongoose.Schema(
    {
        bankName: { type: String, default: "Bajaj Housing Finance" },
        status: { type: String, default: "Pending" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        route: { type: String },

        approvalStatus: { type: String, default: "Pending" },
        isReportSubmitted: { type: Boolean, default: false },


        timeline: [
            {
                status: String,
                updatedAt: { type: Date, default: Date.now },
                updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                note: String,
            },
        ],

        // ── STEP 1: APPLICANT DETAILS ─────────────────────────────────────────
        applicantDetails: {
            fileNo: String,
            lanNo: String,
            applicantName: String,
            branch: String,
            brqNo: String,
            dateOfReport: String,
            loanCategory: String,
            valuerName: String,
            contactPerson: String,
            contactNo: String,
            personMetAtSite: String,
            propertyOwner: String,
            relationshipMetAtSite: String,
            personMetAtSiteContact: String,
            numberOfTenants: String,
            tenantVintage: String,
            documentsProvided: String,
        },

        // ── STEP 2: LOCATION DETAILS ──────────────────────────────────────────
        locationDetails: {
            propertyPincode: String,
            propertyCity: String,
            city: { type: String, default: "" },
            propertyState: String,
            addressAsPerSite: String,
            localityName: String,
            landmarkNearBy: String,
            distanceFromCityCenter: String,
            floorNo: String,
            latitude: String,
            longitude: String,
            mapView: { type: String, default: "satellite" },
            locationCapturedAt: String,
            addressMatching: String,
            jurisdiction: String,
            propertyHoldingType: String,
            marketability: String,
            propertyOccupiedBy: String,
            typeOfProperty: String,
        },

        // ── STEP 3: BOUNDARIES ────────────────────────────────────────────────
        boundaryDetails: {
            northBoundary: String,
            southBoundary: String,
            eastBoundary: String,
            westBoundary: String,
            northBoundarySite: String,
            southBoundarySite: String,
            eastBoundarySite: String,
            westBoundarySite: String,
            boundariesMatching: String,
            approachRoadSize: String,
            propertyIdentified: String,
        },

        // ── STEP 4: NDMA PARAMETERS ───────────────────────────────────────────
        ndmaParameters: {
            natureOfBuilding: String,
            structureType: String,
            roofType: String,
            steelGrade: String,
            concreteGrade: String,
            typeOfMasonry: String,
            footingType: String,
            seismicZone: String,
            floodProneArea: String,
            fireExit: String,
            sanctionedPlanProvided: String,
            approvingAuthority: String,
        },

        // ── STEP 5: TECHNICAL DETAILS ─────────────────────────────────────────
        technicalDetails: {
            constructionQuality: String,
            liftAvailable: String,
            noOfLifts: String,
            // Dimensions
            eastToWestPlan: String,
            eastToWestDoc: String,
            eastToWestSite: String,
            northToSouthPlan: String,
            northToSouthDoc: String,
            northToSouthSite: String,
            landAreaPlan: String,
            landAreaDoc: String,
            landAreaSite: String,
            // Other
            carpetAreaAsPerDocument: String,
            actualConstructionSBUA: String,
            riskOfDemolition: String,
            statusOfProperty: String,
            percentCompleted: String,
            currentAgeOfProperty: String,
            residualAge: String,
        },

        // ── STEP 6: ACCOMMODATION DETAILS (FLOORS) ────────────────────────────
        accommodationDetails: {
            floors: [
                {
                    floorNo: String,
                    noOfRooms: String,
                    noOfKitchen: String,
                    noOfBathRoom: String,
                    sanctionUsage: String,
                    actualUsage: String,
                },
            ],
        },

        // ── STEP 7: VALUATION ─────────────────────────────────────────────────
        valuationDetails: {
            landArea: String,
            tentativeLandRate: String,
            depreciation: String,
            landValue: String,
            governmentValue: String,
            distressedValue: String,
            valuationMethodology: String,
            valuationDoneEarlier: String,
            isPropertyInNegativeArea: String,
            remarks: String,
        },

        // ── STEP 8: INFRASTRUCTURE & DECLARATION ──────────────────────────────
        infrastructureDetails: {
            approachRoadToProperty: String,
            developmentOfSurroundingAreas: String,
            distanceFromCityCenter: String,
            electricityAvailable: String,
            electricityDistributor: String,
            waterSupply: String,
            waterDistributor: String,
            sewerLineConnected: String,
            anyDemolitionThreat: String,
            declaration: String,
            createdBy: String,
            createdOn: String,
            location: String,
            approvedBy: String,
            approvedOn: String,
            designation: String,
        },

        // ── IMAGES (grouped by category) ─────────────────────────────────────
        // Each: { url, fileId, name }
        frontElevationImages: { type: [Object], default: [] },
        kitchenImages: { type: [Object], default: [] },
        selfieImages: { type: [Object], default: [] },
        otherImages: { type: [Object], default: [] },

        // ── ATTACHED DOCUMENTS ────────────────────────────────────────────────
        AttachDocuments: { type: [Object], default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("BajajHousingReport", BajajHousingSchema);