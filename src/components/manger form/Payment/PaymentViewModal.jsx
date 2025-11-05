import React from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  User,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  X,
  Edit,
  Printer,
  Building,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";

const PaymentViewModal = ({ payment, onClose, onEdit, onPrint }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const translateStatus = (status) => {
    if (status === "paid") return direction === "rtl" ? "مدفوع" : "Paid";
    if (status === "pending") return direction === "rtl" ? "معلق" : "Pending";
    if (status === "overdue") return direction === "rtl" ? "متأخر" : "Overdue";
    return status;
  };

  const translateMethod = (method) => {
    // Handle both old and new API formats
    const methodMap = {
      "bank_transfer": direction === "rtl" ? "تحويل بنكي" : "Bank Transfer",
      "Bank Transfer": direction === "rtl" ? "تحويل بنكي" : "Bank Transfer",
      "cash": direction === "rtl" ? "نقداً" : "Cash",
      "Cash": direction === "rtl" ? "نقداً" : "Cash",
      "credit_card": direction === "rtl" ? "بطاقة ائتمان" : "Credit Card",
      "Credit Card": direction === "rtl" ? "بطاقة ائتمان" : "Credit Card",
      "online_payment": direction === "rtl" ? "دفع إلكتروني" : "Online Payment",
      "Online Payment": direction === "rtl" ? "دفع إلكتروني" : "Online Payment",
      "Check": direction === "rtl" ? "شيك" : "Check",
    };
    return methodMap[method] || method;
  };

  const translateCategory = (category) => {
    const categoryMap = {
      "wifi": direction === "rtl" ? "واي فاي" : "WiFi",
      "electricity": direction === "rtl" ? "كهرباء" : "Electricity",
      "water": direction === "rtl" ? "مياه" : "Water",
      "cleaning": direction === "rtl" ? "تنظيف" : "Cleaning",
      "maintenance": direction === "rtl" ? "صيانة" : "Maintenance",
      "repair": direction === "rtl" ? "إصلاح" : "Repair",
      "other": direction === "rtl" ? "أخرى" : "Other",
    };
    return categoryMap[category] || category;
  };

  const getStatusColor = (status) => {
    if (status === "paid")
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300";
    if (status === "pending")
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300";
    if (status === "overdue")
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300";
    return "bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300";
  };

  const getStatusIcon = (status) => {
    if (status === "paid")
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === "pending")
      return <Clock className="h-4 w-4 text-yellow-600" />;
    if (status === "overdue")
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-gray-600" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return direction === "rtl" ? "غير متاح" : "Not available";
    try {
      return new Date(dateString).toLocaleDateString(
        direction === "rtl" ? "ar-EG" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          calendar: "gregory",
        }
      );
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const isOverdue = () => {
    if (payment.status === "paid") return false;
    if (!payment.dueDate) return false;
    const dueDate = new Date(payment.dueDate);
    const today = new Date();
    return dueDate < today;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {direction === "rtl" ? "تفاصيل الدفع" : "Payment Details"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "عرض تفاصيل الدفع"
                    : "View payment details"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Payment Header */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                {direction === "rtl" ? "إيصال دفع" : "Payment Receipt"}
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                {direction === "rtl"
                  ? "إيصال دفع الإيجار"
                  : "Rent Payment Receipt"}
              </p>
              <div className="mt-4 flex items-center justify-center gap-4">
                <span
                  className={`px-4 py-2 text-sm rounded-full font-medium flex items-center gap-2 ${getStatusColor(
                    payment.status
                  )}`}
                >
                  {getStatusIcon(payment.status)}
                  {translateStatus(payment.status)}
                </span>
                {isOverdue() && (
                  <span className="px-4 py-2 text-sm rounded-full font-medium bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                    {direction === "rtl" ? "متأخر" : "Overdue"}
                  </span>
                )}
              </div>
            </div>

            {/* Payment Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Unit and Category Information */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Building
                    className={`h-5 w-5 text-blue-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl"
                    ? "معلومات الوحدة والفئة"
                    : "Unit and Category Information"}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "الوحدة:" : "Unit:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {payment.unit || payment.unit_id || "-"}
                    </p>
                  </div>
                  {payment.category && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {direction === "rtl" ? "الفئة:" : "Category:"}
                      </span>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {translateCategory(payment.category)}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Payment Details */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText
                    className={`h-5 w-5 text-purple-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "تفاصيل الدفع" : "Payment Details"}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "رقم الدفع:" : "Payment #:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      #{payment.id}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "طريقة الدفع:" : "Payment Method:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {translateMethod(payment.payment_method || payment.method)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Financial Information */}
            <Card className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <DollarSign
                  className={`h-5 w-5 text-green-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "المعلومات المالية"
                  : "Financial Information"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {direction === "rtl" ? "المبلغ:" : "Amount:"}
                    </span>
                    <span className="text-green-900 dark:text-green-100 font-bold text-xl">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {direction === "rtl" ? "تاريخ الدفع:" : "Payment Date:"}
                    </span>
                    <span className="text-blue-900 dark:text-blue-100 font-medium">
                      {formatDate(payment.payment_date || payment.date)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Dates Information */}
            <Card className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar
                  className={`h-5 w-5 text-orange-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "تواريخ مهمة" : "Important Dates"}
              </h4>
              <div className="space-y-4">
                {(payment.payment_date || payment.date) && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {direction === "rtl" ? "تاريخ الدفع:" : "Payment Date:"}
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDate(payment.payment_date || payment.date)}
                    </span>
                  </div>
                )}
                {payment.created_at && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {direction === "rtl" ? "تاريخ الإنشاء:" : "Created At:"}
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDate(payment.created_at)}
                    </span>
                  </div>
                )}
                {payment.updated_at && payment.updated_at !== payment.created_at && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {direction === "rtl" ? "آخر تحديث:" : "Last Updated:"}
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDate(payment.updated_at)}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Additional Information */}
            {payment.notes && (
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {direction === "rtl"
                    ? "معلومات إضافية"
                    : "Additional Information"}
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "ملاحظات:" : "Notes:"}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mt-1">
                      {payment.notes}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div
              className={`flex items-center gap-4 ${
                direction === "rtl" ? "justify-start" : "justify-end"
              }`}
            >
              <Button variant="outline" onClick={onClose} className="px-6 py-2">
                <X
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "إغلاق" : "Close"}
              </Button>
              <Button
                variant="outline"
                onClick={() => onPrint(payment)}
                className="px-6 py-2"
              >
                <Printer
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "طباعة" : "Print"}
              </Button>
              <Button onClick={() => onEdit(payment)} className="px-6 py-2">
                <Edit
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "تعديل" : "Edit"}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PaymentViewModal;
