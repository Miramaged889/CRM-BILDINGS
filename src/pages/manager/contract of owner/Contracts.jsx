import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  FileText,
  User,
  Calendar,
  DollarSign,
  Edit,
  Eye,
  Printer,
  Building2,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import {
  ContractForm,
  ContractViewModal,
} from "../../../components/forms/manger form";

const Contracts = () => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContract, setSelectedContract] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);

  const contracts = [
    {
      id: 1,
      owner: "Ahmed Hassan",
      ownerId: 1,
      building: "Sunset Tower",
      buildingId: 1,
      start: "2024-01-01",
      end: "2024-12-31",
      monthlyFee: 500,
      status: "active",
      totalUnits: 25,
      occupiedUnits: 20,
      type: "management",
      notes: "Full building management contract",
    },
    {
      id: 2,
      owner: "Mona Ali",
      ownerId: 2,
      building: "Palm Residency",
      buildingId: 2,
      start: "2024-02-15",
      end: "2025-02-14",
      monthlyFee: 750,
      status: "active",
      totalUnits: 30,
      occupiedUnits: 28,
      type: "maintenance",
      notes: "Maintenance and upkeep contract",
    },
    {
      id: 3,
      owner: "Omar Khalil",
      ownerId: 3,
      building: "Nile Heights",
      buildingId: 3,
      start: "2023-06-01",
      end: "2024-05-31",
      monthlyFee: 600,
      status: "expired",
      totalUnits: 20,
      occupiedUnits: 18,
      type: "management",
      notes: "Expired management contract",
    },
  ];

  const translateStatus = (status) => {
    if (status === "active") return direction === "rtl" ? "نشط" : "Active";
    if (status === "expired") return direction === "rtl" ? "منتهي" : "Expired";
    if (status === "pending") return direction === "rtl" ? "معلق" : "Pending";
    return status;
  };

  const getStatusColor = (status) => {
    if (status === "active")
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
    if (status === "expired")
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300";
    if (status === "pending")
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
    return "bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300";
  };

  const handleView = (contract) => {
    setSelectedContract(contract);
    setShowViewModal(true);
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
    setShowForm(true);
  };

  const handlePrint = (contract) => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Get the contract data
    const contractData = contract;

    // Create print-friendly HTML content
    const printContent = createPrintContent(contractData);

    // Write content to the new window
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = function () {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  const handleAddNew = () => {
    setEditingContract(null);
    setShowForm(true);
  };

  const handleSaveContract = (contractData) => {
    console.log("Saving contract:", contractData);
    // Here you would typically save to your backend/database
    setShowForm(false);
    setEditingContract(null);
    // You might want to update the contracts list here
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContract(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedContract(null);
  };

  const handleEditFromView = () => {
    setShowViewModal(false);
    setEditingContract(selectedContract);
    setShowForm(true);
  };

  // Helper functions for formatting
  const translateType = (type) => {
    if (type === "management")
      return direction === "rtl" ? "إدارة" : "Management";
    if (type === "maintenance")
      return direction === "rtl" ? "صيانة" : "Maintenance";
    if (type === "cleaning") return direction === "rtl" ? "تنظيف" : "Cleaning";
    if (type === "security") return direction === "rtl" ? "أمن" : "Security";
    return type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      direction === "rtl" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        calendar: "gregory",
      }
    );
  };

  const createPrintContent = (contractData) => {
    return `
      <!DOCTYPE html>
      <html dir="${direction}" lang="${direction === "rtl" ? "ar" : "en"}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${
            direction === "rtl" ? "عقد إدارة" : "Management Contract"
          } - ${contractData.owner}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 20px;
            }
            
            .contract-header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .contract-title {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            
            .contract-subtitle {
              font-size: 16px;
              color: #666;
            }
            
            .contract-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding: 15px;
              background: #f8fafc;
              border-radius: 8px;
            }
            
            .info-section {
              flex: 1;
              margin: 0 10px;
            }
            
            .info-section h3 {
              color: #2563eb;
              margin-bottom: 10px;
              font-size: 16px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 5px;
            }
            
            .info-item {
              margin-bottom: 8px;
              display: flex;
              justify-content: space-between;
            }
            
            .info-label {
              font-weight: 600;
              color: #4a5568;
            }
            
            .info-value {
              color: #2d3748;
            }
            
            .financial-summary {
              background: #f0f9ff;
              border: 2px solid #0ea5e9;
              border-radius: 8px;
              padding: 20px;
              margin: 30px 0;
            }
            
            .financial-summary h3 {
              color: #0c4a6e;
              margin-bottom: 15px;
              text-align: center;
              font-size: 18px;
            }
            
            .financial-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
            }
            
            .financial-item {
              text-align: center;
              padding: 10px;
              background: white;
              border-radius: 6px;
              border: 1px solid #bae6fd;
            }
            
            .financial-label {
              font-size: 12px;
              color: #0369a1;
              margin-bottom: 5px;
            }
            
            .financial-value {
              font-size: 18px;
              font-weight: bold;
              color: #0c4a6e;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            
            .status-active {
              background: #dcfce7;
              color: #166534;
            }
            
            .status-expired {
              background: #fee2e2;
              color: #991b1b;
            }
            
            .status-pending {
              background: #fef3c7;
              color: #92400e;
            }
            
            .contract-footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            
            .signature-section {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
            }
            
            .signature-box {
              width: 200px;
              text-align: center;
            }
            
            .signature-line {
              border-bottom: 1px solid #333;
              height: 40px;
              margin-bottom: 10px;
            }
            
            @media print {
              body {
                padding: 0;
              }
              
              .contract-header {
                page-break-after: avoid;
              }
              
              .financial-summary {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="contract-header">
            <div class="contract-title">
              ${direction === "rtl" ? "عقد إدارة" : "MANAGEMENT CONTRACT"}
            </div>
            <div class="contract-subtitle">
              ${
                direction === "rtl"
                  ? "عقد إدارة عقارية"
                  : "Property Management Agreement"
              }
            </div>
          </div>
          
          <div class="contract-info">
            <div class="info-section">
              <h3>${
                direction === "rtl" ? "معلومات المالك" : "OWNER INFORMATION"
              }</h3>
              <div class="info-item">
                <span class="info-label">${
                  direction === "rtl" ? "الاسم:" : "Name:"
                }</span>
                <span class="info-value">${contractData.owner}</span>
              </div>
            </div>
            
            <div class="info-section">
              <h3>${
                direction === "rtl" ? "معلومات المبنى" : "BUILDING INFORMATION"
              }</h3>
              <div class="info-item">
                <span class="info-label">${
                  direction === "rtl" ? "المبنى:" : "Building:"
                }</span>
                <span class="info-value">${contractData.building}</span>
              </div>
              <div class="info-item">
                <span class="info-label">${
                  direction === "rtl" ? "الوحدات:" : "Units:"
                }</span>
                <span class="info-value">${contractData.occupiedUnits}/${
      contractData.totalUnits
    } ${direction === "rtl" ? "وحدة" : "units"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">${
                  direction === "rtl" ? "النوع:" : "Type:"
                }</span>
                <span class="info-value">${translateType(
                  contractData.type
                )}</span>
              </div>
            </div>
            
            <div class="info-section">
              <h3>${
                direction === "rtl" ? "تفاصيل العقد" : "CONTRACT DETAILS"
              }</h3>
              <div class="info-item">
                <span class="info-label">${
                  direction === "rtl" ? "رقم العقد:" : "Contract #:"
                }</span>
                <span class="info-value">${contractData.id}</span>
              </div>
              <div class="info-item">
                <span class="info-label">${
                  direction === "rtl" ? "الحالة:" : "Status:"
                }</span>
                <span class="info-value">
                  <span class="status-badge status-${contractData.status}">
                    ${translateStatus(contractData.status)}
                  </span>
                </span>
              </div>
            </div>
          </div>
          
          <div class="financial-summary">
            <h3>${
              direction === "rtl"
                ? "المعلومات المالية"
                : "FINANCIAL INFORMATION"
            }</h3>
            <div class="financial-grid">
              <div class="financial-item">
                <div class="financial-label">${
                  direction === "rtl" ? "الرسوم الشهرية" : "Monthly Fee"
                }</div>
                <div class="financial-value">$${contractData.monthlyFee.toLocaleString()}</div>
              </div>
              <div class="financial-item">
                <div class="financial-label">${
                  direction === "rtl" ? "الوحدات المشغولة" : "Occupied Units"
                }</div>
                <div class="financial-value">${contractData.occupiedUnits}/${
      contractData.totalUnits
    }</div>
              </div>
              <div class="financial-item">
                <div class="financial-label">${
                  direction === "rtl" ? "تاريخ البداية" : "Start Date"
                }</div>
                <div class="financial-value">${formatDate(
                  contractData.start
                )}</div>
              </div>
              <div class="financial-item">
                <div class="financial-label">${
                  direction === "rtl" ? "تاريخ النهاية" : "End Date"
                }</div>
                <div class="financial-value">${formatDate(
                  contractData.end
                )}</div>
              </div>
              <div class="financial-item">
                <div class="financial-label">${
                  direction === "rtl" ? "المدة" : "Duration"
                }</div>
                <div class="financial-value">${Math.ceil(
                  (new Date(contractData.end) - new Date(contractData.start)) /
                    (1000 * 60 * 60 * 24 * 30)
                )} ${direction === "rtl" ? "شهر" : "months"}</div>
              </div>
              <div class="financial-item">
                <div class="financial-label">${
                  direction === "rtl"
                    ? "إجمالي قيمة العقد"
                    : "Total Contract Value"
                }</div>
                <div class="financial-value">$${(
                  contractData.monthlyFee *
                  Math.ceil(
                    (new Date(contractData.end) -
                      new Date(contractData.start)) /
                      (1000 * 60 * 60 * 24 * 30)
                  )
                ).toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          ${
            contractData.notes
              ? `
          <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
            <h3 style="color: #2563eb; margin-bottom: 10px;">${
              direction === "rtl" ? "ملاحظات إضافية" : "Additional Notes"
            }</h3>
            <p style="color: #4a5568;">${contractData.notes}</p>
          </div>
          `
              : ""
          }
          
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>${
                direction === "rtl" ? "توقيع المالك" : "Owner Signature"
              }</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>${
                direction === "rtl"
                  ? "توقيع مدير العقار"
                  : "Property Manager Signature"
              }</div>
            </div>
          </div>
          
          <div class="contract-footer">
            <p>${
              direction === "rtl"
                ? "تم إنشاء هذا العقد في"
                : "Contract generated on"
            } ${new Date().toLocaleDateString(
      direction === "rtl" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        calendar: "gregory",
      }
    )}</p>
            <p>${
              direction === "rtl"
                ? "نظام إدارة العقارات"
                : "Property Management System"
            }</p>
          </div>
        </body>
      </html>
    `;
  };

  const filtered = contracts.filter((c) =>
    [c.owner, c.building].some((v) =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6 lg:p-8 space-y-8" dir={direction}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {t("nav.contracts") ||
              (direction === "rtl" ? "عقود الإيجار" : "Rent Contracts")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
            {direction === "rtl"
              ? "إدارة العقود والمدفوعات"
              : "Manage contracts and payments"}
          </p>
        </div>
        <Button
          className="mt-6 sm:mt-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
          onClick={handleAddNew}
        >
          <Plus
            className={`h-5 w-5 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
          />
          {direction === "rtl" ? "إضافة عقد" : "Add Contract"}
        </Button>
      </motion.div>

      {/* Search and Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className={`absolute ${
                    direction === "rtl" ? "right-3" : "left-3"
                  } top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5`}
                />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    direction === "rtl"
                      ? "بحث في العقود..."
                      : "Search contracts..."
                  }
                  className={`${
                    direction === "rtl" ? "pr-12 pl-4" : "pl-12 pr-4"
                  } bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 py-3 text-lg`}
                />
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {direction === "rtl" ? "إجمالي العقود:" : "Total Contracts:"}{" "}
              {filtered.length}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Contracts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-0 overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
                  <th className="py-6 px-6 font-bold text-gray-900 dark:text-white">
                    {direction === "rtl" ? "المالك" : "Owner"}
                  </th>
                  <th className="py-6 px-6 font-bold text-gray-900 dark:text-white">
                    {direction === "rtl" ? "المبنى" : "Building"}
                  </th>
                  <th className="py-6 px-6 font-bold text-gray-900 dark:text-white">
                    {direction === "rtl" ? "الوحدات" : "Units"}
                  </th>
                  <th className="py-6 px-6 font-bold text-gray-900 dark:text-white">
                    {direction === "rtl" ? "بداية العقد" : "Start Date"}
                  </th>
                  <th className="py-6 px-6 font-bold text-gray-900 dark:text-white">
                    {direction === "rtl" ? "نهاية العقد" : "End Date"}
                  </th>
                  <th className="py-6 px-6 font-bold text-gray-900 dark:text-white">
                    {direction === "rtl" ? "الرسوم الشهرية" : "Monthly Fee"}
                  </th>
                  <th className="py-6 px-6 font-bold text-gray-900 dark:text-white">
                    {direction === "rtl" ? "الحالة" : "Status"}
                  </th>
                  <th className="py-6 px-6 font-bold text-gray-900 dark:text-white">
                    {direction === "rtl" ? "الإجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map((c, index) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                  >
                    <td className="py-6 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                          {c.owner}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 mr-3 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-100 font-medium text-lg">
                          {c.building}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {c.occupiedUnits}/{c.totalUnits}{" "}
                          {direction === "rtl" ? "وحدة" : "units"}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {new Date(c.start).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-red-500" />
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {new Date(c.end).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                        <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                          ${c.monthlyFee.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span
                        className={`px-4 py-2 text-sm rounded-full font-bold ${getStatusColor(
                          c.status
                        )}`}
                      >
                        {translateStatus(c.status)}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <div
                        className={`flex items-center space-x-2 ${
                          direction === "rtl" ? "space-x-reverse" : ""
                        }`}
                      >
                        <button
                          onClick={() => handleView(c)}
                          className="p-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-105"
                          title={direction === "rtl" ? "عرض" : "View"}
                        >
                          <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-3 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200 hover:scale-105"
                          title={direction === "rtl" ? "تعديل" : "Edit"}
                        >
                          <Edit className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </button>
                        <button
                          onClick={() => handlePrint(c)}
                          className="p-3 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 hover:scale-105"
                          title={direction === "rtl" ? "طباعة" : "Print"}
                        >
                          <Printer className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {direction === "rtl"
                  ? "لا توجد عقود مطابقة للبحث"
                  : "No contracts found matching your search"}
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Contract Form Modal */}
      {showForm && (
        <ContractForm
          contract={editingContract}
          onSave={handleSaveContract}
          onCancel={handleCloseForm}
          isEdit={!!editingContract}
        />
      )}

      {/* Contract View Modal */}
      {showViewModal && (
        <ContractViewModal
          contract={selectedContract}
          onClose={handleCloseViewModal}
          onEdit={handleEditFromView}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
};

export default Contracts;
