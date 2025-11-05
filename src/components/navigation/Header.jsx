import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Menu, X, Bell, Search } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import Input from "../ui/Input";

const Header = ({ onMenuClick, sidebarOpen }) => {
  const { t } = useTranslation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <motion.button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            title={t("common.toggleSidebar")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-gray-500" />
              ) : (
                <Menu className="h-5 w-5 text-gray-500" />
              )}
            </motion.div>
          </motion.button>

          {/* Search Bar */}
          <motion.div
            className="hidden md:block w-64"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <Input
                placeholder={t("common.search")}
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-0 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                size="sm"
              />
            </div>
          </motion.div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Notifications */}
          <motion.button
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={t("common.notifications")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="h-5 w-5 text-gray-500" />
            <motion.span
              className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              3
            </motion.span>
          </motion.button>

          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
