import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";
import LoginPage from "./pages/auth/LoginPage";
import ManagerLayout from "./components/layouts/ManagerLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Manager Pages
import ManagerDashboard from "./pages/manager/Dashboard";
import UnitsPage from "./pages/manager/units/Units";
import UnitDetailPage from "./pages/manager/units/UnitDetail";
import TenantList from "./pages/manager/tenants/TenantList";
import TenantDetail from "./pages/manager/tenants/TenantDetail";
import PaymentsPage from "./pages/manager/Payments";
import MaintenancePage from "./pages/manager/Maintenance";
import ReportsPage from "./pages/manager/Reports";
import StaffList from "./pages/manager/staff/StaffList";
import StaffDetail from "./pages/manager/staff/StaffDetail";
import ManagerSettingsPage from "./pages/manager/Settings";
import OwnersPage from "./pages/manager/onwers/Owners";
import OwnerDetailPage from "./pages/manager/onwers/OwnerDetail";
import BuildingsPage from "./pages/manager/buildings/Buildings";
import BuildingDetailPage from "./pages/manager/buildings/BuildingDetail";
import ManagerCalendarPage from "./pages/manager/Calendar";

function App() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Routes>
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <ManagerLayout>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />
                    <Route path="/dashboard" element={<ManagerDashboard />} />
                    <Route path="/units" element={<UnitsPage />} />
                    <Route path="/units/:id" element={<UnitDetailPage />} />
                    <Route path="/buildings" element={<BuildingsPage />} />
                    <Route
                      path="/buildings/:id"
                      element={<BuildingDetailPage />}
                    />
                    <Route path="/owners" element={<OwnersPage />} />
                    <Route path="/owners/:id" element={<OwnerDetailPage />} />
                    <Route path="/tenants" element={<TenantList />} />
                    <Route path="/tenants/:id" element={<TenantDetail />} />
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/maintenance" element={<MaintenancePage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/calendar" element={<ManagerCalendarPage />} />
                    <Route path="/staff" element={<StaffList />} />
                    <Route path="/staff/:id" element={<StaffDetail />} />
                    <Route path="/settings" element={<ManagerSettingsPage />} />
                  </Routes>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AnimatePresence>
  );
}

export default App;
