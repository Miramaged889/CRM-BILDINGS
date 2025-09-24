import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../stores/languageStore";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  DollarSign,
  User,
  Eye,
  Edit,
  Trash2,
  Printer,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Building,
  Home,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/ui/Icon";
import { LeaseForm, LeaseViewModal } from "../../components/forms/manger form";

const Leases = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const [editingLease, setEditingLease] = useState(null);

  // Mock data
  const leases = [
    {
      id: 1,
      tenant: "John Smith",
      unit: "A-101",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      rent: 1200,
      deposit: 2400,
      status: "active",
      type: "apartment",
      tenantEmail: "john.smith@email.com",
      tenantPhone: "+1 234 567 8900",
      utilities: "Water, Electricity",
      petPolicy: "No pets allowed",
      parking: "1 space included",
    },
    {
      id: 2,
      tenant: "Sarah Johnson",
      unit: "B-205",
      startDate: "2024-02-15",
      endDate: "2025-02-14",
      rent: 1500,
      deposit: 3000,
      status: "active",
      type: "villa",
      tenantEmail: "sarah.johnson@email.com",
      tenantPhone: "+1 234 567 8901",
      utilities: "All utilities included",
      petPolicy: "Small pets allowed",
      parking: "2 spaces included",
    },
    {
      id: 3,
      tenant: "Mike Davis",
      unit: "C-301",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      rent: 1000,
      deposit: 2000,
      status: "expired",
      type: "apartment",
      tenantEmail: "mike.davis@email.com",
      tenantPhone: "+1 234 567 8902",
      utilities: "Water, Electricity",
      petPolicy: "No pets allowed",
      parking: "1 space included",
    },
    {
      id: 4,
      tenant: "Emily Brown",
      unit: "D-102",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      rent: 1800,
      deposit: 3600,
      status: "pending",
      type: "villa",
      tenantEmail: "emily.brown@email.com",
      tenantPhone: "+1 234 567 8903",
      utilities: "All utilities included",
      petPolicy: "Pets allowed with deposit",
      parking: "2 spaces included",
    },
    {
      id: 5,
      tenant: "David Wilson",
      unit: "A-203",
      startDate: "2024-04-15",
      endDate: "2025-04-14",
      rent: 1350,
      deposit: 2700,
      status: "active",
      type: "apartment",
      tenantEmail: "david.wilson@email.com",
      tenantPhone: "+1 234 567 8904",
      utilities: "Water, Electricity, Internet",
      petPolicy: "No pets allowed",
      parking: "1 space included",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
      case "expired":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const filteredLeases = leases.filter((lease) => {
    const matchesSearch =
      lease.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lease.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeLeases = leases.filter(
    (lease) => lease.status === "active"
  ).length;
  const pendingLeases = leases.filter(
    (lease) => lease.status === "pending"
  ).length;
  const expiredLeases = leases.filter(
    (lease) => lease.status === "expired"
  ).length;

  // Handler functions
  const handleAddNew = () => {
    setEditingLease(null);
    setShowForm(true);
  };

  const handleEdit = (lease) => {
    setEditingLease(lease);
    setShowForm(true);
  };

  const handleView = (lease) => {
    setSelectedLease(lease);
    setShowViewModal(true);
  };

  const handleSaveLease = (leaseData) => {
    console.log("Saving lease:", leaseData);
    setShowForm(false);
    setEditingLease(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLease(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedLease(null);
  };

  const handlePrint = (lease) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lease Contract - ${lease.tenant}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 15mm;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.4;
              color: #2d3748;
              direction: ${direction};
              font-size: 11px;
            }
            .container {
              max-width: 100%;
              margin: 0 auto;
              padding: 10px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 15px; 
              border-bottom: 3px solid #4299e1;
              padding-bottom: 10px;
            }
            .contract-title { 
              font-size: 20px; 
              font-weight: bold; 
              color: #2b6cb0;
              margin-bottom: 3px;
            }
            .contract-subtitle {
              font-size: 12px;
              color: #718096;
            }
            .content-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 15px;
            }
            .section { 
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 10px;
            }
            .section-title { 
              font-size: 13px; 
              font-weight: bold; 
              color: #2d3748; 
              margin-bottom: 6px;
              border-bottom: 1px solid #cbd5e0;
              padding-bottom: 3px;
            }
            .info-row { 
              margin: 4px 0;
              display: flex;
              justify-content: space-between;
            }
            .label { 
              font-weight: 600; 
              color: #4a5568;
              font-size: 10px;
            }
            .value { 
              color: #2d3748;
              font-size: 10px;
              font-weight: 500;
            }
            .financial { 
              background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
              border: 2px solid #4299e1;
              border-radius: 8px;
              padding: 12px;
              margin: 15px 0;
              text-align: center;
            }
            .financial .section-title {
              border: none;
              margin-bottom: 8px;
              color: #2b6cb0;
            }
            .financial-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .financial-item {
              background: white;
              padding: 8px;
              border-radius: 4px;
              border: 1px solid #bee3f8;
            }
            .amount {
              font-size: 14px;
              font-weight: bold;
              color: #2b6cb0;
            }
            .signature-section { 
              margin-top: 20px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .signature-box { 
              text-align: center;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 8px;
              background: #f8fafc;
            }
            .signature-line { 
              border-bottom: 2px solid #4a5568;
              margin: 15px 0 8px 0;
              height: 20px;
            }
            .signature-label {
              font-size: 10px;
              font-weight: 600;
              color: #4a5568;
            }
            .terms-section {
              grid-column: 1 / -1;
              background: #fff8f0;
              border: 1px solid #f6ad55;
              border-radius: 6px;
              padding: 10px;
            }
            .footer {
              margin-top: 15px;
              text-align: center;
              font-size: 9px;
              color: #718096;
              border-top: 1px solid #e2e8f0;
              padding-top: 8px;
            }
            .status-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 9px;
              font-weight: bold;
              background: #48bb78;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="contract-title">
                ${direction === "rtl" ? "عقد إيجار عقاري" : "PROPERTY LEASE AGREEMENT"}
              </h1>
              <p class="contract-subtitle">
                ${direction === "rtl" ? "عقد إيجار رسمي" : "Official Rental Contract"} • 
                <span class="status-badge">${lease.status.toUpperCase()}</span>
              </p>
            </div>

            <div class="content-grid">
              <div class="section">
                <h2 class="section-title">
                  ${direction === "rtl" ? "👤 معلومات المستأجر" : "👤 TENANT INFORMATION"}
                </h2>
                <div class="info-row">
                  <span class="label">${direction === "rtl" ? "الاسم" : "Name"}:</span>
                  <span class="value">${lease.tenant}</span>
                </div>
                <div class="info-row">
                  <span class="label">${direction === "rtl" ? "البريد الإلكتروني" : "Email"}:</span>
                  <span class="value">${lease.tenantEmail}</span>
                </div>
                <div class="info-row">
                  <span class="label">${direction === "rtl" ? "الهاتف" : "Phone"}:</span>
                  <span class="value">${lease.tenantPhone}</span>
                </div>
              </div>

              <div class="section">
                <h2 class="section-title">
                  ${direction === "rtl" ? "🏢 معلومات العقار" : "🏢 PROPERTY DETAILS"}
                </h2>
                <div class="info-row">
                  <span class="label">${direction === "rtl" ? "رقم الوحدة" : "Unit"}:</span>
                  <span class="value">${lease.unit}</span>
                </div>
                <div class="info-row">
                  <span class="label">${direction === "rtl" ? "النوع" : "Type"}:</span>
                  <span class="value">${lease.type}</span>
                </div>
                <div class="info-row">
                  <span class="label">${direction === "rtl" ? "المرافق" : "Utilities"}:</span>
                  <span class="value">${lease.utilities || "Not specified"}</span>
                </div>
                <div class="info-row">
                  <span class="label">${direction === "rtl" ? "الموقف" : "Parking"}:</span>
                  <span class="value">${lease.parking || "Not included"}</span>
                </div>
              </div>

              <div class="section">
                <h2 class="section-title">
                  ${direction === "rtl" ? "📅 فترة الإيجار" : "📅 LEASE PERIOD"}
                </h2>
                <div class="info-row">
                  <span class="label">${direction === "rtl" ? "تاريخ البداية" : "Start Date"}:</span>
                  <span class="value">${new Date(lease.startDate).toLocaleDateString(
                    direction === "rtl" ? "ar-EG" : "en-US",
                    { year: "numeric", month: "short", day: "numeric" }
                  )}</span>
                </div>
                <div class="info-row">
                  <span class="label">${direction === "rtl" ? "تاريخ النهاية" : "End Date"}:</span>
                  <span class="value">${new Date(lease.endDate).toLocaleDateString(
                    direction === "rtl" ? "ar-EG" : "en-US",
                    { year: "numeric", month: "short", day: "numeric" }
                  )}</span>
                </div>
                <div class="info-row">
                  <span class="label">${direction === "rtl" ? "المدة" : "Duration"}:</span>
                  <span class="value">${Math.ceil(
                    (new Date(lease.endDate) - new Date(lease.startDate)) / (1000 * 60 * 60 * 24 * 30)
                  )} ${direction === "rtl" ? "شهر" : "months"}</span>
                </div>
              </div>

              <div class="terms-section">
                <h2 class="section-title">
                  ${direction === "rtl" ? "📋 الشروط والأحكام" : "📋 TERMS & CONDITIONS"}
                </h2>
                <div class="info-row">
                  <span class="label">${direction === "rtl" ? "سياسة الحيوانات" : "Pet Policy"}:</span>
                  <span class="value">${lease.petPolicy || "No pets allowed"}</span>
                </div>
                ${lease.notes ? `
                  <div class="info-row">
                    <span class="label">${direction === "rtl" ? "ملاحظات" : "Notes"}:</span>
                    <span class="value">${lease.notes}</span>
                  </div>
                ` : ""}
              </div>
            </div>

            <div class="financial">
              <h2 class="section-title">
                ${direction === "rtl" ? "💰 المعلومات المالية" : "💰 FINANCIAL DETAILS"}
              </h2>
              <div class="financial-grid">
                <div class="financial-item">
                  <div class="label">${direction === "rtl" ? "الإيجار الشهري" : "Monthly Rent"}</div>
                  <div class="amount">$${lease.rent?.toLocaleString()}</div>
                </div>
                <div class="financial-item">
                  <div class="label">${direction === "rtl" ? "مبلغ الضمان" : "Security Deposit"}</div>
                  <div class="amount">$${lease.deposit?.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <p class="signature-label">${direction === "rtl" ? "توقيع المستأجر" : "TENANT SIGNATURE"}</p>
                <p style="font-size: 9px; color: #718096; margin-top: 3px;">
                  ${direction === "rtl" ? "التاريخ: ___________" : "Date: ___________"}
                </p>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <p class="signature-label">${direction === "rtl" ? "توقيع المالك/الوكيل" : "LANDLORD/AGENT SIGNATURE"}</p>
                <p style="font-size: 9px; color: #718096; margin-top: 3px;">
                  ${direction === "rtl" ? "التاريخ: ___________" : "Date: ___________"}
                </p>
              </div>
            </div>

            <div class="footer">
              <p>
                ${direction === "rtl" ? "تم إنشاء هذا العقد في" : "Contract generated on"} 
                ${new Date().toLocaleDateString(direction === "rtl" ? "ar-EG" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })} | 
                ${direction === "rtl" ? "عقد رقم" : "Contract ID"}: ${lease.id || Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {t("nav.leases")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("leases.manageLeases")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="sm"
                className="shadow-sm hover:shadow-md transition-shadow"
                onClick={handleAddNew}
              >
                <Plus
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("leases.addLease")}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("leases.active")}
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {activeLeases}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("leases.pending")}
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {pendingLeases}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("leases.expired")}
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {expiredLeases}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("leases.totalLeases")}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {leases.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className={`absolute ${
                    direction === "rtl" ? "right-3" : "left-3"
                  } top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`}
                />
                <input
                  type="text"
                  placeholder={t("leases.searchLeases")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full ${
                    direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                  } py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200`}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
              >
                <option value="all">{t("leases.allStatus")}</option>
                <option value="active">{t("leases.active")}</option>
                <option value="pending">{t("leases.pending")}</option>
                <option value="expired">{t("leases.expired")}</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Leases Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="overflow-hidden shadow-lg border-0 bg-white dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.tenant")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.unit")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.leaseType")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.startDate")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.endDate")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.rent")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.status")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLeases.map((lease, index) => (
                    <motion.tr
                      key={lease.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div
                            className={`${
                              direction === "rtl" ? "mr-4" : "ml-4"
                            }`}
                          >
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {lease.tenant}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {lease.tenantEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {lease.unit}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white capitalize">
                          {lease.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(lease.startDate).toLocaleDateString(
                          direction === "rtl" ? "ar-EG" : "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            calendar: "gregory",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(lease.endDate).toLocaleDateString(
                          direction === "rtl" ? "ar-EG" : "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            calendar: "gregory",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {lease.rent}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            /month
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            lease.status
                          )}`}
                        >
                          {t(`leases.${lease.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <Button
                            size="sm"
                            variant="outline"
                            title={t("leases.viewLease")}
                            onClick={() => handleView(lease)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            title={t("leases.editLease")}
                            onClick={() => handleEdit(lease)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            title={
                              direction === "rtl"
                                ? "طباعة العقد"
                                : "Print Contract"
                            }
                            onClick={() => handlePrint(lease)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {filteredLeases.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mb-4">
              <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              {t("leases.noLeasesFound")}
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              {t("leases.tryDifferentSearch")}
            </p>
          </motion.div>
        )}

        {/* Modals */}
        {showForm && (
          <LeaseForm
            lease={editingLease}
            onSave={handleSaveLease}
            onClose={handleCloseForm}
            isEdit={!!editingLease}
          />
        )}

        {showViewModal && selectedLease && (
          <LeaseViewModal
            lease={selectedLease}
            onClose={handleCloseViewModal}
            onEdit={handleEdit}
            onPrint={handlePrint}
          />
        )}
      </div>
    </div>
  );
};

export default Leases;
