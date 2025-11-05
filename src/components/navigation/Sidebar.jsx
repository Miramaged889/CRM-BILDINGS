import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useLanguageStore } from "../../stores/languageStore";
import { useAuthStore } from "../../stores/authStore";
import Icon from "../ui/Icon";

const Sidebar = ({ navItems, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const { logout } = useAuthStore();

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
      x: direction === "rtl" ? 288 : -288,
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
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`
          fixed lg:static inset-y-0 ${
            direction === "rtl" ? "right-0" : "left-0"
          }
          z-50 w-72 bg-white dark:bg-gray-800 shadow-2xl
          lg:translate-x-0 lg:shadow-lg lg:border-r lg:border-gray-200 lg:dark:border-gray-700
          flex flex-col
          ${!isOpen ? "lg:hidden" : ""}
        `}
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700"
          variants={contentVariants}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <motion.div
              className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon name="Building" className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                RealEstate CRM
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                Property Management
              </p>
            </div>
          </motion.div>

          <motion.button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="h-5 w-5 text-gray-500" />
          </motion.button>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          variants={contentVariants}
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: direction === "rtl" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.1 }}
            >
              <NavLink
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 transform scale-[1.02]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-500 hover:shadow-sm hover:scale-[1.01]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Background gradient effect */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 opacity-10"
                        layoutId="activeBackground"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}

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
                        className={`h-5 w-5 transition-all duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400 group-hover:text-primary-500"
                        }`}
                      />
                    </motion.div>

                    <span className="font-medium transition-all duration-300 relative z-10">
                      {t(item.name)}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-sm"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-primary-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </motion.nav>

        {/* Footer */}
        <motion.div
          className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3"
          variants={contentVariants}
        >
          {/* Logout Button */}
          <motion.button
            onClick={logout}
            className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:shadow-md hover:scale-[1.01] group"
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
              <LogOut className="h-5 w-5 transition-all duration-300 group-hover:text-red-700 dark:group-hover:text-red-300" />
            </motion.div>
            <span className="font-medium transition-all duration-300 relative z-10">
              {t("nav.logout") || "Logout"}
            </span>
          </motion.button>

          {/* System Status */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Icon name="Settings" className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                System Status
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                All systems operational
              </p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Sidebar;
