import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { getCurrentUser } from "./store/slices/authSlice";
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
import ReportsPage from "./pages/manager/Reports";
import OwnersPage from "./pages/manager/onwers/Owners";
import OwnerDetailPage from "./pages/manager/onwers/OwnerDetail";
import ManagerCalendarPage from "./pages/manager/Calendar";
import Stock from "./pages/manager/Stock";
import CitiesAndDistricts from "./pages/manager/CitiesAndDistricts";

function App() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const { theme } = useThemeStore();

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Check if user has token on mount and fetch user data
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
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
                    <Route path="/owners" element={<OwnersPage />} />
                    <Route path="/owners/:id" element={<OwnerDetailPage />} />
                    <Route path="/tenants" element={<TenantList />} />
                    <Route path="/tenants/:id" element={<TenantDetail />} />
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/calendar" element={<ManagerCalendarPage />} />
                    <Route path="/stock" element={<Stock />} />
                    <Route
                      path="/cities-districts"
                      element={<CitiesAndDistricts />}
                    />
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
