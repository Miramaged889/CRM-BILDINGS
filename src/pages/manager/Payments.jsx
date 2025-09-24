import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../stores/languageStore";
import {
  Plus,
  Search,
  Filter,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Download,
  Printer,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/ui/Icon";
import {
  PaymentForm,
  PaymentViewModal,
} from "../../components/forms/manger form";

const Payments = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentsData, setPaymentsData] = useState([
    {
      id: 1,
      tenant: "John Smith",
      unit: "A-101",
      amount: 1200,
      date: "2024-01-15",
      method: "Bank Transfer",
      status: "paid",
      dueDate: "2024-01-01",
    },
    {
      id: 2,
      tenant: "Sarah Johnson",
      unit: "B-205",
      amount: 1500,
      date: "2024-01-14",
      method: "Cash",
      status: "paid",
      dueDate: "2024-01-01",
    },
    {
      id: 3,
      tenant: "Mike Davis",
      unit: "C-301",
      amount: 1000,
      date: null,
      method: "Credit Card",
      status: "overdue",
      dueDate: "2024-01-01",
    },
    {
      id: 4,
      tenant: "Emily Brown",
      unit: "D-102",
      amount: 1300,
      date: null,
      method: "Bank Transfer",
      status: "pending",
      dueDate: "2024-02-01",
    },
    {
      id: 5,
      tenant: "Ahmed Ali",
      unit: "E-401",
      amount: 1100,
      date: "2024-01-20",
      method: "Online Payment",
      status: "paid",
      dueDate: "2024-01-01",
    },
    {
      id: 6,
      tenant: "Fatima Hassan",
      unit: "F-502",
      amount: 1400,
      date: null,
      method: "Check",
      status: "overdue",
      dueDate: "2024-01-01",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const filteredPayments = paymentsData.filter((payment) => {
    const matchesSearch =
      payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handler functions
  const handleAddNew = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const handleSavePayment = (paymentData) => {
    console.log("Saving payment:", paymentData);
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedPayment(null);
  };

  const handleMarkAsPaid = (payment) => {
    const updatedPayments = paymentsData.map((p) => {
      if (p.id === payment.id) {
        return {
          ...p,
          status: "paid",
          date: new Date().toISOString().split("T")[0],
        };
      }
      return p;
    });
    
    setPaymentsData(updatedPayments);
    
    // Show success notification
    const message = direction === "rtl" 
      ? "تم تأكيد الدفع بنجاح" 
      : "Payment confirmed successfully";
    
    // Create success notification
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 ${direction === "rtl" ? "right-auto left-4" : ""}`;
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        ${message}
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handlePrint = (payment) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt - ${payment.tenant}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @media print {
              body { 
                margin: 0; 
                padding: 10px; 
                font-size: 12px;
                line-height: 1.3;
              }
              .no-print { display: none !important; }
              .receipt-container { 
                box-shadow: none; 
                margin: 0; 
                max-height: 100vh;
                overflow: hidden;
              }
              .print-btn { display: none !important; }
              .header { padding: 20px 15px; }
              .content { padding: 15px; }
              .section { 
                margin: 10px 0; 
                padding: 12px; 
                page-break-inside: avoid;
              }
              .receipt-title { font-size: 24px; }
              .receipt-subtitle { font-size: 14px; }
              .section-title { font-size: 16px; margin-bottom: 10px; }
              .amount-value { font-size: 28px; }
              .amount-display { padding: 15px; margin: 10px 0; }
              .info-grid { gap: 8px; }
              .info-item { padding: 8px; }
              .footer { padding: 15px; margin-top: 15px; }
              .financial-section { padding: 15px; margin: 15px 0; }
            }
            
            @page {
              size: A4;
              margin: 15mm;
            }
            
            body { 
              font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              direction: ${direction}; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #1a202c;
              line-height: 1.4;
              min-height: 100vh;
            }
            
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
              overflow: hidden;
              position: relative;
              max-height: calc(100vh - 40px);
            }
            
            .receipt-container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
            }
            
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 25px 20px;
              position: relative;
              overflow: hidden;
            }
            
            .header::after {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              animation: shimmer 3s ease-in-out infinite;
            }
            
            @keyframes shimmer {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(180deg); }
            }
            
            .receipt-title {
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 8px 0;
              text-shadow: 0 4px 8px rgba(0,0,0,0.3);
              letter-spacing: -0.5px;
              position: relative;
              z-index: 1;
            }
            
            .receipt-subtitle {
              font-size: 16px;
              opacity: 0.95;
              margin: 0;
              font-weight: 400;
              position: relative;
              z-index: 1;
            }
            
            .content {
              padding: 20px;
              background: #fafbfc;
            }
            
            .section {
              margin: 15px 0;
              padding: 15px;
              border-radius: 12px;
              background: white;
              border: 1px solid #e2e8f0;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .section:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #2d3748;
              margin: 0 0 12px 0;
              display: flex;
              align-items: center;
              gap: 8px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e2e8f0;
            }
            
            .section-icon {
              width: 30px;
              height: 30px;
              background: linear-gradient(135deg, #667eea, #764ba2);
              border-radius: 8px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              font-weight: 600;
              box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 12px;
              margin-top: 12px;
            }
            
            .info-item {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              padding: 12px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
              transition: all 0.2s ease;
            }
            
            .info-item:hover {
              border-color: #667eea;
              transform: translateY(-1px);
              box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
            }
            
            .label {
              font-weight: 600;
              color: #4a5568;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
              display: flex;
              align-items: center;
              gap: 4px;
            }
            
            .label::before {
              content: '';
              width: 2px;
              height: 2px;
              background: #667eea;
              border-radius: 50%;
            }
            
            .value {
              color: #1a202c;
              font-size: 14px;
              font-weight: 500;
              line-height: 1.3;
            }
            
            .financial-section {
              background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 50%, #fefcbf 100%);
              border: 2px solid #38b2ac;
              border-radius: 16px;
              padding: 20px;
              margin: 20px 0;
              position: relative;
              overflow: hidden;
            }
            
            .financial-section::before {
              content: '💰';
              position: absolute;
              top: -15px;
              ${direction === "rtl" ? "right" : "left"}: 20px;
              background: linear-gradient(135deg, #38b2ac, #319795);
              color: white;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              box-shadow: 0 2px 8px rgba(56, 178, 172, 0.4);
            }
            
            .amount-display {
              text-align: center;
              margin: 15px 0;
              padding: 20px;
              background: white;
              border-radius: 12px;
              border: 2px dashed #38b2ac;
              position: relative;
              overflow: hidden;
            }
            
            .amount-display::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(56, 178, 172, 0.1), transparent);
              animation: shine 2s infinite;
            }
            
            @keyframes shine {
              0% { left: -100%; }
              100% { left: 100%; }
            }
            
            .amount-label {
              color: #4a5568;
              font-size: 12px;
              margin-bottom: 6px;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .amount-value {
              font-size: 32px;
              font-weight: 700;
              color: #38b2ac;
              margin: 0;
              text-shadow: 0 2px 4px rgba(56, 178, 172, 0.2);
              position: relative;
              z-index: 1;
            }
            
            .status-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
              transition: all 0.2s ease;
            }
            
            .status-badge:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            .status-paid {
              background: linear-gradient(135deg, #d1fae5, #a7f3d0);
              color: #064e3b;
              border: 2px solid #10b981;
            }
            
            .status-pending {
              background: linear-gradient(135deg, #fef3c7, #fde68a);
              color: #78350f;
              border: 2px solid #f59e0b;
            }
            
            .status-overdue {
              background: linear-gradient(135deg, #fee2e2, #fecaca);
              color: #7f1d1d;
              border: 2px solid #ef4444;
            }
            
            .footer {
              text-align: center;
              margin-top: 20px;
              padding: 20px;
              background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
              border-radius: 12px;
              border-top: 3px solid #e2e8f0;
              position: relative;
            }
            
            .footer::before {
              content: '';
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 40px;
              height: 3px;
              background: linear-gradient(90deg, #667eea, #764ba2);
              border-radius: 0 0 3px 3px;
            }
            
            .footer-text {
              color: #4a5568;
              font-size: 13px;
              margin: 0;
              line-height: 1.4;
            }
            
            .print-date {
              font-weight: 600;
              color: #2d3748;
              background: linear-gradient(135deg, #667eea, #764ba2);
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            
            .print-btn {
              position: fixed;
              top: 20px;
              ${direction === "rtl" ? "left" : "right"}: 20px;
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 20px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              transition: all 0.2s ease;
              z-index: 1000;
            }
            
            .print-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }
            
            @media (max-width: 768px) {
              body { padding: 10px; }
              .content { padding: 15px; }
              .info-grid { grid-template-columns: 1fr; gap: 10px; }
              .amount-value { font-size: 24px; }
              .receipt-title { font-size: 22px; }
              .section { padding: 12px; margin: 10px 0; }
              .print-btn { position: relative; top: auto; right: auto; left: auto; margin: 15px auto; display: block; }
            }
          </style>
        </head>
        <body>
          <button class="print-btn no-print" onclick="window.print()">
            🖨️ ${direction === "rtl" ? "طباعة الإيصال" : "Print Receipt"}
          </button>
          
          <div class="receipt-container">
            <div class="header">
              <h1 class="receipt-title">${
                direction === "rtl" ? "إيصال دفع الإيجار" : "Rent Payment Receipt"
              }</h1>
              <p class="receipt-subtitle">${
                direction === "rtl" ? "إيصال رسمي معتمد" : "Official Payment Receipt"
              }</p>
            </div>

            <div class="content">
              <div class="section">
                <h2 class="section-title">
                  <span class="section-icon">👤</span>
                  ${direction === "rtl" ? "معلومات المستأجر" : "Tenant Information"}
                </h2>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="label">${direction === "rtl" ? "اسم المستأجر" : "Tenant Name"}</div>
                    <div class="value">${payment.tenant}</div>
                  </div>
                  <div class="info-item">
                    <div class="label">${direction === "rtl" ? "رقم الوحدة" : "Unit Number"}</div>
                    <div class="value">${payment.unit}</div>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2 class="section-title">
                  <span class="section-icon">📄</span>
                  ${direction === "rtl" ? "تفاصيل الدفع" : "Payment Details"}
                </h2>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="label">${direction === "rtl" ? "رقم الإيصال" : "Receipt Number"}</div>
                    <div class="value">#${payment.id.toString().padStart(6, '0')}</div>
                  </div>
                  <div class="info-item">
                    <div class="label">${direction === "rtl" ? "طريقة الدفع" : "Payment Method"}</div>
                    <div class="value">${payment.method}</div>
                  </div>
                  <div class="info-item">
                    <div class="label">${direction === "rtl" ? "تاريخ الدفع" : "Payment Date"}</div>
                    <div class="value">${
                      payment.date
                        ? new Date(payment.date).toLocaleDateString(
                            direction === "rtl" ? "ar-EG" : "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              calendar: "gregory",
                            }
                          )
                        : direction === "rtl"
                        ? "غير مدفوع بعد"
                        : "Not paid yet"
                    }</div>
                  </div>
                  <div class="info-item">
                    <div class="label">${direction === "rtl" ? "تاريخ الاستحقاق" : "Due Date"}</div>
                    <div class="value">${new Date(payment.dueDate).toLocaleDateString(
                      direction === "rtl" ? "ar-EG" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        calendar: "gregory",
                      }
                    )}</div>
                  </div>
                </div>
              </div>

              <div class="financial-section">
                <h2 class="section-title">
                  <span class="section-icon">💰</span>
                  ${direction === "rtl" ? "المعلومات المالية" : "Financial Information"}
                </h2>
                
                <div class="amount-display">
                  <div class="amount-label">${direction === "rtl" ? "إجمالي المبلغ المدفوع" : "Total Amount Paid"}</div>
                  <div class="amount-value">$${payment.amount.toLocaleString()}</div>
                </div>
              </div>

              <div class="footer">
                <p class="footer-text">
                  ${direction === "rtl" ? "تم إنشاء هذا الإيصال في" : "Receipt generated on"} 
                  <span class="print-date">${new Date().toLocaleDateString(
                    direction === "rtl" ? "ar-EG" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      calendar: "gregory",
                    }
                  )}</span>
                </p>
                <p class="footer-text" style="margin-top: 8px; font-style: italic; opacity: 0.8;">
                  ${direction === "rtl" 
                    ? "هذا الإيصال صالح قانونياً ومعتمد من إدارة العقارات" 
                    : "This receipt is legally valid and certified by Property Management"
                  }
                </p>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              // Auto-focus for better printing experience
              document.body.focus();
            }
            
            // Enhanced print functionality
            function printReceipt() {
              window.print();
            }
            
            // Add keyboard shortcut for printing
            document.addEventListener('keydown', function(e) {
              if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                printReceipt();
              }
            });
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {t("payments.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg">
            {t("payments.managePayments")}
          </p>
        </div>

        <div className="mt-6 sm:mt-0 flex flex-row justify-end gap-3">
          <Button
            size="lg"
            className="shadow-sm hover:shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3"
            onClick={handleAddNew}
          >
            <Plus
              className={`h-5 w-5 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {t("payments.recordPayment")}
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("payments.totalCollected")}
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  $5,300
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("payments.pending")}
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  $1,300
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("payments.overdue")}
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  $2,400
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("payments.collectionRate")}
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  50%
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder={t("payments.searchPayments")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">{t("payments.allStatus")}</option>
            <option value="paid">{t("payments.paid")}</option>
            <option value="pending">{t("payments.pending")}</option>
            <option value="overdue">{t("payments.overdue")}</option>
          </select>
        </div>
      </motion.div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("payments.recentPayments")}
              </h3>
              <Button
                variant="outline"
                size="sm"
                className={`mt-4 sm:mt-0 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  direction === "rtl" ? "ml-2" : "mr-2"
                }`}
              >
                <Download
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("common.export")}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("payments.tenant")}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("payments.amount")}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("payments.method")}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("payments.date")}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("payments.status")}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {payment.tenant}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Unit {payment.unit}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {payment.amount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600 dark:text-gray-400">
                          {payment.method}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="text-gray-900 dark:text-white">
                            {payment.date
                              ? new Date(payment.date).toLocaleDateString(
                                  direction === "rtl" ? "ar-EG" : "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    calendar: "gregory",
                                  }
                                )
                              : direction === "rtl"
                              ? "غير مدفوع"
                              : "Not paid"}
                          </div>
                          {!payment.date && (
                            <div className="text-gray-500 dark:text-gray-400">
                              {direction === "rtl" ? "مستحق:" : "Due:"}{" "}
                              {new Date(payment.dueDate).toLocaleDateString(
                                direction === "rtl" ? "ar-EG" : "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  calendar: "gregory",
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {t(`payments.${payment.status}`)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            title={
                              direction === "rtl" ? "عرض الدفع" : "View Payment"
                            }
                            onClick={() => handleView(payment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            title={
                              direction === "rtl"
                                ? "تعديل الدفع"
                                : "Edit Payment"
                            }
                            onClick={() => handleEdit(payment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title={
                              direction === "rtl"
                                ? "طباعة الإيصال"
                                : "Print Receipt"
                            }
                            onClick={() => handlePrint(payment)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          {payment.status !== "paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                              title={
                                direction === "rtl"
                                  ? "تأكيد الدفع"
                                  : "Mark as Paid"
                              }
                              onClick={() => handleMarkAsPaid(payment)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  No payments found
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Modals */}
      {showForm && (
        <PaymentForm
          payment={editingPayment}
          onSave={handleSavePayment}
          onClose={handleCloseForm}
          isEdit={!!editingPayment}
        />
      )}

      {showViewModal && selectedPayment && (
        <PaymentViewModal
          payment={selectedPayment}
          onClose={handleCloseViewModal}
          onEdit={handleEdit}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
};

export default Payments;
