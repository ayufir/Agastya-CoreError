// popup.js
let loadedData = null;

// UI Elements
const dropZone = document.getElementById('dropZone');
const jsonInput = document.getElementById('jsonFile');
const previewArea = document.getElementById('previewArea');
const bankBadge = document.getElementById('bankBadge');
const applicantNameEl = document.getElementById('applicantName');
const refNumberEl = document.getElementById('refNumber');
const reportDateEl = document.getElementById('reportDate');
const imagesSection = document.getElementById('imagesSection');
const imagesCountEl = document.getElementById('imagesCount');
const imagesCarousel = document.getElementById('imagesCarousel');
const fillBtn = document.getElementById('fillBtn');
const extractBtn = document.getElementById('extractBtn');
const clearBtn = document.getElementById('clearBtn');
const statusDiv = document.getElementById('status');

// Helper: Show status message
function showStatus(text, type = 'info') {
  statusDiv.textContent = text;
  statusDiv.className = '';
  statusDiv.style.display = 'block';
  
  if (type === 'info') statusDiv.classList.add('status-info');
  else if (type === 'success') statusDiv.classList.add('status-success');
  else if (type === 'error') statusDiv.classList.add('status-error');
}

// Helper: Clear status message
function clearStatus() {
  statusDiv.textContent = '';
  statusDiv.style.display = 'none';
}

// Drag & Drop event listeners
dropZone.addEventListener('click', () => jsonInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  
  if (e.dataTransfer.files.length) {
    handleFile(e.dataTransfer.files[0]);
  }
});

jsonInput.addEventListener('change', (e) => {
  if (e.target.files.length) {
    handleFile(e.target.files[0]);
  }
});

// Reset logic
clearBtn.addEventListener('click', () => {
  loadedData = null;
  jsonInput.value = '';
  previewArea.style.display = 'none';
  fillBtn.disabled = true;
  fillBtn.classList.remove('pulsing');
  clearStatus();
});

// Process Selected File
async function handleFile(file) {
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    showStatus('Please select a valid .json file.', 'error');
    return;
  }

  showStatus('Reading JSON file...', 'info');

  try {
    const jsonText = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsText(file);
    });

    const data = JSON.parse(jsonText);
    showStatus('Converting remote URLs to base64...', 'info');
    await convertJsonUrlsToBase64(data);
    loadedData = data;
    
    // Process Data
    const formType = detectBankForm(data);
    const info = extractDisplayInfo(data);
    const images = extractImages(data);

    // Update UI
    bankBadge.textContent = formType;
    applicantNameEl.textContent = info.applicant;
    refNumberEl.textContent = info.refNo;
    reportDateEl.textContent = info.date;

    // Render image previews
    imagesCarousel.innerHTML = '';
    if (images.length > 0) {
      imagesSection.style.display = 'block';
      imagesCountEl.textContent = `${images.length} found`;
      
      images.forEach((img, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'thumb-wrapper';
        wrapper.title = img.name || `Image ${idx + 1}`;
        
        const thumb = document.createElement('img');
        thumb.className = 'thumb-img';
        thumb.src = img.url;
        
        wrapper.appendChild(thumb);
        imagesCarousel.appendChild(wrapper);
      });
    } else {
      imagesSection.style.display = 'none';
    }

    previewArea.style.display = 'block';
    fillBtn.disabled = false;
    fillBtn.classList.add('pulsing');
    showStatus('JSON file loaded successfully!', 'success');
  } catch (error) {
    showStatus('Error parsing JSON: ' + error.message, 'error');
    console.error(error);
  }
}

// ─── BANK/FORM DETECTION LOGIC ────────────────────────────────────────────────
function detectBankForm(data) {
  if (!data || typeof data !== 'object') return 'Unknown Form';
  
  const bankName = String(data.bankName || data.bank || '').toLowerCase();
  if (bankName.includes('bajaj') && bankName.includes('housing')) return 'Bajaj Housing Finance';
  if (bankName.includes('bajaj')) return 'Bajaj Bank';
  if (bankName.includes('icici') && bankName.includes('hfc')) return 'ICICI HFC';
  if (bankName.includes('icici')) return 'ICICI Bank';
  if (bankName.includes('homefirst') || bankName.includes('home first')) {
    if (bankName.includes('trench')) return 'Home First Trench';
    return 'Home First Bank';
  }
  if (bankName.includes('aditya')) return 'Aditya Birla';
  if (bankName.includes('manappuram') || bankName.includes('manapuram')) return 'Manappuram Bank';
  if (bankName.includes('piramal')) return 'Piramal Finance';
  if (bankName.includes('sundaram')) return 'Sundaram Bank';
  if (bankName.includes('chola')) return 'Chola Bank';
  if (bankName.includes('agriwise')) return 'Agriwise';
  if (bankName.includes('hero')) return 'Hero FinCorp';
  if (bankName.includes('samasta')) return 'Samasta Bank';
  if (bankName.includes('federal') || bankName.includes('fedral')) return 'Federal Bank';
  if (bankName.includes('profectus')) return 'Profectus Bank';
  if (bankName.includes('protium')) return 'Protium Bank';
  if (bankName.includes('idfc')) return 'IDFC First Bank';
  if (bankName.includes('dmi')) return 'DMI Finance';

  // Signature based detection fallbacks
  if (data.applicantDetails && data.locationDetails && data.frontElevationImages) return 'Bajaj Housing Finance';
  if (data.step1 && data.step2 && data.step7) return 'Bajaj Bank';
  if (data.valuationGLR || data.valuationPMR) return 'Manappuram Bank';
  if (data.basicDetails && data.locationDetails && data.documentDetails) return 'Aditya Birla';
  if (data.pincode && data.locality && data.doorPhotoFile) return 'ICICI Bank';
  if (data.propertyInfo && data.accessibility) return 'Manappuram Bank';
  
  return 'Standard Bank Form';
}

// ─── METADATA EXTRACTION LOGIC ────────────────────────────────────────────────
function extractDisplayInfo(data) {
  let applicant = '--';
  let refNo = '--';
  let date = '--';

  // Helper to resolve nested values
  const resolve = (paths) => {
    for (const path of paths) {
      const parts = path.split('.');
      let val = data;
      for (const p of parts) {
        val = val ? val[p] : undefined;
      }
      if (val !== undefined && val !== null && val !== '') return val;
    }
    return null;
  };

  applicant = resolve([
    'applicantDetails.applicantName',
    'customerName',
    'visitedPersonName',
    'applicantName',
    'clientName',
    'basicDetails.nameOfClient',
    'propertyInfo.applicantName',
    'summary.applicantName',
    'header.contactedPerson',
    'step1.applicantName'
  ]) || '--';

  refNo = resolve([
    'applicantDetails.fileNo',
    'caseReferenceNumber',
    'refNo',
    'registration_number',
    'fileNo',
    'basicDetails.caseReferenceNumber',
    'header.caseRefNo',
    'step1.fileNo',
    'bankRefNo'
  ]) || '--';

  date = resolve([
    'applicantDetails.dateOfReport',
    'dateOfReport',
    'reportDate',
    'visitDate',
    'createdDate',
    'createdAt',
    'basicDetails.visitDate',
    'step1.dateOfReport'
  ]) || '--';

  if (date !== '--' && !isNaN(Date.parse(date))) {
    date = new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  return { applicant, refNo, date };
}

// ─── RECURSIVE IMAGE EXTRACTION ────────────────────────────────────────────────
function extractImages(data) {
  const rawImages = [];
  
  const traverse = (obj, seen = new WeakSet()) => {
    if (!obj || typeof obj !== 'object') {
      if (typeof obj === 'string' && (obj.startsWith('data:image/') || obj.startsWith('http:') || obj.startsWith('https:'))) {
        rawImages.push({ url: obj, name: 'image.png' });
      }
      return;
    }

    if (seen.has(obj)) return;
    seen.add(obj);

    if (Array.isArray(obj)) {
      for (const item of obj) {
        traverse(item, seen);
      }
    } else {
      if (obj.base64 && typeof obj.base64 === 'string' && (obj.base64.startsWith('data:') || obj.base64.startsWith('http:') || obj.base64.startsWith('https:'))) {
        rawImages.push({ url: obj.base64, name: obj.name || 'image.png' });
      } else if (obj.url && typeof obj.url === 'string' && (obj.url.startsWith('data:') || obj.url.startsWith('http:') || obj.url.startsWith('https:'))) {
        rawImages.push({ url: obj.url, name: obj.name || 'image.png' });
      } else if (obj.previewUrl && typeof obj.previewUrl === 'string' && (obj.previewUrl.startsWith('data:') || obj.previewUrl.startsWith('http:') || obj.previewUrl.startsWith('https:'))) {
        rawImages.push({ url: obj.previewUrl, name: obj.name || 'image.png' });
      } else {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            traverse(obj[key], seen);
          }
        }
      }
    }
  };

  traverse(data);

  // Deduplicate images based on base64 content
  const uniqueImages = [];
  const seenUrls = new Set();
  for (const img of rawImages) {
    if (!seenUrls.has(img.url)) {
      seenUrls.add(img.url);
      uniqueImages.push(img);
    }
  }

  return uniqueImages;
}

// ─── FORM AUTOFILL ACTION TRIGGER ──────────────────────────────────────────────
fillBtn.addEventListener('click', () => {
  if (!loadedData) return;

  showStatus('Initializing autofill scripts in all frames...', 'info');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab) {
      showStatus('No active browser tab found.', 'error');
      return;
    }

    const payload = { action: 'FILL_FORM', data: loadedData, photos: [] };

    // Inject scripts into all frames to ensure content.js is loaded everywhere
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id, allFrames: true },
      files: ['content.js']
    }, () => {
      if (chrome.runtime.lastError) {
        console.warn("Some frames could not be scripted (this is normal for cross-origin trackers):", chrome.runtime.lastError.message);
      }

      // Small delay for scripts to execute and mount onMessage listener
      setTimeout(() => {
        // Query all frames to target each directly via its frameId
        chrome.webNavigation.getAllFrames({ tabId: activeTab.id }, (frames) => {
          if (chrome.runtime.lastError || !frames || frames.length === 0) {
            // Fallback: send only to top-level frame (frameId: 0)
            chrome.tabs.sendMessage(activeTab.id, payload, { frameId: 0 }, (response) => {
              if (chrome.runtime.lastError) {
                showStatus('Autofill failed: ' + chrome.runtime.lastError.message, 'error');
              } else {
                showStatus(response ? (response.status || 'Form Filled!') : 'Form Filled!', 'success');
              }
            });
            return;
          }

          showStatus(`Sending autofill request to ${frames.length} frames...`, 'info');

          let pendingResponses = frames.length;
          let totalFilled = 0;
          let hasSuccess = false;

          frames.forEach(frame => {
            chrome.tabs.sendMessage(activeTab.id, payload, { frameId: frame.frameId }, (response) => {
              pendingResponses--;

              if (!chrome.runtime.lastError && response) {
                hasSuccess = true;
                totalFilled += (response.fillCount || 0);
              }

              if (pendingResponses === 0) {
                if (hasSuccess) {
                  showStatus(`Form Filled Successfully! Filled ${totalFilled} fields across all frames.`, 'success');
                } else {
                  showStatus('No frames responded to autofill. Please reload tab and try again.', 'error');
                }
              }
            });
          });
        });
      }, 200);
    });
  });
});

async function convertJsonUrlsToBase64(obj, seen = new WeakSet()) {
  if (!obj || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return obj;
  seen.add(obj);

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = await convertJsonUrlsToBase64(obj[i], seen);
    }
  } else {
    // Check if it's a file object with an external URL
    if (obj.url && typeof obj.url === 'string' && obj.url.startsWith('http') && !obj.url.startsWith('data:')) {
      try {
        const base64 = await fetchUrlAsBase64(obj.url);
        obj.base64 = base64;
        obj.url = base64; // Replace url with base64 so it can be filled locally
      } catch (e) {
        console.warn("Failed to convert url to base64 in popup:", obj.url, e);
      }
    }
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && key !== 'url' && key !== 'base64') {
        obj[key] = await convertJsonUrlsToBase64(obj[key], seen);
      }
    }
  }
  return obj;
}

async function fetchUrlAsBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    throw err;
  }
}

const USER_SCHEMA_TEMPLATE = {
  "applicantDetails": {
    "lan": "",
    "collateral": "",
    "customerName": "",
    "branch": "",
    "requestCode": "",
    "dateOfReport": "",
    "typeOfLoan": "",
    "productType": "",
    "contactName": "",
    "contactNo": "",
    "developerName": "",
    "valuerName": "",
    "personMetAtSite": "",
    "relationshipMetAtSite": "",
    "personMetAtSiteContact": "",
    "numberOfTenants": "",
    "tenantVintageYears": "",
    "documentsProvided": ""
  },
  "locationDetails": {
    "pinCode": "",
    "areaLocality": "",
    "city": "",
    "state": "",
    "addressLine1": "",
    "addressLine2": "",
    "addressLine3": "",
    "legalAddressLine1": "",
    "legalAddressLine2": "",
    "legalAddressLine3": "",
    "latitudeLongitude": "",
    "addressMatching": "",
    "noOfFloor": "",
    "propertyHoldingType": "",
    "marketability": "",
    "propertyOccupiedBy": "",
    "propertyType": "",
    "occupancyStatus": "",
    "developmentOfSurroundingAreas": "",
    "localityStatus": "",
    "marketRate": "",
    "propertyOwners": "",
    "percentOwner": "",
    "propertyIdentifiedThrough": "",
    "societyBuildingMaintenanceStatus": "",
    "accessRoadCondition": "",
    "propertyConnectivity": "",
    "neighborhoodType": "",
    "propertyIdentified": "",
    "ownerNameAsPerLegalDocument": "",
    "remarksForAddressMismatch": "",
    "mapView": "",
    "frontElevationImages": [],
    "kitchenImages": [],
    "selfieImages": [],
    "otherImages": [],
    "uploadedDocuments": []
  },
  "boundariesOnSite": {
    "east_asPerLegalDocuments": "",
    "west_asPerLegalDocuments": "",
    "north_asPerLegalDocuments": "",
    "south_asPerLegalDocuments": "",
    "east_asPerSiteVisit": "",
    "west_asPerSiteVisit": "",
    "north_asPerSiteVisit": "",
    "south_asPerSiteVisit": "",
    "boundaryMatching": "",
    "approachRoadSize": "",
    "approachRoadToProperty": "",
    "typeOfRoad": "",
    "remarksForSiteBoundariesMatch": ""
  },
  "ndmaParameters": {
    "natureOfBuildingWing": "",
    "planAspectRatio": "",
    "structureType": "",
    "projectedPartsAvailable": "",
    "typeOfMasonry": "",
    "expansionJointsAvailable": "",
    "roofType": "",
    "steelGrade": "",
    "mortarType": "",
    "concreteGrade": "",
    "environmentExposureCondition": "",
    "footingType": "",
    "seismicZone": "",
    "soilLiquefiable": "",
    "coastalRegulatoryZone": "",
    "coastalRegulatoryZoneCategory": "",
    "soilSlopeVulnerableToLandslide": "",
    "floodProneArea": "",
    "groundSlopeMoreThan20Percent": "",
    "fireExit": ""
  },
  "approvedPlanDetails": {
    "sanctionedPlanProvided": "",
    "layoutPlanDetails": "",
    "constructionPlanDetails": "",
    "dateOfSanction": "",
    "planValidity": "",
    "approvingAuthority": "",
    "propertyUsagesAsPerPlan": "",
    "propertyUsageAsPerSiteVisit": "",
    "numberOfFloorInBuilding": ""
  },
  "technicalDetails": {
    "constructionQuality": "",
    "liftAvailable": "",
    "noOfLifts": "",
    "separateIndependentAccess": "",
    "plotAreaDetails": {
      "eastToWest": {
        "asPerPlan": "",
        "asPerDocuments": "",
        "asPerSiteVisit": ""
      },
      "northToSouth": {
        "asPerPlan": "",
        "asPerDocuments": "",
        "asPerSiteVisit": ""
      },
      "areaOfLandSqFt": {
        "asPerPlan": "",
        "asPerDocuments": "",
        "asPerSiteVisit": ""
      }
    },
    "bauAreaDetails": {
      "basementStiltFloor": {
        "noOfRooms": "",
        "noOfKitchen": "",
        "noOfBathrooms": "",
        "sanctionedUsages": "",
        "actualUsage": ""
      },
      "groundFloor": {
        "noOfRooms": "",
        "noOfKitchen": "",
        "noOfBathrooms": "",
        "sanctionedUsages": "",
        "actualUsage": ""
      },
      "firstFloor": {
        "noOfRooms": "",
        "noOfKitchen": "",
        "noOfBathrooms": "",
        "sanctionedUsages": "",
        "actualUsage": ""
      },
      "secondFloor": {
        "noOfRooms": "",
        "noOfKitchen": "",
        "noOfBathrooms": "",
        "sanctionedUsages": "",
        "actualUsage": ""
      },
      "other1": {
        "noOfRooms": "",
        "noOfKitchen": "",
        "noOfBathrooms": "",
        "sanctionedUsages": "",
        "actualUsage": ""
      },
      "other2": {
        "noOfRooms": "",
        "noOfKitchen": "",
        "noOfBathrooms": "",
        "sanctionedUsages": "",
        "actualUsage": ""
      }
    },
    "permissibleAreaAsPerPlan": "",
    "landComponentSqFt": "",
    "permissibleFSIAsPerByelaws": "",
    "permissibleConstructionAsPerFSI": "",
    "carpetAreaAsPerDocument": "",
    "actualConstructionSBUA": "",
    "riskOfDemolition": "",
    "statusOfProperty": "",
    "percentCompleted": "",
    "percentRecommended": "",
    "currentAgeOfPropertyInYear": "",
    "residualAge": "",
    "currentOccupantOfProperty": ""
  },
  "valuation": {
    "unitOfMeasurement": "",
    "constructionAreaType": "",
    "landArea": "",
    "landRate": "",
    "landTotalValue": "",
    "constructionArea": "",
    "constructionRate": "",
    "constructionTotalValue": "",
    "depreciationPercent": "",
    "depreciationValue": "",
    "carParkingCharges": {
      "numberOfCars": "",
      "charges": "",
      "total": ""
    },
    "amenitiesOtherChargesLumpsum": "",
    "realizableValueAsOnDate": "",
    "governmentValue": "",
    "distressedForceValue": "",
    "valuationDoneEarlier": "",
    "valuationMethodology": "",
    "inMunicipalDemolitionList": "",
    "isPropertyInNegativeArea": "",
    "municipalCompliance": "",
    "detailsOfLegalDocuments": "",
    "basicAgreementValue": "",
    "costOfProperty": "",
    "electricityWaterDeposit": "",
    "oneTimeMaintenanceDeposit": "",
    "floorRiseAmt": "",
    "percentGST": "",
    "legalCharges": "",
    "clubMembership": "",
    "lodWaiver": ""
  },
  "additionalChecksForPanchayatProperties": {
    "approachRoadToProperty": "",
    "distanceFromCityCentreInKms": "",
    "distanceFromCorporationLimitsInKms": "",
    "electricity": "",
    "electricityDistributor": "",
    "waterSupply": "",
    "waterDistributor": "",
    "sewerProvision": "",
    "sewerLineConnectedToMainSewer": "",
    "anyDemolitionThreatInFutureDevelopment": "",
    "ifAnyOtherVisitObservations": "",
    "remarks": ""
  }
};

function translateExtractionToUserSchema(data) {
  const result = JSON.parse(JSON.stringify(USER_SCHEMA_TEMPLATE));
  const source = data || {};

  // 1. applicantDetails
  if (source.applicantDetails) {
    const s = source.applicantDetails;
    const d = result.applicantDetails;
    d.lan = s.lan || s.lanNo || "";
    d.collateral = s.collateral || s.fileNo || "";
    d.customerName = s.customerName || s.applicantName || "";
    d.branch = s.branch || "";
    d.requestCode = s.requestCode || s.brqNo || "";
    d.dateOfReport = s.dateOfReport || "";
    d.typeOfLoan = s.typeOfLoan || s.loanCategory || "";
    d.productType = s.productType || "";
    d.contactName = s.contactName || s.contactPerson || "";
    d.contactNo = s.contactNo || "";
    d.developerName = s.developerName || "";
    d.valuerName = s.valuerName || "";
    d.personMetAtSite = s.personMetAtSite || "";
    d.relationshipMetAtSite = s.relationshipMetAtSite || "";
    d.personMetAtSiteContact = s.personMetAtSiteContact || "";
    d.numberOfTenants = s.numberOfTenants || "";
    d.tenantVintageYears = s.tenantVintageYears || s.tenantVintage || "";
    d.documentsProvided = s.documentsProvided || "";
  }

  // 2. locationDetails
  if (source.locationDetails) {
    const s = source.locationDetails;
    const d = result.locationDetails;
    d.pinCode = s.pinCode || s.propertyPincode || "";
    d.areaLocality = s.areaLocality || s.localityName || "";
    d.city = s.city || s.propertyCity || "";
    d.state = s.state || s.propertyState || "";
    d.addressLine1 = s.addressLine1 || "";
    d.addressLine2 = s.addressLine2 || "";
    d.addressLine3 = s.addressLine3 || "";
    d.legalAddressLine1 = s.legalAddressLine1 || "";
    d.legalAddressLine2 = s.legalAddressLine2 || "";
    d.legalAddressLine3 = s.legalAddressLine3 || "";
    
    if (s.latitudeLongitude) {
      d.latitudeLongitude = s.latitudeLongitude;
    } else if (s.latitude !== undefined && s.longitude !== undefined) {
      d.latitudeLongitude = `${s.latitude || ""}, ${s.longitude || ""}`;
    }
    
    d.addressMatching = s.addressMatching || "";
    d.noOfFloor = s.noOfFloor || s.floorNo || "";
    d.propertyHoldingType = s.propertyHoldingType || "";
    d.marketability = s.marketability || "";
    d.propertyOccupiedBy = s.propertyOccupiedBy || "";
    d.propertyType = s.propertyType || s.typeOfProperty || "";
    d.occupancyStatus = s.occupancyStatus || "";
    d.developmentOfSurroundingAreas = s.developmentOfSurroundingAreas || "";
    d.localityStatus = s.localityStatus || "";
    d.marketRate = s.marketRate || "";
    d.propertyOwners = s.propertyOwners || "";
    d.percentOwner = s.percentOwner || "";
    d.propertyIdentifiedThrough = s.propertyIdentifiedThrough || "";
    d.societyBuildingMaintenanceStatus = s.societyBuildingMaintenanceStatus || "";
    d.accessRoadCondition = s.accessRoadCondition || "";
    d.propertyConnectivity = s.propertyConnectivity || "";
    d.neighborhoodType = s.neighborhoodType || "";
    d.propertyIdentified = s.propertyIdentified || "";
    d.ownerNameAsPerLegalDocument = s.ownerNameAsPerLegalDocument || "";
    d.remarksForAddressMismatch = s.remarksForAddressMismatch || "";
    d.mapView = s.mapView || "";
  }

  // 3. boundariesOnSite
  const bs = source.boundariesOnSite || source.boundaryDetails || {};
  const bd = result.boundariesOnSite;
  bd.east_asPerLegalDocuments = bs.east_asPerLegalDocuments || bs.eastBoundary || "";
  bd.west_asPerLegalDocuments = bs.west_asPerLegalDocuments || bs.westBoundary || "";
  bd.north_asPerLegalDocuments = bs.north_asPerLegalDocuments || bs.northBoundary || "";
  bd.south_asPerLegalDocuments = bs.south_asPerLegalDocuments || bs.southBoundary || "";
  bd.east_asPerSiteVisit = bs.east_asPerSiteVisit || bs.eastBoundarySite || "";
  bd.west_asPerSiteVisit = bs.west_asPerSiteVisit || bs.westBoundarySite || "";
  bd.north_asPerSiteVisit = bs.north_asPerSiteVisit || bs.northBoundarySite || "";
  bd.south_asPerSiteVisit = bs.south_asPerSiteVisit || bs.southBoundarySite || "";
  bd.boundaryMatching = bs.boundaryMatching || bs.boundariesMatching || "";
  bd.approachRoadSize = bs.approachRoadSize || "";
  bd.approachRoadToProperty = bs.approachRoadToProperty || "";
  bd.typeOfRoad = bs.typeOfRoad || "";
  bd.remarksForSiteBoundariesMatch = bs.remarksForSiteBoundariesMatch || "";

  // 4. ndmaParameters
  if (source.ndmaParameters) {
    const s = source.ndmaParameters;
    const d = result.ndmaParameters;
    d.natureOfBuildingWing = s.natureOfBuildingWing || s.natureOfBuilding || "";
    d.planAspectRatio = s.planAspectRatio || "";
    d.structureType = s.structureType || "";
    d.projectedPartsAvailable = s.projectedPartsAvailable || "";
    d.typeOfMasonry = s.typeOfMasonry || "";
    d.expansionJointsAvailable = s.expansionJointsAvailable || "";
    d.roofType = s.roofType || "";
    d.steelGrade = s.steelGrade || "";
    d.mortarType = s.mortarType || "";
    d.concreteGrade = s.concreteGrade || "";
    d.environmentExposureCondition = s.environmentExposureCondition || "";
    d.footingType = s.footingType || "";
    d.seismicZone = s.seismicZone || "";
    d.soilLiquefiable = s.soilLiquefiable || "";
    d.coastalRegulatoryZone = s.coastalRegulatoryZone || "";
    d.coastalRegulatoryZoneCategory = s.coastalRegulatoryZoneCategory || "";
    d.soilSlopeVulnerableToLandslide = s.soilSlopeVulnerableToLandslide || "";
    d.floodProneArea = s.floodProneArea || "";
    d.groundSlopeMoreThan20Percent = s.groundSlopeMoreThan20Percent || s.groundSlopeMoreThan20 || "";
    d.fireExit = s.fireExit || "";
  }

  // 5. approvedPlanDetails
  if (source.approvedPlanDetails || source.ndmaParameters) {
    const sPlan = source.approvedPlanDetails || {};
    const sNdma = source.ndmaParameters || {};
    const d = result.approvedPlanDetails;
    d.sanctionedPlanProvided = sPlan.sanctionedPlanProvided || sNdma.sanctionedPlanProvided || "";
    d.layoutPlanDetails = sPlan.layoutPlanDetails || "";
    d.constructionPlanDetails = sPlan.constructionPlanDetails || "";
    d.dateOfSanction = sPlan.dateOfSanction || "";
    d.planValidity = sPlan.planValidity || "";
    d.approvingAuthority = sPlan.approvingAuthority || sNdma.approvingAuthority || "";
    d.propertyUsagesAsPerPlan = sPlan.propertyUsagesAsPerPlan || "";
    d.propertyUsageAsPerSiteVisit = sPlan.propertyUsageAsPerSiteVisit || "";
    d.numberOfFloorInBuilding = sPlan.numberOfFloorInBuilding || "";
  }

  // 6. technicalDetails
  if (source.technicalDetails) {
    const s = source.technicalDetails;
    const d = result.technicalDetails;
    d.constructionQuality = s.constructionQuality || "";
    d.liftAvailable = s.liftAvailable || "";
    d.noOfLifts = s.noOfLifts || "";
    d.separateIndependentAccess = s.separateIndependentAccess || "";
    d.permissibleAreaAsPerPlan = s.permissibleAreaAsPerPlan || "";
    d.landComponentSqFt = s.landComponentSqFt || s.landComponent || "";
    d.permissibleFSIAsPerByelaws = s.permissibleFSIAsPerByelaws || s.permissibleFSIAsPerByeLaws || "";
    d.permissibleConstructionAsPerFSI = s.permissibleConstructionAsPerFSI || "";
    d.carpetAreaAsPerDocument = s.carpetAreaAsPerDocument || "";
    d.actualConstructionSBUA = s.actualConstructionSBUA || "";
    d.riskOfDemolition = s.riskOfDemolition || "";
    d.statusOfProperty = s.statusOfProperty || "";
    d.percentCompleted = s.percentCompleted || "";
    d.percentRecommended = s.percentRecommended || "";
    d.currentAgeOfPropertyInYear = s.currentAgeOfPropertyInYear || s.currentAgeOfProperty || "";
    d.residualAge = s.residualAge || "";
    d.currentOccupantOfProperty = s.currentOccupantOfProperty || "";

    // Plot area details
    if (s.plotAreaDetails) {
      d.plotAreaDetails = JSON.parse(JSON.stringify(s.plotAreaDetails));
    } else {
      d.plotAreaDetails.eastToWest.asPerPlan = s.eastToWestPlan || "";
      d.plotAreaDetails.eastToWest.asPerDocuments = s.eastToWestDoc || "";
      d.plotAreaDetails.eastToWest.asPerSiteVisit = s.eastToWestSite || "";
      d.plotAreaDetails.northToSouth.asPerPlan = s.northToSouthPlan || "";
      d.plotAreaDetails.northToSouth.asPerDocuments = s.northToSouthDoc || "";
      d.plotAreaDetails.northToSouth.asPerSiteVisit = s.northToSouthSite || "";
      d.plotAreaDetails.areaOfLandSqFt.asPerPlan = s.landAreaPlan || "";
      d.plotAreaDetails.areaOfLandSqFt.asPerDocuments = s.landAreaDoc || "";
      d.plotAreaDetails.areaOfLandSqFt.asPerSiteVisit = s.landAreaSite || "";
    }

    // bauAreaDetails
    if (s.bauAreaDetails) {
      d.bauAreaDetails = JSON.parse(JSON.stringify(s.bauAreaDetails));
    }
  }

  // 7. accommodationDetails
  if (source.accommodationDetails && source.accommodationDetails.floors) {
    const bau = result.technicalDetails.bauAreaDetails;
    source.accommodationDetails.floors.forEach((f, idx) => {
      const name = String(f.floorNo || "").toUpperCase();
      let key = "";
      if (name.includes("BASEMENT") || name.includes("STILT")) key = "basementStiltFloor";
      else if (name.includes("GROUND")) key = "groundFloor";
      else if (name.includes("FIRST")) key = "firstFloor";
      else if (name.includes("SECOND")) key = "secondFloor";
      else if (name.includes("OTHER 1") || name.includes("OTHER1")) key = "other1";
      else if (name.includes("OTHER 2") || name.includes("OTHER2")) key = "other2";
      else {
        if (idx === 0) key = "basementStiltFloor";
        else if (idx === 1) key = "groundFloor";
        else if (idx === 2) key = "firstFloor";
        else if (idx === 3) key = "secondFloor";
        else if (idx === 4) key = "other1";
        else if (idx === 5) key = "other2";
      }

      if (key && bau[key]) {
        bau[key].noOfRooms = f.noOfRooms || "";
        bau[key].noOfKitchen = f.noOfKitchen || "";
        bau[key].noOfBathrooms = f.noOfBathRoom || "";
        bau[key].sanctionedUsages = f.sanctionUsage || "";
        bau[key].actualUsage = f.actualUsage || "";
      }
    });
  }

  // 8. valuation
  const vs = source.valuation || source.valuationDetails || {};
  const vd = result.valuation;
  vd.unitOfMeasurement = vs.unitOfMeasurement || "";
  vd.constructionAreaType = vs.constructionAreaType || "";
  vd.landArea = vs.landArea || "";
  vd.landRate = vs.landRate || vs.tentativeLandRate || "";
  vd.landTotalValue = vs.landTotalValue || vs.landValue || "";
  vd.constructionArea = vs.constructionArea || "";
  vd.constructionRate = vs.constructionRate || "";
  vd.constructionTotalValue = vs.constructionTotalValue || "";
  vd.depreciationPercent = vs.depreciationPercent || vs.depreciation || "";
  vd.depreciationValue = vs.depreciationValue || "";
  
  if (vs.carParkingCharges) {
    if (typeof vs.carParkingCharges === 'object') {
      vd.carParkingCharges.numberOfCars = vs.carParkingCharges.numberOfCars || vs.carParkingCars || "";
      vd.carParkingCharges.charges = vs.carParkingCharges.charges || vs.carParkingCharges || "";
      vd.carParkingCharges.total = vs.carParkingCharges.total || vs.carParkingTotal || "";
    } else {
      vd.carParkingCharges.charges = vs.carParkingCharges;
      vd.carParkingCharges.numberOfCars = vs.carParkingCars || "";
      vd.carParkingCharges.total = vs.carParkingTotal || "";
    }
  } else {
    vd.carParkingCharges.numberOfCars = vs.carParkingCars || "";
    vd.carParkingCharges.charges = vs.carParkingCharges || "";
    vd.carParkingCharges.total = vs.carParkingTotal || "";
  }

  vd.amenitiesOtherChargesLumpsum = vs.amenitiesOtherChargesLumpsum || vs.amenitiesCharges || "";
  vd.realizableValueAsOnDate = vs.realizableValueAsOnDate || vs.realizableValue || "";
  vd.governmentValue = vs.governmentValue || "";
  vd.distressedForceValue = vs.distressedForceValue || vs.distressedValue || "";
  vd.valuationDoneEarlier = vs.valuationDoneEarlier || "";
  vd.valuationMethodology = vs.valuationMethodology || "";
  vd.inMunicipalDemolitionList = vs.inMunicipalDemolitionList || vs.inMunicipalDevelopmentAuthorityDemolitionList || "";
  vd.isPropertyInNegativeArea = vs.isPropertyInNegativeArea || "";
  vd.municipalCompliance = vs.municipalCompliance || "";
  vd.detailsOfLegalDocuments = vs.detailsOfLegalDocuments || "";
  vd.basicAgreementValue = vs.basicAgreementValue || "";
  vd.costOfProperty = vs.costOfProperty || "";
  vd.electricityWaterDeposit = vs.electricityWaterDeposit || "";
  vd.oneTimeMaintenanceDeposit = vs.oneTimeMaintenanceDeposit || "";
  vd.floorRiseAmt = vs.floorRiseAmt || "";
  vd.percentGST = vs.percentGST || "";
  vd.legalCharges = vs.legalCharges || "";
  vd.clubMembership = vs.clubMembership || "";
  vd.lodWaiver = vs.lodWaiver || "";

  // 9. additionalChecksForPanchayatProperties
  const is = source.additionalChecksForPanchayatProperties || source.infrastructureDetails || {};
  const id = result.additionalChecksForPanchayatProperties;
  id.approachRoadToProperty = is.approachRoadToProperty || "";
  id.distanceFromCityCentreInKms = is.distanceFromCityCentreInKms || is.distanceFromCityCenter || "";
  id.distanceFromCorporationLimitsInKms = is.distanceFromCorporationLimitsInKms || is.distanceFromCorporationLimits || "";
  id.electricity = is.electricity || is.electricityAvailable || "";
  id.electricityDistributor = is.electricityDistributor || "";
  id.waterSupply = is.waterSupply || is.waterSupply || "";
  id.waterDistributor = is.waterDistributor || "";
  id.sewerProvision = is.sewerProvision || "";
  id.sewerLineConnectedToMainSewer = is.sewerLineConnectedToMainSewer || is.sewerLineConnected || "";
  id.anyDemolitionThreatInFutureDevelopment = is.anyDemolitionThreatInFutureDevelopment || is.anyDemolitionThreat || "";
  id.ifAnyOtherVisitObservations = is.ifAnyOtherVisitObservations || "";
  id.remarks = is.remarks || is.declaration || "";

  return result;
}

// Helper: unflatten a flat object
function unflattenObject(flat) {
  const result = {};
  for (const key in flat) {
    if (!flat.hasOwnProperty(key)) continue;
    const value = flat[key];
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = (i === parts.length - 1);
      
      if (isLast) {
        current[part] = value;
      } else {
        const nextPart = parts[i + 1];
        const isNextArray = /^\d+$/.test(nextPart);
        
        if (isNextArray) {
          if (!current[part]) {
            current[part] = [];
          }
        } else {
          if (!current[part]) {
            current[part] = {};
          }
        }
        current = current[part];
      }
    }
  }
  return result;
}

// Helper: download JSON file
function downloadJson(data, bankName) {
  const cleanBankName = bankName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `${cleanBankName}_extracted_${Date.now()}.json`;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper: count total images extracted
function countImages(imagesObj) {
  let total = 0;
  for (const cat in imagesObj) {
    if (imagesObj.hasOwnProperty(cat) && Array.isArray(imagesObj[cat])) {
      total += imagesObj[cat].length;
    }
  }
  return total;
}

// Extract button click listener
extractBtn.addEventListener('click', () => {
  showStatus('Initializing extraction script in all frames...', 'info');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab) {
      showStatus('No active browser tab found.', 'error');
      return;
    }

    // Inject scripts into all frames to ensure content.js is loaded everywhere
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id, allFrames: true },
      files: ['content.js']
    }, () => {
      if (chrome.runtime.lastError) {
        console.warn("Some frames could not be scripted (this is normal for cross-origin trackers):", chrome.runtime.lastError.message);
      }

      // Small delay for scripts to execute
      setTimeout(() => {
        // Query all frames to target each directly via its frameId
        chrome.webNavigation.getAllFrames({ tabId: activeTab.id }, (frames) => {
          let targetFrames = [{ frameId: 0 }];
          if (!chrome.runtime.lastError && frames && frames.length > 0) {
            targetFrames = frames;
          }

          showStatus(`Requesting form data extraction from ${targetFrames.length} frames...`, 'info');

          let pendingResponses = targetFrames.length;
          const allFields = {};
          const allImages = {
            frontElevationImages: [],
            kitchenImages: [],
            selfieImages: [],
            otherImages: [],
            AttachDocuments: []
          };
          let successCount = 0;

          targetFrames.forEach(frame => {
            chrome.tabs.sendMessage(activeTab.id, { action: 'EXTRACT_FORM' }, { frameId: frame.frameId }, (response) => {
              pendingResponses--;

              if (!chrome.runtime.lastError && response && response.success && response.data) {
                successCount++;
                const { fields, images } = response.data;

                // Merge fields
                if (fields) {
                  for (const key in fields) {
                    if (fields.hasOwnProperty(key) && fields[key]) {
                      allFields[key] = fields[key];
                    }
                  }
                }

                // Merge images
                if (images) {
                  for (const category in allImages) {
                    if (images[category] && Array.isArray(images[category])) {
                      allImages[category].push(...images[category]);
                    }
                  }
                }
              }

              if (pendingResponses === 0) {
                if (successCount > 0) {
                  // Deduplicate images inside categories
                  for (const category in allImages) {
                    const seenUrls = new Set();
                    allImages[category] = allImages[category].filter(img => {
                      const url = img.url || img.base64 || "";
                      if (!url || seenUrls.has(url)) return false;
                      seenUrls.add(url);
                      return true;
                    });
                  }

                  // Unflatten fields
                  const unflattened = unflattenObject(allFields);
                  
                  // Translate to exact User Schema format
                  const userSchemaData = translateExtractionToUserSchema(unflattened);

                  // Merge images into the nested locationDetails object
                  userSchemaData.locationDetails.frontElevationImages = allImages.frontElevationImages || [];
                  userSchemaData.locationDetails.kitchenImages = allImages.kitchenImages || [];
                  userSchemaData.locationDetails.selfieImages = allImages.selfieImages || [];
                  userSchemaData.locationDetails.otherImages = allImages.otherImages || [];
                  userSchemaData.locationDetails.uploadedDocuments = allImages.AttachDocuments || [];

                  // Detect bank name from tab URL or data
                  let detectedBank = "Standard Bank Form";
                  const tabUrl = activeTab.url || "";
                  if (tabUrl.includes("bajajhousingfinance.in") || tabUrl.includes("bajaj") || tabUrl.includes("valuation") || tabUrl.includes("PROVAL")) {
                    detectedBank = "Bajaj Housing Finance";
                  }

                  userSchemaData.bankName = detectedBank;
                  userSchemaData.status = "Pending";

                  showStatus('Converting extracted images to base64...', 'info');
                  
                  // Convert any remote URL to base64 for self-contained JSON
                  convertJsonUrlsToBase64(userSchemaData).then(() => {
                    downloadJson(userSchemaData, detectedBank);
                    const totalImgs = countImages(allImages);
                    showStatus(`Form Extracted Successfully! Found ${Object.keys(allFields).length} fields and ${totalImgs} images.`, 'success');
                  }).catch(err => {
                    console.error("Failed to convert image URLs to base64 before download:", err);
                    downloadJson(userSchemaData, detectedBank);
                    showStatus(`Form Extracted (Base64 conversion failed partially).`, 'success');
                  });
                } else {
                  showStatus('Could not extract form data. Please reload the tab and try again.', 'error');
                }
              }
            });
          });
        });
      }, 200);
    });
  });
});
