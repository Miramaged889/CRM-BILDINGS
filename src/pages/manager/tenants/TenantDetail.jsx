import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../stores/languageStore";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  FileText,
  BarChart3,
  Users,
  Award,
  Home,
  CreditCard,
  Shield,
  Car,
  Heart,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Avatar from "../../../components/ui/Avatar";

const TenantDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app, fetch by ID
  const tenant = {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 234 567 8900",
    unit: "A-101",
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    status: "active",
    rent: 1200,
    deposit: 2400,
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    emergencyContact: {
      name: "Jane Smith",
      phone: "+1 234 567 8901",
      relation: "Spouse",
    },
    paymentHistory: [
      {
        id: 1,
        date: "2024-01-01",
        amount: 1200,
        status: "paid",
        method: "Bank Transfer",
      },
      {
        id: 2,
        date: "2024-02-01",
        amount: 1200,
        status: "paid",
        method: "Bank Transfer",
      },
      {
        id: 3,
        date: "2024-03-01",
        amount: 1200,
        status: "pending",
        method: "Bank Transfer",
      },
    ],
    maintenanceRequests: [
      {
        id: 1,
        title: "Kitchen faucet repair",
        date: "2024-01-15",
        status: "completed",
        priority: "medium",
      },
      {
        id: 2,
        title: "AC unit maintenance",
        date: "2024-02-10",
        status: "in_progress",
        priority: "high",
      },
    ],
    recentActivity: [
      {
        id: 1,
        action: "Payment received",
        date: "2024-02-01",
        type: "payment",
      },
      {
        id: 2,
        action: "Maintenance request submitted",
        date: "2024-01-15",
        type: "maintenance",
      },
      {
        id: 3,
        action: "Lease renewal reminder sent",
        date: "2024-01-10",
        type: "lease",
      },
    ],
  };

  const statusColors = {
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    inactive:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
  };

  const paymentStatusColors = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300",
    overdue:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300",
  };

  const tabs = [
    { id: "overview", label: t("tenants.personalInfo"), icon: User },
    { id: "lease", label: t("tenants.leaseInfo"), icon: FileText },
    { id: "payments", label: t("tenants.paymentHistory"), icon: CreditCard },
    {
      id: "maintenance",
      label: t("tenants.maintenanceRequests"),
      icon: Shield,
    },
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Avatar src={tenant.avatar} alt={tenant.name} size="xl" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {tenant.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        statusColors[tenant.status]
                      }`}
                    >
                      {t(`tenants.${tenant.status}`)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 capitalize flex items-center">
                      <Home
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {t("tenants.unit")}: {tenant.unit}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                      <DollarSign
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      ${tenant.rent}/month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md flex-1 sm:flex-none">
                <Edit
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("tenants.editProfile")}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-0 overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8 rtl:space-x-reverse px-6">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                            activeTab === tab.id
                              ? "border-blue-500 text-blue-600 dark:text-blue-400"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-2" : "mr-2"
                            }`}
                          />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("tenants.personalInfo")}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.name")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {tenant.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Mail className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.email")}
                                </span>
                                <p className="text-gray-900 dark:text-white text-sm">
                                  {tenant.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <Phone className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.phone")}
                                </span>
                                <p className="text-gray-900 dark:text-white text-sm">
                                  {tenant.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("tenants.emergencyContact")}
                          </h3>
                          <div className="space-y-3">
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                {t("tenants.emergencyName")}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {tenant.emergencyContact.name}
                              </p>
                            </div>
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                {t("tenants.emergencyPhone")}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {tenant.emergencyContact.phone}
                              </p>
                            </div>
                            <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                {t("tenants.emergencyRelation")}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {tenant.emergencyContact.relation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "lease" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("tenants.leaseInfo")}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Home className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.unit")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {tenant.unit}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.leaseStart")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {new Date(
                                    tenant.leaseStart
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.leaseEnd")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {new Date(
                                    tenant.leaseEnd
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Financial Details
                          </h3>
                          <div className="space-y-3">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                {t("tenants.rentAmount")}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                ${tenant.rent}/month
                              </p>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                {t("tenants.deposit")}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                ${tenant.deposit}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "payments" && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("tenants.paymentHistory")}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                Date
                              </th>
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                Amount
                              </th>
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                Method
                              </th>
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tenant.paymentHistory.map((payment, index) => (
                              <tr
                                key={payment.id}
                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">
                                  {new Date(payment.date).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4 text-gray-900 dark:text-white font-semibold">
                                  ${payment.amount.toLocaleString()}
                                </td>
                                <td className="py-4 px-4 text-gray-900 dark:text-white">
                                  {payment.method}
                                </td>
                                <td className="py-4 px-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                      paymentStatusColors[payment.status]
                                    } flex items-center w-fit`}
                                  >
                                    {payment.status === "paid" ? (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                      <Clock className="h-3 w-3 mr-1" />
                                    )}
                                    {payment.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === "maintenance" && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("tenants.maintenanceRequests")}
                      </h3>
                      <div className="space-y-4">
                        {tenant.maintenanceRequests.map((request, index) => (
                          <div
                            key={request.id}
                            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {request.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(request.date).toLocaleDateString()}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  request.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }`}
                              >
                                {request.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rent Info */}
            <motion.div
              initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                <div className="mb-4">
                  <h3
                    className={`text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between ${
                      direction === "rtl" ? "flex-row" : ""
                    }`}
                  >
                    <span className="flex items-center">
                      <DollarSign
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        } text-green-600`}
                      />
                      {t("tenants.rentAmount")}
                    </span>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        ${tenant.rent}
                      </span>
                      <span className="text-gray-500 text-sm">/month</span>
                    </div>
                  </h3>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t("tenants.quickActions")}
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    size="sm"
                  >
                    <MessageSquare
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("tenants.sendMessage")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
                    size="sm"
                  >
                    <Mail
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("tenants.sendEmail")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
                    size="sm"
                  >
                    <FileText
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("tenants.viewLease")}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock
                    className={`h-5 w-5 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    } text-orange-600`}
                  />
                  {t("tenants.recentActivity")}
                </h3>
                <div className="space-y-3">
                  {tenant.recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 rtl:space-x-reverse"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetail;
