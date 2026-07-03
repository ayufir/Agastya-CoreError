# Project Brain - banker-main

This file serves as the consolidated knowledge base and architecture document for the `banker-main` project. Refer to this file to understand the project structure, API workflows, database models, and view overrides.

---

## 📂 Project Directory Structure

```
banker-main/
├── Backend/                 # Express.js Server
│   ├── config/              # Configuration files (imagekit, DB connection, socket)
│   ├── controllers/         # Request handling controllers
│   │   ├── Banks/           # Bank-specific controllers (e.g. iciciBankController)
│   │   └── User/            # Case management and role controllers (CaseAsignCtrl)
│   ├── middleware/          # Auth protection, file uploads, role checking
│   ├── model/               # Mongoose schemas
│   │   ├── auth/            # Auth model (authModel)
│   │   └── Banks/           # Bank case schemas (IciciBankModel, homeFirstModel, etc.)
│   ├── Routes/              # Endpoint routes mapping
│   ├── services/            # Background / external services (ai.service for Claude/Gemini)
│   ├── utils/               # Date helpers, notification dispatchers, formatters
│   └── index.js             # Main server entrypoint
│
└── client/                  # Vite + React Frontend
    ├── src/
    │   ├── components/      # Common UI components (AdvancedAutoFillForm)
    │   ├── config/          # Client config (axiosInstance, socket)
    │   ├── pages/           # Pages & Dashboards
    │   │   ├── Dashboard/   # Admin, Coordinator, FO dashboards (FieldOfficerDashboard)
    │   │   ├── Bank-Form/   # Bank-specific multi-step wizard forms (IciciBank, HomeFirstBank)
    │   │   └── Bank-Details/# Details rendering & individual tabs (PropertyDetailsForm, RemarksForm)
    │   ├── redux/           # Redux Toolkit slice and thunk definitions
    │   ├── routes/          # Navigation and routes mapping (routesConfig)
    │   └── utils/           # Timezone date checkers, adapter helpers
```

---

## ⚙️ Key System Workflows

### 1. Case Lifecycle & Statuses
- **Generated / Pending**: Logged by Admin or Technical Manager. Default status is `Pending` / `generated`.
- **Assigned / Work in Progress**: Case assigned to a Field Officer. Status changes to `Assigned` or `Work in Progress`.
- **Submitted / FinalSubmitted**: Field Officer uploads files via the AI Advanced Auto Fill form and submits. Case changes to `Submitted` or `FinalSubmitted` status with `isReportSubmitted: true`.
- **Approved / Rejected**: Reviewed and processed by Admin / Technical Manager.

### 2. Timezone Handling
- Always use UTC methods (`getUTCFullYear()`, `getUTCMonth()`, `getUTCDate()`) for checking dates and filtering to avoid local browser timezone drift vs. MongoDB UTC timestamps.

### 3. Field Officer Form Overrides
- When a Field Officer (role matched case-insensitively as `"fieldofficer"`) opens any edit case route (e.g. `/bank/icici/edit/:id` or `/bank/home-first/edit/:id`), the wizard tabs are bypassed.
- They are shown **only** the **AI Advanced Auto Fill** file uploader panel and a **Submit Report** button to keep mobile operations simple.

---

## 🗄️ Backend Mongoose Models & Mapping

- **modelMap.js** maps incoming bank parameters to Mongoose models:
  - `Icici` -> `ICICI_BANK` (`Backend/model/Banks/IciciBankModel.js`)
  - `Homefirst` -> `HOME_FIRST_BANK` (`Backend/model/Banks/homeFirstModel.js`)
  - `Aditya` -> `ADITYA_BIRLA_BANK` (`Backend/model/Banks/AdityaBirlaModel.js`)
  - `BajajHousing` -> `BajajHousing` (`Backend/model/Banks/BajajHousingModel.js`)
  - `Homefirsttrench` -> `homeTrenchModel` (`Backend/model/Banks/homeTrenchModel.js`)
