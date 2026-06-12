


import { lazy } from "react";

export const routesConfig = [
  { path: "/", element: lazy(() => import("../pages/Dashboard/Dashboard")) },
  {
    path: "/bank-logo",
    element: lazy(() => import("../pages/1Bank-Home/BankHomePage")),
  },
  // Bank Forms & Details
  {
    path: "/bank/icici",
    element: lazy(() => import("../pages/Bank-Form/Icici-Bank/IciciBank")),
  },

  {
    path: "/bank/bankform",
    element: lazy(() => import("../components/BankForm/ValuationForm.jsx")),

  },
  {
    path: "/bank/icici/:id",
    element: lazy(() => import("../pages/Bank-Details/IciciBankDetails")),
  },
  {
    path: "/bank/icici/edit/:id",
    element: lazy(() => import("../pages/Bank-Form/Icici-Bank/IciciBank")),
  },

  {
    path: "/bank/piramal",
    element: lazy(() => import("../pages/Bank-Form/Pirmal-form/Primal")),
  },
  {
    path: "/bank/piramal/:id",
    element: lazy(() => import("../pages/Bank-Details/PrimalDetails")),
  },
  {
    path: "/bank/piramal/edit/:id",
    element: lazy(() => import("../pages/Bank-Form/Pirmal-form/Primal")),
  },
  {
    path: "/bank/home-first",
    element: lazy(() =>
      import("../pages/Bank-Form/Home-FirstBank/HomeFirstBank")
    ),
  },
  {
    path: "/bank/home-first/:id",
    element: lazy(() => import("../pages/Bank-Details/HFBankDetails")),
  },
  {
    path: "/bank/HomeFirst/:id",
    element: lazy(() => import("../pages/Bank-Details/HFBankDetails")),
  },
  {
    path: "/bank/home-first/edit/:id",
    element: lazy(() =>
      import("../pages/Bank-Form/Home-FirstBank/HomeFirstBank")
    ),
  },
  {
    path: "/bank/home-first-trench",
    element: lazy(() => import("../pages/Bank-Form/Home-trench/Trench")),
  },
  {
    path: "/bank/home-first-trench/:id",
    element: lazy(() => import("../pages/Bank-Details/HomeTrench")),
  },
  {
    path: "/bank/homefirsttrench/:id",
    element: lazy(() => import("../pages/Bank-Details/HomeTrench")),
  },

  {
    path: "/bank/home-first-trench/edit/:id",
    element: lazy(() => import("../pages/Bank-Form/Home-trench/Trench")),
  },

  {
    path: "/bank/aditya",
    element: lazy(() => import("../pages/Bank-Details/AdityaBirlaForm/AdityaBirlaForm.jsx"))
  },

  {
    path: "/bank/aditya-birla/:id",
    element: lazy(() => import("../pages/Bank-Details/AdityaBirlaForm/AdityaBirlaForm.jsx"))
  },
  // {
  //   path: "/bank/aditya/:id",
  //   element: lazy(() => import("../pages/Bank-Details/AdityaDetails")),
  // },
  {
    path: "/bank/aditya/:id",
    element: lazy(() => import("../pages/Bank-Details/AdityaBirlaForm/AdityaBirlaForm.jsx")),
  },
  // {
  //   path: "/bank/aditya/edit/:id",
  //   element: lazy(() => import("../pages/Bank-Form/Adtiya-Bank/AditiyaFrom")),
  // },

  {
    path: "/bank/aditya/edit/:id",
    element: lazy(() => import("../pages/Bank-Details/AdityaBirlaForm/AdityaBirlaForm.jsx")),
  },

  {
    path: "/bank/agriwise",
    element: lazy(() => import("../pages/Bank-Form/Agriwise/AgriwiseBank")),
  },
  {
    path: "/bank/agriwise/:id",
    element: lazy(() =>
      import("../pages/Bank-Details/Agriwise/AgriwiseDetails")
    ),
  },
  {
    path: "/bank/agriwise/edit/:id",
    element: lazy(() => import("../pages/Bank-Form/Agriwise/AgriwiseBank")),
  },

  {
    path: "/bank/sundaram",
    element: lazy(() => import("../pages/Bank-Form/sundaram/SundaramBank")),
  },
  {
    path: "/bank/sundaram/:id",
    element: lazy(() => import("../pages/Bank-Details/SundaramHomeDetails")),
  },
  {
    path: "/bank/sundaram/edit/:id",
    element: lazy(() => import("../pages/Bank-Form/sundaram/SundaramBank")),
  },

  {
    path: "/bank/chola",
    element: lazy(() => import("../pages/Bank-Form/CholaForms/CholaForm")),
  },
  {
    path: "/bank/chola/:id",
    element: lazy(() => import("../pages/Bank-Details/CholaDetail")),
  },
  {
    path: "/bank/chola/edit/:id",
    element: lazy(() => import("../pages/Bank-Form/CholaForms/CholaForm")),
  },

  {
    path: "/bank/hero-fincorp",
    element: lazy(() => import("../pages/Bank-Form/HeroFinCorp/HeroFinCorp")),
  },
  {
    path: "/bank/hero-fincorp/:id",
    element: lazy(() => import("../pages/Bank-Details/HeroFinCorpDetails")),
  },
  {
    path: "/bank/hero-fincorp/edit/:id",
    element: lazy(() => import("../pages/Bank-Form/HeroFinCorp/HeroFinCorp")),
  },

  {
    path: "/bank/manappuram",
    element: lazy(() => import("../pages/Bank-Details/Manapurram/Manapurram.jsx")),
  },
  {
    path: "/bank/manappuram/:id",
    element: lazy(() => import("../pages/Bank-Details/Manapurram/Manapurram.jsx")),
  },
  {
    path: "/bank/manappuram/edit/:id",
    element: lazy(() => import("../pages/Bank-Details/Manapurram/Manapurram.jsx")),
  },

  {
    path: "/bank/icici-hfc",
    element: lazy(() =>
      import("../pages/Bank-Form/ICICIHFCFroms/ICICIBankForm")
    ),
  },
  {
    path: "/bank/icici-hfc/:id",
    element: lazy(() =>
      import("../pages/Bank-Details/ICICHFC/ICHFCBankDetails")
    ),
  },

  {
    path: "/bank/samasta",
    element: lazy(() =>
      import("../pages/Bank-Form/SamstaflnForm/SamstaflnBankForm")
    ),
  },
  {
    path: "/bank/samasta/:id",
    element: lazy(() =>
      import("../pages/Bank-Details/SamstaFln/SamstaFlnDetails")
    ),
  },

  {
    path: "/bank/federal-bank",
    element: lazy(() => import("../pages/Bank-Form/FedralForm/FedralBankForm")),
  },
  {
    path: "/bank/fedral/:id",
    element: lazy(() => import("../pages/Bank-Details/Fedral/FedralDetail")),
  },

  {
    path: "/bank/piramalnpa-form",
    element: lazy(() =>
      import("../pages/Bank-Form/primalFinance/PrimalNPAForm")
    ),
  },
  {
    path: "/bank/piramalnpa-form/:id",
    element: lazy(() => import("../pages/Bank-Details/PiramalNPADetails")),
  },

  {
    path: "/bank/profectus",
    element: lazy(() => import("../pages/Bank-Form/Profectus/Profectus")),
  },
  {
    path: "/bank/profectus/:id",
    element: lazy(() => import("../pages/Bank-Details/ProfectusDetails")),
  },
  {
    path: "/bank/protium",
    element: lazy(() => import("../pages/Bank-Form/ProtiumForm/ProtiumForm")),
  },
  {
    path: "/bank/protium/:id",
    element: lazy(() =>
      import("../pages/Bank-Details/ProtiumDetail/ProtiumDetail")
    ),
  },

  {
    path: "/bank/idfc-first-bank",
    element: lazy(() => import("../pages/Bank-Form/IdfcFroms/IDFCform")),
  },
  {
    path: "/bank/idfc-first-bank/:id",
    element: lazy(() => import("../pages/Bank-Details/IdfcBank")),
  },

  {
    path: "/bank/bajaj-ameriya-bank",
    element: lazy(() =>
      import("../pages/Bank-Form/Bajajameria/BajajAmeriaForm")
    ),
  },
  {
    path: "/bank/bajaj-ameriya-bank/:id",
    element: lazy(() => import("../pages/Bank-Details/BajajAmeriyaDetails")),
  },
  {
    path: "/bank/bajaj",
    element: lazy(() => import("../pages/Banks/BajajHousing/BajajHousingForm.jsx")),
  },
  {
    path: "/bank/bajaj/:id",
    element: lazy(() => import("../pages/Banks/BajajHousing/BajajHousingForm.jsx")),
  },
  {
    path: "/bank/bajaj-housing/:id",
    element: lazy(() => import("../pages/Banks/BajajHousing/BajajHousingForm.jsx")),
  },
  {
    path: "/bank/bajaj/edit/:id",
    element: lazy(() => import("../pages/Banks/BajajHousing/BajajHousingForm.jsx")),
  },

  // bank/bajaj-housing/edit/:id
  {
    path: "/bank/bajaj-housing/edit/:id",
    element: lazy(() => import("../pages/Banks/BajajHousing/BajajHousingForm.jsx")),
  },

  {
    path: "/bank/bajaj/view/:id",
    element: lazy(() => import("../pages/Banks/BajajHousing/BajajHousingView.jsx")),
  },
  {
    path: "/bank/bajaj-housing/view/:id",
    element: lazy(() => import("../pages/Banks/BajajHousing/BajajHousingView.jsx")),
  },
  {
    path: "/bank/dmi-finance",
    element: lazy(() => import("../pages/Bank-Form/Dmi-finance/DmiFinance")),
  },
  {
    path: "/bank/dmi-finance/:id",
    element: lazy(() => import("../pages/Bank-Details/DmiFinanceDetails")),
  },

  // !Admin
  {
    path: "/admin/employees",
    element: lazy(() => import("../pages/admin/EmployeeManagement")),
  },

  // ! Filed Dashboard
  {
    path: "/field/dashboard",
    element: lazy(() =>
      import("../pages/Dashboard/FieldOfficer/FieldOfficerDashboard")
    ),
  },
];
