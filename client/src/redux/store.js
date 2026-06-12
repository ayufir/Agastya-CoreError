import { configureStore } from "@reduxjs/toolkit";

import idfcReducer from "./features/Banks/IDFCbank/idfcSlice";
import bajajReducer from "./features/Banks/bajaj/BajajsSlice";
import primalReducer from "./features/Banks/Primal/piramalSlice";
import hfBanksReducer from "./features/Banks/HFBank/HFBankSlice";
import cholaReducer from "./features/Banks/CholaBank/CholaSlice";
// import adityaReducer from "./features/Banks/AdityaBank/adityaSlice";
import adityaReducer from "./features/Banks/AdityaBirlaBank/AdityaBirlaSlice.js";
import bajajAReducer from "./features/Banks/bajajAmeriya/bajajSlice";
import sundaramReducer from "./features/Banks/sundaram/sundaramSlice";
import agriwiseReducer from "./features/Banks/agriwise/agriwiseSlice";
import ProfectusReducer from "./features/Banks/Profectus/profectusSlice";
import protiumReducer from "./features/Banks/Protium/ProtiumBankSlice";
import iciciBankReducer from "./features/Banks/IciciBank/iciciBankSlice";
import FedralReducer from "./features/Banks/FedralBankForm/FedralBankSlice";
import manappuramReducer from "./features/Banks/ManappuramBank/Manappuramslice";
import iciciHFCReducer from "./features/Banks/IciciHfCBank/iciciHFCBankSlice";
import HeroFinCorpReducer from "./features/Banks/HeroFinCorp/HeroFinCorpSlice";
import dmiFinanceReportReducer from "./features/Banks/dmiFinance/dmiFinanceSlice";
import SamstaFlnReducer from "./features/Banks/SamstaflnBankForm/SamstaflnBankSlice";
import homeTrenchReportReducer from "./features/Banks/homeTrench/homeTrenchReportSlice";
import piramalFinanceReducer from "./features/Banks/piramalFinance/piramalFinanceSlice";

import authReducer from "./features/auth/authSlice";
import caseReducer from "./features/case/caseSlice";
import notesReducer from "./features/Note/notesSlice";
import assignedReducer from "./features/assignedCase/assignedCasesSlice.js";
import caseAssignReducer from "./features/casesAssign/caseAssignSlice.js";
import alertsReducer from "./features/alerts/alertSlice";


// 1. Import the new reducer (near other bank imports)
import bajajHousingReducer from "./features/Banks/BajajHousing/BajajHousingSlice";
import hrmsReducer from "./features/hrms/hrmsSlice";

import notificationReducer from "./features/notification/notificationSlice.js";

export const store = configureStore({
  reducer: {
    alerts: alertsReducer,
    idfc: idfcReducer,
    chola: cholaReducer,
    Fedral: FedralReducer,
    aditya: adityaReducer,
    primal: primalReducer,
    protium: protiumReducer,
    hfBanks: hfBanksReducer,
    icici: iciciBankReducer,
    Samsta: SamstaFlnReducer,
    agriwise: agriwiseReducer,
    iciciHFC: iciciHFCReducer,
    profectus: ProfectusReducer,
    sundaramBank: sundaramReducer,
    manappuram: manappuramReducer,
    HeroFinCorp: HeroFinCorpReducer,
    piramalNPA: piramalFinanceReducer,

    auth: authReducer,
    // !---------------------
    bajajA: bajajAReducer,
    bajaj: bajajReducer,
    bajajHousing: bajajHousingReducer,
    // bajaj: bajajHousingReducer,

    dmiFinance: dmiFinanceReportReducer,
    homeTrenchReport: homeTrenchReportReducer,

    case: caseReducer,
    assignedCases: assignedReducer,
    notes: notesReducer,
    caseAssign: caseAssignReducer,

    notification: notificationReducer,
    hrms: hrmsReducer,
  },
});
