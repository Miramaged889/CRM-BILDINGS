import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores/authStore";
import { useLanguageStore } from "../../stores/languageStore";
import { useThemeStore } from "../../stores/themeStore";
import {
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import Icon from "../ui/Icon";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Input from "../ui/Input";

const managerNavItems = [
  { name: "nav.dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { name: "nav.buildings", href: "/buildings", icon: "Building2" },
  { name: "nav.units", href: "/units", icon: "Building" },
  { name: "nav.tenants", href: "/tenants", icon: "Users" },
  { name: "nav.owners", href: "/owners", icon: "UserSquare2" },
  { name: "nav.payments", href: "/payments", icon: "CreditCard" },
  { name: "nav.maintenance", href: "/maintenance", icon: "Wrench" },
  { name: "nav.reports", href: "/reports", icon: "BarChart3" },
  { name: "nav.calendar", href: "/calendar", icon: "Calendar" },
  { name: "nav.staff", href: "/staff", icon: "UserCog" },
  { name: "nav.settings", href: "/settings", icon: "Settings" },
];

const ManagerLayout = ({ children }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { direction, toggleLanguage } = useLanguageStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  // Initialize language and direction
  useEffect(() => {
    const { language } = useLanguageStore.getState();
    const direction = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    document.body.dir = direction;
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      },
    },
    closed: {
      x: direction === "rtl" ? 256 : -256,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      },
    },
  };

  const contentVariants = {
    open: {
      opacity: 1,
      transition: { delay: 0.1, duration: 0.3 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial="closed"
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`
          fixed lg:static inset-y-0 ${
            direction === "rtl" ? "right-0" : "left-0"
          }
          z-50 w-64 bg-white dark:bg-gray-800 shadow-2xl
          lg:translate-x-0 lg:shadow-lg lg:border-r lg:border-gray-200 lg:dark:border-gray-700
          flex flex-col
          ${!sidebarOpen ? "lg:hidden" : ""}
        `}
      >
        {/* Sidebar Header */}
        <motion.div
          className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          variants={contentVariants}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <motion.div
              className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-sm"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon name="Building" className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("common.propertyManagement")}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("common.propertyManagementDescription")}
              </p>
            </div>
          </motion.div>

          <motion.button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="h-4 w-4 text-gray-500" />
          </motion.button>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          variants={contentVariants}
        >
          {managerNavItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: direction === "rtl" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.1 }}
            >
              <NavLink
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <motion.div
                      className="relative z-10"
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Icon
                        name={item.icon}
                        className={`h-4 w-4 transition-all duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400 group-hover:text-primary-500"
                        }`}
                      />
                    </motion.div>

                    <span className="text-sm font-medium transition-all duration-300 relative z-10">
                      {t(item.name)}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={`absolute ${
                          direction === "rtl" ? "left-2" : "right-2"
                        } w-1.5 h-1.5 bg-white rounded-full shadow-sm`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </motion.nav>

        {/* Sidebar Footer */}
        <motion.div
          className="p-3 border-t border-gray-200 dark:border-gray-700"
          variants={contentVariants}
        >
          <div className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-md flex items-center justify-center">
              <Icon name="Settings" className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900 dark:text-white">
                {t("common.systemStatus")}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {t("common.allSystemsOperational")}
              </p>
            </div>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3"
        >
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {!sidebarOpen && (
                <motion.button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  title={t("common.openSidebar")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon name="Building" className="h-4 w-4 text-gray-500" />
                  </motion.div>
                </motion.button>
              )}

              {/* Search Bar */}
              <motion.div
                className="hidden md:block w-56"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative group">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <Input
                    placeholder={t("common.search")}
                    className="pl-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-sm"
                    size="sm"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* Notifications */}
              <motion.button
                className="relative p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={t("common.notifications")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-4 w-4 text-gray-500" />
                <motion.span
                  className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  3
                </motion.span>
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isDark ? t("common.lightMode") : t("common.darkMode")}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-gray-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-500" />
                )}
              </motion.button>

              {/* Language Toggle */}
              <div className="relative" ref={languageDropdownRef}>
                <motion.button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={t("common.language")}
                >
                  <Globe className="h-4 w-4 text-gray-500" />
                </motion.button>

                {/* Language Dropdown Menu */}
                <AnimatePresence>
                  {languageDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute ${
                        direction === "rtl" ? "left-0" : "right-0"
                      } mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50`}
                    >
                      <button
                        onClick={() => {
                          toggleLanguage("en");
                          setLanguageDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <span className="text-sm">🇺🇸</span>
                        <span>English</span>
                      </button>

                      <button
                        onClick={() => {
                          toggleLanguage("ar");
                          setLanguageDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <span className="text-sm">🇸🇦</span>
                        <span>العربية</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 rtl:space-x-reverse p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Avatar src={user?.avatar} alt={user?.name} size="sm" />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {t(`common.${user?.role}`)}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute ${
                        direction === "rtl" ? "left-0" : "right-0"
                      } mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50`}
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
                        <User className="h-4 w-4" />
                        <span>{t("common.profile")}</span>
                      </button>

                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
                        <Settings className="h-4 w-4" />
                        <span>{t("common.settings")}</span>
                      </button>

                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                      <button
                        onClick={logout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t("nav.logout")}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50 dark:from-gray-900/50 dark:via-transparent dark:to-gray-800/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
