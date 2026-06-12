// src/redux/selectors.js
import { createSelector } from "reselect";

// Input selector
const getBajajHousingRawData = (state) => state.bajajHousing.allReports;
const getBajajHousingLoading = (state) => state.bajajHousing.loading;


// --- Input Selectors ---
const getIciciRawData = (state) => state.icici.data;
const getIciciLoading = (state) => state.icici.loading;

const getHfBanksRawData = (state) => state.hfBanks.allBanks;
const getHfBanksLoading = (state) => state.hfBanks.loading;

// const getAdityaRawData = (state) => state.aditya.details;
const getAdityaRawData = (state) => state.aditya.allReports;
const getAdityaLoading = (state) => state.aditya.loading;

const getPrimalRawData = (state) => state.primal.details;
const getPrimalLoading = (state) => state.primal.loading;

const getSundaramRawData = (state) => state.sundaramBank.allReports;
const getSundaramLoading = (state) => state.sundaramBank.loading;

const getCholaRawData = (state) => state.chola.details;
const getCholaLoading = (state) => state.chola.loading;

const getAgriwiseRawData = (state) => state.agriwise.valuations;
const getAgriwiseLoading = (state) => state.agriwise.loading;

const getHeroFinCorpRawData = (state) => state.HeroFinCorp.valuations;
const getHeroFinCorpLoading = (state) => state.HeroFinCorp.loading;

const getManappuramRawData = (state) => state.manappuram.allReports;
const getManappuramLoading = (state) => state.manappuram.loading;

const getPiramalNPARawData = (state) => state.piramalNPA.records;
const getPiramalNPALoading = (state) => state.piramalNPA.loading;

const getSamstaRawData = (state) => state.Samsta.data;
const getSamstaLoading = (state) => state.Samsta.loading;

const getProtiumRawData = (state) => state.protium.data;
const getProtiumLoading = (state) => state.protium.loading;

const getIciciHFCRawData = (state) => state.iciciHFC.data;
const getIciciHFCLoading = (state) => state.iciciHFC.loading;

const getFedralRawData = (state) => state.Fedral.data;
const getFedralLoading = (state) => state.Fedral.loading;

const getProfectusRawData = (state) => state.profectus.allReports?.data;
const getProfectusLoading = (state) =>
  state.profectus.allReports?.loading || false;

const getIdfcBankRawData = (state) => state.idfc.details;
const getIdfcBankLoading = (state) => state.idfc.loading;

const getBajajRawData = (state) => state.bajaj.reports;
const getBajajLoading = (state) => state.bajaj.loading;

const getBajajAmeriyaRawData = (state) => state.bajajA.reports;
const getBajajAmeriyaLoading = (state) => state.bajajA.loading;

const getDmiFinanceRawData = (state) => state.dmiFinance.reports;
const getDmiFinanceLoading = (state) => state.dmiFinance.loading;

const getFieldOfficersRawData = (state) => state.auth.FO;
const getAuthLoading = (state) => state.auth.loading;

// --- Output Selectors (with proper transformation for arrays) ---

export const selectIciciData = createSelector(
  [getIciciRawData],
  (data) => (data ? [...data] : []) // Creates a new array reference
);



// Output selector
export const selectBajajHousingData = createSelector(
  [getBajajHousingRawData],
  (data) => (data ? [...data] : [])
);

export const selectHfBanksData = createSelector([getHfBanksRawData], (data) =>
  data ? [...data] : []
);

export const selectAdityaData = createSelector([getAdityaRawData], (data) =>
  data ? [...data] : []
);

export const selectPrimalData = createSelector([getPrimalRawData], (data) =>
  data ? [...data] : []
);

export const selectSundaramData = createSelector([getSundaramRawData], (data) =>
  data ? [...data] : []
);

export const selectCholaData = createSelector([getCholaRawData], (data) =>
  data ? [...data] : []
);

export const selectAgriwiseData = createSelector([getAgriwiseRawData], (data) =>
  data ? [...data] : []
);

export const selectHeroFinCorpData = createSelector(
  [getHeroFinCorpRawData],
  (data) => (data ? [...data] : [])
);

export const selectManapuramData = createSelector(
  [getManappuramRawData],
  (data) => (data ? [...data] : [])
);

export const selectPiramalNPAData = createSelector(
  [getPiramalNPARawData],
  (data) => (data ? [...data] : [])
);

export const selectSamstaData = createSelector([getSamstaRawData], (data) =>
  data ? [...data] : []
);

export const selectProtiumData = createSelector([getProtiumRawData], (data) =>
  data ? [...data] : []
);

export const selectIciciHFCData = createSelector([getIciciHFCRawData], (data) =>
  data ? [...data] : []
);

export const selectFedralData = createSelector([getFedralRawData], (data) =>
  data ? [...data] : []
);

export const selectProfectusData = createSelector(
  [getProfectusRawData],
  (data) => (data ? [...data] : [])
);

export const selectIdfcBankData = createSelector([getIdfcBankRawData], (data) =>
  data ? [...data] : []
);

export const selectBajajData = createSelector([getBajajRawData], (data) =>
  data ? [...data] : []
);

export const selectBajajAmeriyaData = createSelector(
  [getBajajAmeriyaRawData],
  (data) => (data ? [...data] : [])
);

export const selectDmiFinanceData = createSelector(
  [getDmiFinanceRawData],
  (data) => (data ? [...data] : [])
);

export const selectFieldOfficers = createSelector(
  [getFieldOfficersRawData],
  (fo) => (fo ? [...fo] : [])
);

// Combined loading selector (this one is already fine as it transforms booleans)
export const selectOverallLoading = createSelector(
  [
    getIciciLoading,
    getHfBanksLoading,
    getAdityaLoading,
    getPrimalLoading,
    getSundaramLoading,
    getCholaLoading,
    getAgriwiseLoading,
    getHeroFinCorpLoading,
    getManappuramLoading,
    getPiramalNPALoading,
    getSamstaLoading,
    getProtiumLoading,
    getIciciHFCLoading,
    getFedralLoading,
    getProfectusLoading,
    getIdfcBankLoading,
    getBajajLoading,
    getBajajAmeriyaLoading,
    getDmiFinanceLoading,
    getAuthLoading,
    getBajajHousingRawData,
    getBajajHousingLoading,
  ],
  (...loadings) => loadings.some((loading) => loading)
);
