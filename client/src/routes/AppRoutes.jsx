// src/routes/AppRoutes.jsx
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedLayout from "./ProtectedLayout";
import { routesConfig } from "./routesConfig";

const Login = React.lazy(() => import("../pages/auth/Login"));
const ValuationForm = React.lazy(() => import("../components/BankForm/ValuationForm"));
const HrmsLogin = React.lazy(() => import("../pages/hrms/HrmsLogin"));
const HrmsDashboard = React.lazy(() => import("../pages/hrms/HrmsDashboard"));

const
  AppRoutes = () => {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-gray-500">Loading...</span>
          </div>
        </div>
      }>
        <Routes>
          {/* Public route */}
          <Route path='/login' element={<Login />} />
          <Route path='/BANKfORM' element={<ValuationForm />} />
          
          {/* HRMS independent routes */}
          <Route path='/hrms/login' element={<HrmsLogin />} />
          <Route path='/hrms' element={<HrmsDashboard />} />

          {/* Protected layout */}
          <Route element={<ProtectedLayout />}>
            {routesConfig.map(({ path, element: Element }, index) => (
              <Route key={index} path={path} element={<Element />} />
            ))}
          </Route>

        </Routes>
      </Suspense>
    );
  };

export default AppRoutes;
