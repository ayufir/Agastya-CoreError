const Bajaj = require("../model/Banks/BajajModel");
const HomeFirst = require("../model/Banks/homeFirstModel");
const Piramal = require("../model/Banks/piramalModel");
const HomeFirstTrench = require("../model/Banks/homeTrenchModel");
const ICICI_BANK = require("../model/Banks/IciciBankModel");
const Aditya = require("../model/Banks/AdityaBirlaModel");
const Manappuram = require("../model/Banks/manappuramModel");
const Sundaram = require("../model/Banks/sundaram.Model");
const Chola = require("../model/Banks/cholaModel");
const Agriwise = require("../model/Banks/agriwiseModel");
const HeroFinCorp = require("../model/Banks/HeroFinCopModel");
const PiramalNPA = require("../model/Banks/priamalFinanceModel");
const Samasta = require("../model/Banks/SamstaflnModel");
const Federal = require("../model/Banks/FedralModel");
const Profectus = require("../model/Banks/profectusModel");
const Protium = require("../model/Banks/ProtiumModel");
const IDFC = require("../model/Banks/idfcModal");
const BajajAmeriya = require("../model/Banks/BajajAmeriyaModel");
const DmiFinance = require("../model/Banks/DmiFinanceModel");
const ICICIHFC = require("../model/Banks/IcicihfcModel");
const BajajHousing = require("../model/Banks/BajajHousingModel")

const modelMap = {
  Homefirsttrench: HomeFirstTrench,
  Bajaj: Bajaj,
  BajajHousing: BajajHousing,
  Homefirst: HomeFirst,
  Piramal: Piramal,
  Icici: ICICI_BANK,
  Icicihfc: ICICIHFC,
  Aditya: Aditya,
  Manappuram: Manappuram,
};

const bankRegistry = [
  {
    key: "Homefirst",
    displayName: "Home First",
    route: "home-first",
    model: HomeFirst,
  },
  {
    key: "Homefirsttrench",
    displayName: "Home First Trench",
    route: "home-first-trench",
    model: HomeFirstTrench,
  },
  {
    key: "Icici",
    displayName: "ICICI Bank",
    route: "icici",
    model: ICICI_BANK,
  },
  { key: "Aditya", displayName: "Aditya Bank", route: "aditya", model: Aditya },
  {
    key: "Manappuram",
    displayName: "Manappuram Bank",
    route: "manappuram",
    model: Manappuram,
  },
  {
    key: "Piramal",
    displayName: "Piramal Bank",
    route: "piramal",
    model: Piramal,
  },
  {
    key: "Sundaram",
    displayName: "Sundaram Bank",
    route: "sundaram",
    model: Sundaram,
  },
  { key: "Chola", displayName: "Chola Bank", route: "chola", model: Chola },
  {
    key: "Agriwise",
    displayName: "Agriwise Bank",
    route: "agriwise",
    model: Agriwise,
  },
  {
    key: "Herofincorp",
    displayName: "Hero FinCorp Bank",
    route: "hero-fincorp",
    model: HeroFinCorp,
  },
  {
    key: "Piramalnpa",
    displayName: "Piramal NPA",
    route: "piramalnpa-form",
    model: PiramalNPA,
  },
  {
    key: "Samasta",
    displayName: "Samasta Bank",
    route: "samasta",
    model: Samasta,
  },
  {
    key: "Federal",
    displayName: "Federal Bank",
    route: "federal-bank",
    model: Federal,
  },
  {
    key: "Profectus",
    displayName: "Profectus Bank",
    route: "profectus",
    model: Profectus,
  },
  {
    key: "Protium",
    displayName: "Protium Bank",
    route: "protium",
    model: Protium,
  },
  { key: "Idfc", displayName: "IDFC Bank", route: "idfc-first-bank", model: IDFC },
  { key: "Bajaj", displayName: "Bajaj Bank", route: "bajaj", model: Bajaj },
  {
    key: "BajajHousing",
    displayName: "Bajaj Housing",
    route: "bajaj-housing",
    model: BajajHousing,
  },
  {
    key: "Bajajameriya",
    displayName: "Bajaj Ameriya Bank",
    route: "bajaj-ameriya-bank",
    model: BajajAmeriya,
  },
  {
    key: "Dmifinance",
    displayName: "DMI Finance",
    route: "dmi-finance",
    model: DmiFinance,
  },
  {
    key: "Icicihfc",
    displayName: "ICICI HFC",
    route: "icici-hfc",
    model: ICICIHFC,
  },
];

Object.defineProperty(modelMap, "bankRegistry", {
  value: bankRegistry,
  enumerable: false,
});

// Dynamic injection of atsDocuments and siteVisitVideo fields to all bank models to allow saving and retrieval
Object.values(modelMap).forEach((Model) => {
  if (Model && Model.schema) {
    if (!Model.schema.paths.atsDocuments) {
      Model.schema.add({
        atsDocuments: { type: [Object], default: [] }
      });
    }
    if (!Model.schema.paths.siteVisitVideo) {
      Model.schema.add({
        siteVisitVideo: { type: [Object], default: [] }
      });
    }
  }
});

bankRegistry.forEach(({ model: Model }) => {
  if (Model && Model.schema) {
    if (!Model.schema.paths.atsDocuments) {
      Model.schema.add({
        atsDocuments: { type: [Object], default: [] }
      });
    }
    if (!Model.schema.paths.siteVisitVideo) {
      Model.schema.add({
        siteVisitVideo: { type: [Object], default: [] }
      });
    }
  }
});

module.exports = modelMap;
