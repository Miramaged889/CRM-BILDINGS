import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import LoginPage from './pages/auth/LoginPage';
import ManagerLayout from './components/layouts/ManagerLayout';
import StaffLayout from './components/layouts/StaffLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import UnitsPage from './pages/manager/Units';
import UnitDetailPage from './pages/manager/UnitDetail';
import TenantList from './pages/manager/tenants/TenantList';
import TenantDetail from './pages/manager/tenants/TenantDetail';
import LeasesPage from './pages/manager/Leases';
import PaymentsPage from './pages/manager/Payments';
import MaintenancePage from './pages/manager/Maintenance';
import ReportsPage from './pages/manager/Reports';
import StaffList from "./pages/manager/staff/StaffList";
import StaffDetail from "./pages/manager/staff/StaffDetail";
import ManagerSettingsPage from './pages/manager/Settings';

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard';
import StaffUnitsPage from './pages/staff/Units';
import StaffTenantsPage from './pages/staff/Tenants';
import StaffPaymentsPage from './pages/staff/Payments';
import StaffMaintenancePage from './pages/staff/Maintenance';
import CalendarPage from './pages/staff/Calendar';
import StaffSettingsPage from './pages/staff/Settings';

function App() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Routes>
          {user.role === 'manager' ? (
            <Route path="/*" element={
              <ProtectedRoute roles={['manager']}>
                <ManagerLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<ManagerDashboard />} />
                    <Route path="/units" element={<UnitsPage />} />
                    <Route path="/units/:id" element={<UnitDetailPage />} />
                    <Route path="/tenants" element={<TenantList />} />
                    <Route path="/tenants/:id" element={<TenantDetail />} />
                    <Route path="/leases" element={<LeasesPage />} />
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/maintenance" element={<MaintenancePage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/staff" element={<StaffList />} />
                    <Route path="/staff/:id" element={<StaffDetail />} />
                    <Route path="/settings" element={<ManagerSettingsPage />} />
                  </Routes>
                </ManagerLayout>
              </ProtectedRoute>
            } />
          ) : (
            <Route path="/*" element={
              <ProtectedRoute roles={['staff']}>
                <StaffLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<StaffDashboard />} />
                    <Route path="/units" element={<StaffUnitsPage />} />
                    <Route path="/tenants" element={<StaffTenantsPage />} />
                    <Route path="/payments" element={<StaffPaymentsPage />} />
                    <Route path="/maintenance" element={<StaffMaintenancePage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/settings" element={<StaffSettingsPage />} />
                  </Routes>
                </StaffLayout>
              </ProtectedRoute>
            } />
          )}
        </Routes>
      </div>
    </AnimatePresence>
  );
}

export default App;