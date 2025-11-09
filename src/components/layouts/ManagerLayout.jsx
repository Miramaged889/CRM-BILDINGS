import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../store/slices/authSlice";
import { useLanguageStore } from "../../stores/languageStore";
import { useThemeStore } from "../../stores/themeStore";
import { X, Bell, Search, LogOut, Sun, Moon, Globe } from "lucide-react";
import Icon from "../ui/Icon";
import Input from "../ui/Input";
import { getNotifications } from "../../services/api";

const managerNavItems = [
  { name: "nav.dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { name: "nav.units", href: "/units", icon: "Building" },
  { name: "nav.tenants", href: "/tenants", icon: "Users" },
  { name: "nav.owners", href: "/owners", icon: "UserSquare2" },
  { name: "nav.stock", href: "/stock", icon: "Box" },
  { name: "nav.payments", href: "/payments", icon: "CreditCard" },
  { name: "nav.reports", href: "/reports", icon: "BarChart3" },
  { name: "nav.calendar", href: "/calendar", icon: "Calendar" },
  { name: "nav.citiesDistricts", href: "/cities-districts", icon: "MapPin" },
];

const ManagerLayout = ({ children }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { count } = useAppSelector((state) => state.notifications);
  const { direction, toggleLanguage } = useLanguageStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const notificationsFetchedRef = useRef(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);

  // Initialize language and direction
  useEffect(() => {
    const { language } = useLanguageStore.getState();
    const direction = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    document.body.dir = direction;
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const formatNotificationTimestamp = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return date.toLocaleString(direction === "rtl" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotificationsLoading(true);
      setNotificationsError(null);
      try {
        const response = await getNotifications();
        const rawNotifications = Array.isArray(response)
          ? response
          : response?.results || response?.data || [];

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const parsedNotifications = rawNotifications
          .filter((item) => {
            const createdAt = new Date(
              item.created_at || item.createdAt || item.date
            );
            return createdAt >= sixMonthsAgo;
          })
          .map((item) => ({
            id: item.id ?? item.pk ?? item.uuid ?? Math.random().toString(36),
            message: item.message || item.title || "",
            createdAt: item.created_at || item.createdAt || item.date || null,
          }))
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
          });

        setNotifications(parsedNotifications);
        notificationsFetchedRef.current = true;
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotificationsError(
          error?.message ||
            (direction === "rtl"
              ? "تعذر تحميل الإشعارات"
              : "Unable to load notifications")
        );
      } finally {
        setNotificationsLoading(false);
      }
    };

    if (showNotifications && !notificationsFetchedRef.current) {
      fetchNotifications();
    }
  }, [showNotifications, direction]);

  const unreadCount =
    typeof count === "number" && count >= 0 ? count : notifications.length;

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
          className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-3"
          variants={contentVariants}
        >
          {/* Logout Button */}
          <motion.button
            onClick={() => dispatch(logoutUser())}
            className="w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2.5 rounded-lg transition-all duration-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:shadow-md hover:scale-[1.01] group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <motion.div
              className="relative z-10"
              whileHover={{ scale: 1.1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
              }}
            >
              <LogOut className="h-4 w-4 transition-all duration-300 group-hover:text-red-700 dark:group-hover:text-red-300" />
            </motion.div>
            <span className="text-sm font-medium transition-all duration-300 relative z-10">
              {t("nav.logout")}
            </span>
          </motion.button>

          {/* System Status */}
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
          className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4"
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
              <div className="relative" ref={notificationsRef}>
                <motion.button
                  className="relative p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={t("common.notifications")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={showNotifications}
                >
                  <Bell className="h-4 w-4 text-gray-500" />
                  {!!unreadCount && (
                    <motion.span
                      className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      key="manager-notifications"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-30 ${
                        direction === "rtl" ? "left-0" : "right-0"
                      }`}
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {t("common.notifications")}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notificationsLoading
                            ? t("common.loading")
                            : `${notifications.length}`}
                        </span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notificationsLoading ? (
                          <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            {t("common.loading")}
                          </div>
                        ) : notificationsError ? (
                          <div className="px-4 py-6 text-center text-sm text-red-500 dark:text-red-400">
                            {notificationsError}
                          </div>
                        ) : notifications.length ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/60 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.message ||
                                    (direction === "rtl"
                                      ? "إشعار"
                                      : "Notification")}
                                </p>
                                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                  {formatNotificationTimestamp(
                                    notification.createdAt
                                  )}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            {t("dashboard.noActivity")}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
              <motion.button
                onClick={() => {
                  const currentLang = useLanguageStore.getState().language;
                  toggleLanguage(currentLang === "ar" ? "en" : "ar");
                }}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={t("common.language")}
              >
                <Globe className="h-4 w-4 text-gray-500" />
              </motion.button>
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
