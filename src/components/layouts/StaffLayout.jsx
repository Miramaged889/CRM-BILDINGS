import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../navigation/Sidebar";
import Header from "../navigation/Header";

const staffNavItems = [
  { name: "nav.dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { name: "nav.units", href: "/units", icon: "Building" },
  { name: "nav.tenants", href: "/tenants", icon: "Users" },
  { name: "nav.payments", href: "/payments", icon: "CreditCard" },
  { name: "nav.maintenance", href: "/maintenance", icon: "Wrench" },
  { name: "nav.calendar", href: "/calendar", icon: "Calendar" },
  { name: "nav.settings", href: "/settings", icon: "Settings" },
];

const StaffLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        navItems={staffNavItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
