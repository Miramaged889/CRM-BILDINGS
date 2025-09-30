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
  Plus,
  Star,
  Eye,
  Trash2,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Avatar from "../../../components/ui/Avatar";
import { LeaseForm, LeaseViewModal } from "../../../components/manger form";
import { ReviewForm, ReviewViewModal } from "../../../components/manger form";

const TenantDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [activeTab, setActiveTab] = useState("overview");

  // Form and modal states
  const [showLeaseForm, setShowLeaseForm] = useState(false);
  const [showLeaseViewModal, setShowLeaseViewModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviewViewModal, setShowReviewViewModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editingLease, setEditingLease] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  // Mock data - in real app, fetch by ID
  const getTenantData = (tenantId) => {
    // Sample data for different rental types
    const tenantData = {
      1: {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 234 567 8900",
        unit: "A-101",
        leaseStart: "2024-01-01",
        leaseEnd: "2024-12-31",
        status: "active",
        rentalType: "monthly",
        rent: 1200,
        deposit: 2400,
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      },
      7: {
        id: 7,
        name: "Ahmed Hassan",
        email: "ahmed.hassan@email.com",
        phone: "+1 234 567 8906",
        unit: "D-401",
        leaseStart: "2024-01-15",
        leaseEnd: "2024-01-20",
        status: "active",
        rentalType: "daily",
        rent: 80,
        deposit: 200,
        avatar:
          "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      },
    };

    return tenantData[tenantId] || tenantData[1];
  };

  const baseTenant = getTenantData(parseInt(id));
  const tenant = {
    ...baseTenant,
    emergencyContact: {
      name: "Jane Smith",
      phone: "+1 234 567 8901",
      relation: "Spouse",
    },
    paymentHistory:
      baseTenant.rentalType === "daily"
        ? [
            {
              id: 1,
              date: "2024-01-15",
              amount: 80,
              status: "paid",
              method: "Cash",
              period: "Day 1",
            },
            {
              id: 2,
              date: "2024-01-16",
              amount: 80,
              status: "paid",
              method: "Cash",
              period: "Day 2",
            },
            {
              id: 3,
              date: "2024-01-17",
              amount: 80,
              status: "pending",
              method: "Cash",
              period: "Day 3",
            },
          ]
        : [
            {
              id: 1,
              date: "2024-01-01",
              amount: 1200,
              status: "paid",
              method: "Bank Transfer",
              period: "January 2024",
            },
            {
              id: 2,
              date: "2024-02-01",
              amount: 1200,
              status: "paid",
              method: "Bank Transfer",
              period: "February 2024",
            },
            {
              id: 3,
              date: "2024-03-01",
              amount: 1200,
              status: "pending",
              method: "Bank Transfer",
              period: "March 2024",
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
    reviews: [
      {
        id: 1,
        rating: 5,
        comment:
          "Great tenant, always pays on time and maintains the unit well. Very respectful and communicative.",
        date: "2024-06-01",
        status: "positive",
        category: "payment",
      },
      {
        id: 2,
        rating: 4,
        comment:
          "Keeps the unit clean and reports issues promptly. Good communication.",
        date: "2024-07-15",
        status: "positive",
        category: "maintenance",
      },
    ],
    leases:
      baseTenant.rentalType === "daily"
        ? [
            {
              id: 1,
              unit: baseTenant.unit,
              startDate: baseTenant.leaseStart,
              endDate: baseTenant.leaseEnd,
              rent: baseTenant.rent,
              deposit: baseTenant.deposit,
              status: "active",
              rentalType: "daily",
              type: "short-term",
              utilities: "All included",
              petPolicy: "No pets allowed",
              parking: "Temporary parking",
            },
          ]
        : [
            {
              id: 1,
              unit: baseTenant.unit,
              startDate: baseTenant.leaseStart,
              endDate: baseTenant.leaseEnd,
              rent: baseTenant.rent,
              deposit: baseTenant.deposit,
              status: "active",
              rentalType: "monthly",
              type: "apartment",
              utilities: "Water, Electricity",
              petPolicy: "No pets allowed",
              parking: "1 space included",
            },
            {
              id: 2,
              unit: baseTenant.unit,
              startDate: "2023-01-01",
              endDate: "2023-12-31",
              rent: baseTenant.rent - 100,
              deposit: baseTenant.deposit - 200,
              status: "expired",
              rentalType: "monthly",
              type: "apartment",
              utilities: "Water, Electricity",
              petPolicy: "No pets allowed",
              parking: "1 space included",
            },
          ],
    rentalType: baseTenant.rentalType,
  };

  const statusColors = {
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    inactive:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    completed:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  };

  const rentalTypeColors = {
    monthly:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
    daily:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  };

  const paymentStatusColors = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300",
    overdue:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300",
  };

  const getRentalTypeColor = (rentalType) => {
    return rentalTypeColors[rentalType] || rentalTypeColors.monthly;
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
    { id: "reviews", label: t("tenants.reviews"), icon: MessageSquare },
    { id: "leases", label: t("tenants.leases"), icon: FileText },
  ];

  // Handler functions
  const handleAddLease = () => {
    setEditingLease(null);
    setShowLeaseForm(true);
  };

  const handleEditLease = (lease) => {
    setEditingLease(lease);
    setShowLeaseForm(true);
  };

  const handleViewLease = (lease) => {
    setSelectedLease(lease);
    setShowLeaseViewModal(true);
  };

  const handleSaveLease = (leaseData) => {
    console.log("Saving lease:", leaseData);
    setShowLeaseForm(false);
    setEditingLease(null);
  };

  const handleCloseLeaseForm = () => {
    setShowLeaseForm(false);
    setEditingLease(null);
  };

  const handleCloseLeaseViewModal = () => {
    setShowLeaseViewModal(false);
    setSelectedLease(null);
  };

  const handleAddReview = () => {
    setEditingReview(null);
    setShowReviewForm(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowReviewViewModal(true);
  };

  const handleSaveReview = (reviewData) => {
    console.log("Saving review:", reviewData);
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleCloseReviewViewModal = () => {
    setShowReviewViewModal(false);
    setSelectedReview(null);
  };

  const handlePrintLease = (lease) => {
    console.log("Printing lease:", lease);
    // Add print functionality here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div
                className={`flex items-center ${
                  direction === "rtl"
                    ? "space-x-reverse space-x-4"
                    : "space-x-4"
                }`}
              >
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
                      ${tenant.rent}/
                      {tenant.rentalType === "daily" ? "day" : "month"}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-0 overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav
                    className={`flex flex-wrap px-4 sm:px-6 overflow-x-auto ${
                      direction === "rtl"
                        ? "space-x-reverse space-x-2"
                        : "space-x-2"
                    }`}
                  >
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-3 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm flex items-center whitespace-nowrap transition-colors ${
                            activeTab === tab.id
                              ? "border-blue-500 text-blue-600 dark:text-blue-400"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                          }`}
                        >
                          <Icon
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              direction === "rtl"
                                ? "ml-1 sm:ml-2"
                                : "mr-1 sm:mr-2"
                            }`}
                          />
                          <span className="hidden sm:inline">{tab.label}</span>
                          <span className="sm:hidden">
                            {tab.label.split(" ")[0]}
                          </span>
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
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
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
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
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
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
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
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
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
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
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
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
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
                                ${tenant.rent}/
                                {tenant.rentalType === "daily"
                                  ? "day"
                                  : "month"}
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
                            <div
                              className={`p-3 rounded-lg border ${
                                tenant.rentalType === "daily"
                                  ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                                  : "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                              }`}
                            >
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                {t("tenants.rentalType")}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {t(`tenants.${tenant.rentalType}`)}
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
                            <tr
                              className={`border-b border-gray-200 dark:border-gray-700 ${
                                direction === "rtl" ? "flex-start" : "flex-end"
                              }`}
                            >
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                {t("tenants.date")}
                              </th>
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                {t("tenants.amount")}
                              </th>
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                {t("tenants.method")}
                              </th>
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                {t("tenants.status")}
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
                                      <CheckCircle
                                        className={`h-3 w-3 ${
                                          direction === "rtl" ? "ml-1" : "mr-1"
                                        }`}
                                      />
                                    ) : (
                                      <Clock
                                        className={`h-3 w-3 ${
                                          direction === "rtl" ? "ml-1" : "mr-1"
                                        }`}
                                      />
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

                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {t("tenants.reviews")}
                        </h3>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                          onClick={handleAddReview}
                        >
                          <Plus
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-2" : "mr-2"
                            }`}
                          />
                          {t("tenants.addReview")}
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {tenant.reviews.map((review, index) => (
                          <div
                            key={review.id}
                            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div
                                className={`flex items-center ${
                                  direction === "rtl"
                                    ? "space-x-reverse space-x-2"
                                    : "space-x-2"
                                }`}
                              >
                                <div
                                  className={`flex items-center ${
                                    direction === "rtl"
                                      ? "space-x-reverse space-x-1"
                                      : "space-x-1"
                                  }`}
                                >
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-amber-500 fill-amber-500"
                                          : "text-gray-300 dark:text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  review.status === "positive"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : review.status === "negative"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }`}
                              >
                                {review.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                              {review.comment}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {review.category}
                              </span>
                              <div
                                className={`flex ${
                                  direction === "rtl"
                                    ? "space-x-reverse space-x-2"
                                    : "space-x-2"
                                }`}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewReview(review)}
                                  title={t("common.view")}
                                  className="flex-1 sm:flex-none"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span
                                    className={`hidden sm:inline ${
                                      direction === "rtl" ? "mr-1" : "ml-1"
                                    }`}
                                  >
                                    {t("common.view")}
                                  </span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditReview(review)}
                                  title={t("common.edit")}
                                  className="flex-1 sm:flex-none"
                                >
                                  <Edit className="h-3 w-3" />
                                  <span
                                    className={`hidden sm:inline ${
                                      direction === "rtl" ? "mr-1" : "ml-1"
                                    }`}
                                  >
                                    {t("common.edit")}
                                  </span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                                  title={t("common.delete")}
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span
                                    className={`hidden sm:inline ${
                                      direction === "rtl" ? "mr-1" : "ml-1"
                                    }`}
                                  >
                                    {t("common.delete")}
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "leases" && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {t("tenants.leases")}
                        </h3>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                          onClick={handleAddLease}
                        >
                          <Plus
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-2" : "mr-2"
                            }`}
                          />
                          {t("tenants.addLease")}
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {tenant.leases.map((lease, index) => (
                          <div
                            key={lease.id}
                            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {lease.unit} - {lease.type}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(
                                    lease.startDate
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(lease.endDate).toLocaleDateString()}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                  lease.status === "active"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
                                    : lease.status === "expired"
                                    ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
                                }`}
                              >
                                {lease.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Rent:
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  ${lease.rent}/
                                  {lease.rentalType === "daily"
                                    ? "day"
                                    : "month"}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Deposit:
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  ${lease.deposit}
                                </p>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRentalTypeColor(
                                  lease.rentalType
                                )}`}
                              >
                                {t(`tenants.${lease.rentalType}`)}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                <div className="block sm:hidden">
                                  <div>Utilities: {lease.utilities}</div>
                                  <div>Parking: {lease.parking}</div>
                                </div>
                                <div className="hidden sm:block">
                                  Utilities: {lease.utilities} • Parking:{" "}
                                  {lease.parking}
                                </div>
                              </div>
                              <div
                                className={`flex ${
                                  direction === "rtl"
                                    ? "space-x-reverse space-x-2"
                                    : "space-x-2"
                                }`}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewLease(lease)}
                                  title={t("common.view")}
                                  className="flex-1 sm:flex-none"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span
                                    className={`hidden sm:inline ${
                                      direction === "rtl" ? "mr-1" : "ml-1"
                                    }`}
                                  >
                                    {t("common.view")}
                                  </span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditLease(lease)}
                                  title={t("common.edit")}
                                  className="flex-1 sm:flex-none"
                                >
                                  <Edit className="h-3 w-3" />
                                  <span
                                    className={`hidden sm:inline ${
                                      direction === "rtl" ? "mr-1" : "ml-1"
                                    }`}
                                  >
                                    {t("common.edit")}
                                  </span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                                  title={t("common.delete")}
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span
                                    className={`hidden sm:inline ${
                                      direction === "rtl" ? "mr-1" : "ml-1"
                                    }`}
                                  >
                                    {t("common.delete")}
                                  </span>
                                </Button>
                              </div>
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
                    <div
                      className={`flex items-center ${
                        direction === "rtl"
                          ? "space-x-reverse space-x-2"
                          : "space-x-2"
                      }`}
                    >
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        ${tenant.rent}
                      </span>
                      <span className="text-gray-500 text-sm">
                        /{tenant.rentalType === "daily" ? "day" : "month"}
                      </span>
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
                      className={`flex items-start ${
                        direction === "rtl"
                          ? "space-x-reverse space-x-3"
                          : "space-x-3"
                      }`}
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

      {/* Modals */}
      {showLeaseForm && (
        <LeaseForm
          lease={editingLease}
          onSave={handleSaveLease}
          onClose={handleCloseLeaseForm}
          isEdit={!!editingLease}
        />
      )}

      {showLeaseViewModal && selectedLease && (
        <LeaseViewModal
          lease={selectedLease}
          onClose={handleCloseLeaseViewModal}
          onEdit={handleEditLease}
          onPrint={handlePrintLease}
        />
      )}

      {showReviewForm && (
        <ReviewForm
          review={editingReview}
          onSave={handleSaveReview}
          onCancel={handleCloseReviewForm}
          isEdit={!!editingReview}
        />
      )}

      {showReviewViewModal && selectedReview && (
        <ReviewViewModal
          review={selectedReview}
          onClose={handleCloseReviewViewModal}
          onEdit={handleEditReview}
        />
      )}
    </div>
  );
};

export default TenantDetail;
