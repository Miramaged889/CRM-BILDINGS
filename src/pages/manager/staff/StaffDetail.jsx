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
  Briefcase,
  Heart,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Avatar from "../../../components/ui/Avatar";

const StaffDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app, fetch by ID
  const staff = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@realestate.com",
    phone: "+1 (555) 123-4567",
    role: "propertyManager",
    department: "management",
    status: "active",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    joinDate: "2023-01-15",
    location: "New York Office",
    employeeId: "EMP001",
    salary: "$75,000",
    reportsTo: "CEO",
    emergencyContact: {
      name: "John Johnson",
      phone: "+1 (555) 987-6543",
      relation: "Spouse",
    },
    performance: {
      rating: 4.8,
      goals: 12,
      completed: 10,
    },
    attendance: {
      present: 95,
      absent: 3,
      late: 2,
    },
    leaveBalance: {
      vacation: 15,
      sick: 8,
      personal: 3,
    },
    recentActivity: [
      {
        id: 1,
        action: "Completed property inspection",
        date: "2024-01-15",
        type: "work",
      },
      {
        id: 2,
        action: "Attended team meeting",
        date: "2024-01-14",
        type: "meeting",
      },
      {
        id: 3,
        action: "Updated tenant records",
        date: "2024-01-13",
        type: "work",
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

  const tabs = [
    { id: "overview", label: t("staff.personalInfo"), icon: User },
    { id: "work", label: t("staff.workInfo"), icon: Briefcase },
    { id: "performance", label: t("staff.performance"), icon: BarChart3 },
    { id: "contact", label: t("staff.contactInfo"), icon: Phone },
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
                <Avatar src={staff.avatar} alt={staff.name} size="xl" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {staff.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        statusColors[staff.status]
                      }`}
                    >
                      {t(`staff.${staff.status}`)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 capitalize flex items-center">
                      <Building
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {t(`staff.${staff.role}`)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                      <MapPin
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {staff.location}
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
                {t("staff.editProfile")}
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
                            {t("staff.personalInfo")}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("staff.name")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {staff.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Mail className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("staff.email")}
                                </span>
                                <p className="text-gray-900 dark:text-white text-sm">
                                  {staff.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <Phone className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("staff.phone")}
                                </span>
                                <p className="text-gray-900 dark:text-white text-sm">
                                  {staff.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("staff.emergencyContact")}
                          </h3>
                          <div className="space-y-3">
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                {t("staff.emergencyName")}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {staff.emergencyContact.name}
                              </p>
                            </div>
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                {t("staff.emergencyPhone")}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {staff.emergencyContact.phone}
                              </p>
                            </div>
                            <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                {t("staff.emergencyRelation")}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {staff.emergencyContact.relation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "work" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("staff.workInfo")}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("staff.role")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {t(`staff.${staff.role}`)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Building className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("staff.department")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {t(`staff.${staff.department}`)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("staff.joinDate")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {new Date(
                                    staff.joinDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("staff.attendance")}
                          </h3>
                          <div className="space-y-3">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                Present Days
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {staff.attendance.present}%
                              </p>
                            </div>
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                Absent Days
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {staff.attendance.absent}
                              </p>
                            </div>
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                Late Arrivals
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {staff.attendance.late}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "performance" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                Performance Rating
                              </span>
                              <p className="text-2xl font-bold text-blue-600">
                                {staff.performance.rating}/5
                              </p>
                            </div>
                            <Award className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                Goals Completed
                              </span>
                              <p className="text-2xl font-bold text-green-600">
                                {staff.performance.completed}/
                                {staff.performance.goals}
                              </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          </div>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                Leave Balance
                              </span>
                              <p className="text-2xl font-bold text-purple-600">
                                {staff.leaveBalance.vacation} days
                              </p>
                            </div>
                            <Heart className="h-8 w-8 text-purple-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "contact" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("staff.contactInfo")}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Mail className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("staff.email")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {staff.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Phone className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("staff.phone")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {staff.phone}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("staff.workLocation")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {staff.location}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("staff.quickActions")}
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
                              {t("staff.sendMessage")}
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
                              {t("staff.sendEmail")}
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
                              {t("staff.viewSchedule")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Salary Info */}
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
                      {t("staff.salary")}
                    </span>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        {staff.salary}
                      </span>
                      <span className="text-gray-500 text-sm">/year</span>
                    </div>
                  </h3>
                </div>
              </Card>
            </motion.div>

            {/* Employee Info */}
            <motion.div
              initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <User
                    className={`h-5 w-5 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    } text-blue-600`}
                  />
                  {t("staff.employeeId")}
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="text-gray-600 dark:text-gray-400 text-sm block">
                      Employee ID
                    </span>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {staff.employeeId}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <span className="text-gray-600 dark:text-gray-400 text-sm block">
                      {t("staff.reportsTo")}
                    </span>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {staff.reportsTo}
                    </p>
                  </div>
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
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {staff.recentActivity.map((activity, index) => (
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

export default StaffDetail;
