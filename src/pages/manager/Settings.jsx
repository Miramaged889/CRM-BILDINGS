import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../stores/themeStore";
import { useLanguageStore } from "../../stores/languageStore";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Avatar from "../../components/ui/Avatar";
import {
  Sun,
  Moon,
  Globe,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Bell,
  Shield,
  Settings as SettingsIcon,
  Camera,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Info,
} from "lucide-react";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage, direction } = useLanguageStore();

  // State for all settings
  const [activeTab, setActiveTab] = useState("appearance");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Mock user data
  const [userData, setUserData] = useState({
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 234 567 8900",
    position: "Property Manager",
    department: "Management",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
  });

  // Mock company data
  const [companyData, setCompanyData] = useState({
    name: "RealEstate Pro",
    address: "123 Business St, City, State 12345",
    phone: "+1 234 567 8901",
    email: "info@realestatepro.com",
    website: "www.realestatepro.com",
    taxId: "12-3456789",
    licenseNumber: "RE-2024-001",
  });

  // Mock settings data
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      leaseReminders: true,
      paymentReminders: true,
      maintenanceAlerts: true,
      systemUpdates: false,
    },
    system: {
      dateFormat: "mm/dd/yyyy",
      timeFormat: "12hour",
      currency: "usd",
      timezone: "est",
      weekStart: "monday",
      itemsPerPage: "25",
      autoSave: true,
      backupFrequency: "weekly",
      dataRetention: "yearly",
    },
  });

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleSave = async (section) => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: "success", text: t("settings.updateSuccess") });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm(t("settings.confirmReset"))) {
      setMessage({ type: "success", text: t("settings.resetSuccess") });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const tabs = [
    { id: "appearance", label: t("settings.appearance"), icon: Sun },
    { id: "profile", label: t("settings.profile"), icon: User },
    { id: "company", label: t("settings.companyInfo"), icon: Building },
    { id: "notifications", label: t("settings.notifications"), icon: Bell },
    { id: "security", label: t("settings.security"), icon: Shield },
    { id: "system", label: t("settings.system"), icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {t("settings.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("settings.managePreferences")}
              </p>
            </div>
            {message.text && (
              <div
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  message.type === "success"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-1"
          >
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("settings.preferences")}
                </h3>
              </div>
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-3" : "mr-3"
                        }`}
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="xl:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      {t("settings.appearance")}
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                          {t("settings.theme")}
                        </label>
                        <div className="flex space-x-3 rtl:space-x-reverse">
                          <Button
                            variant={theme === "light" ? "primary" : "outline"}
                            size="sm"
                            onClick={() => theme === "dark" && toggleTheme()}
                            className="flex items-center"
                          >
                            <Sun
                              className={`h-4 w-4 ${
                                direction === "rtl" ? "ml-2" : "mr-2"
                              }`}
                            />
                            {t("settings.lightMode")}
                          </Button>
                          <Button
                            variant={theme === "dark" ? "primary" : "outline"}
                            size="sm"
                            onClick={() => theme === "light" && toggleTheme()}
                            className="flex items-center"
                          >
                            <Moon
                              className={`h-4 w-4 ${
                                direction === "rtl" ? "ml-2" : "mr-2"
                              }`}
                            />
                            {t("settings.darkMode")}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                          {t("settings.selectLanguage")}
                        </label>
                        <div className="flex space-x-3 rtl:space-x-reverse">
                          <Button
                            variant={language === "en" ? "primary" : "outline"}
                            size="sm"
                            onClick={() => handleLanguageChange("en")}
                            className="flex items-center"
                          >
                            <Globe
                              className={`h-4 w-4 ${
                                direction === "rtl" ? "ml-2" : "mr-2"
                              }`}
                            />
                            {t("settings.english")}
                          </Button>
                          <Button
                            variant={language === "ar" ? "primary" : "outline"}
                            size="sm"
                            onClick={() => handleLanguageChange("ar")}
                            className="flex items-center"
                          >
                            <Globe
                              className={`h-4 w-4 ${
                                direction === "rtl" ? "ml-2" : "mr-2"
                              }`}
                            />
                            {t("settings.arabic")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Profile Settings */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      {t("settings.personalInfo")}
                    </h3>
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Avatar
                          src={userData.avatar}
                          alt={userData.name}
                          size="xl"
                        />
                        <div className="flex-1">
                          <Button variant="outline" size="sm">
                            <Camera
                              className={`h-4 w-4 ${
                                direction === "rtl" ? "ml-2" : "mr-2"
                              }`}
                            />
                            {t("settings.changeAvatar")}
                          </Button>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {t("settings.uploadImage")}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.name")}
                          </label>
                          <Input
                            value={userData.name}
                            onChange={(e) =>
                              setUserData({ ...userData, name: e.target.value })
                            }
                            placeholder={t("settings.name")}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.email")}
                          </label>
                          <Input
                            type="email"
                            value={userData.email}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                email: e.target.value,
                              })
                            }
                            placeholder={t("settings.email")}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.phone")}
                          </label>
                          <Input
                            value={userData.phone}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                phone: e.target.value,
                              })
                            }
                            placeholder={t("settings.phone")}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.position")}
                          </label>
                          <Input
                            value={userData.position}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                position: e.target.value,
                              })
                            }
                            placeholder={t("settings.position")}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.department")}
                          </label>
                          <Input
                            value={userData.department}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                department: e.target.value,
                              })
                            }
                            placeholder={t("settings.department")}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                        <Button variant="outline" onClick={handleReset}>
                          {t("settings.reset")}
                        </Button>
                        <Button
                          onClick={() => handleSave("profile")}
                          disabled={isLoading}
                        >
                          <Save
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-2" : "mr-2"
                            }`}
                          />
                          {t("settings.save")}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Company Settings */}
              {activeTab === "company" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      {t("settings.companyInfo")}
                    </h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.companyName")}
                          </label>
                          <Input
                            value={companyData.name}
                            onChange={(e) =>
                              setCompanyData({
                                ...companyData,
                                name: e.target.value,
                              })
                            }
                            placeholder={t("settings.companyName")}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.companyAddress")}
                          </label>
                          <Input
                            value={companyData.address}
                            onChange={(e) =>
                              setCompanyData({
                                ...companyData,
                                address: e.target.value,
                              })
                            }
                            placeholder={t("settings.companyAddress")}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.companyPhone")}
                          </label>
                          <Input
                            value={companyData.phone}
                            onChange={(e) =>
                              setCompanyData({
                                ...companyData,
                                phone: e.target.value,
                              })
                            }
                            placeholder={t("settings.companyPhone")}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.companyEmail")}
                          </label>
                          <Input
                            type="email"
                            value={companyData.email}
                            onChange={(e) =>
                              setCompanyData({
                                ...companyData,
                                email: e.target.value,
                              })
                            }
                            placeholder={t("settings.companyEmail")}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.companyWebsite")}
                          </label>
                          <Input
                            value={companyData.website}
                            onChange={(e) =>
                              setCompanyData({
                                ...companyData,
                                website: e.target.value,
                              })
                            }
                            placeholder={t("settings.companyWebsite")}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.taxId")}
                          </label>
                          <Input
                            value={companyData.taxId}
                            onChange={(e) =>
                              setCompanyData({
                                ...companyData,
                                taxId: e.target.value,
                              })
                            }
                            placeholder={t("settings.taxId")}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.licenseNumber")}
                          </label>
                          <Input
                            value={companyData.licenseNumber}
                            onChange={(e) =>
                              setCompanyData({
                                ...companyData,
                                licenseNumber: e.target.value,
                              })
                            }
                            placeholder={t("settings.licenseNumber")}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                        <Button variant="outline" onClick={handleReset}>
                          {t("settings.reset")}
                        </Button>
                        <Button
                          onClick={() => handleSave("company")}
                          disabled={isLoading}
                        >
                          <Save
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-2" : "mr-2"
                            }`}
                          />
                          {t("settings.save")}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      {t("settings.notifications")}
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {[
                          {
                            key: "email",
                            label: t("settings.emailNotifications"),
                          },
                          { key: "sms", label: t("settings.smsNotifications") },
                          {
                            key: "push",
                            label: t("settings.pushNotifications"),
                          },
                          {
                            key: "leaseReminders",
                            label: t("settings.leaseReminders"),
                          },
                          {
                            key: "paymentReminders",
                            label: t("settings.paymentReminders"),
                          },
                          {
                            key: "maintenanceAlerts",
                            label: t("settings.maintenanceAlerts"),
                          },
                          {
                            key: "systemUpdates",
                            label: t("settings.systemUpdates"),
                          },
                        ].map((notification) => (
                          <div
                            key={notification.key}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {notification.label}
                              </h4>
                            </div>
                            <button
                              onClick={() =>
                                setSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    [notification.key]:
                                      !settings.notifications[notification.key],
                                  },
                                })
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.notifications[notification.key]
                                  ? "bg-blue-600"
                                  : "bg-gray-200 dark:bg-gray-600"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings.notifications[notification.key]
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                        <Button variant="outline" onClick={handleReset}>
                          {t("settings.reset")}
                        </Button>
                        <Button
                          onClick={() => handleSave("notifications")}
                          disabled={isLoading}
                        >
                          <Save
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-2" : "mr-2"
                            }`}
                          />
                          {t("settings.save")}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      {t("settings.security")}
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                          {t("settings.changePassword")}
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              {t("settings.currentPassword")}
                            </label>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={t("settings.currentPassword")}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              {t("settings.newPassword")}
                            </label>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder={t("settings.newPassword")}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              {t("settings.confirmPassword")}
                            </label>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={t("settings.confirmPassword")}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {t("settings.twoFactorAuth")}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          {t("settings.enabled")}
                        </Button>
                      </div>

                      <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                        <Button variant="outline" onClick={handleReset}>
                          {t("settings.reset")}
                        </Button>
                        <Button
                          onClick={() => handleSave("security")}
                          disabled={isLoading}
                        >
                          <Save
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-2" : "mr-2"
                            }`}
                          />
                          {t("settings.save")}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* System Settings */}
              {activeTab === "system" && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      {t("settings.system")}
                    </h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.dateFormat")}
                          </label>
                          <select
                            value={settings.system.dateFormat}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                system: {
                                  ...settings.system,
                                  dateFormat: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="mm/dd/yyyy">
                              {t("settings.mmdd")}
                            </option>
                            <option value="dd/mm/yyyy">
                              {t("settings.ddmmyy")}
                            </option>
                            <option value="yyyy-mm-dd">
                              {t("settings.yyyymmdd")}
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.timeFormat")}
                          </label>
                          <select
                            value={settings.system.timeFormat}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                system: {
                                  ...settings.system,
                                  timeFormat: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="12hour">
                              {t("settings.12hour")}
                            </option>
                            <option value="24hour">
                              {t("settings.24hour")}
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.currency")}
                          </label>
                          <select
                            value={settings.system.currency}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                system: {
                                  ...settings.system,
                                  currency: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="usd">{t("settings.usd")}</option>
                            <option value="eur">{t("settings.eur")}</option>
                            <option value="gbp">{t("settings.gbp")}</option>
                            <option value="sar">{t("settings.sar")}</option>
                            <option value="aed">{t("settings.aed")}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.timezone")}
                          </label>
                          <select
                            value={settings.system.timezone}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                system: {
                                  ...settings.system,
                                  timezone: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="utc">{t("settings.utc")}</option>
                            <option value="gmt">{t("settings.gmt")}</option>
                            <option value="est">{t("settings.est")}</option>
                            <option value="pst">{t("settings.pst")}</option>
                            <option value="cet">{t("settings.cet")}</option>
                            <option value="ast">{t("settings.ast")}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.weekStart")}
                          </label>
                          <select
                            value={settings.system.weekStart}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                system: {
                                  ...settings.system,
                                  weekStart: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="monday">
                              {t("settings.monday")}
                            </option>
                            <option value="sunday">
                              {t("settings.sunday")}
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            {t("settings.itemsPerPage")}
                          </label>
                          <select
                            value={settings.system.itemsPerPage}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                system: {
                                  ...settings.system,
                                  itemsPerPage: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="10">{t("settings.10")}</option>
                            <option value="25">{t("settings.25")}</option>
                            <option value="50">{t("settings.50")}</option>
                            <option value="100">{t("settings.100")}</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {t("settings.autoSave")}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Automatically save changes as you work
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setSettings({
                                ...settings,
                                system: {
                                  ...settings.system,
                                  autoSave: !settings.system.autoSave,
                                },
                              })
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.system.autoSave
                                ? "bg-blue-600"
                                : "bg-gray-200 dark:bg-gray-600"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.system.autoSave
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                        <Button variant="outline" onClick={handleReset}>
                          {t("settings.reset")}
                        </Button>
                        <Button
                          onClick={() => handleSave("system")}
                          disabled={isLoading}
                        >
                          <Save
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-2" : "mr-2"
                            }`}
                          />
                          {t("settings.save")}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
