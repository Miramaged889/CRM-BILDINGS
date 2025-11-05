import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  User,
  Building,
  Calendar,
  DollarSign,
  FileText,
  X,
  Edit,
  Clock,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import api from "../../../services/api";
import API_ENDPOINTS from "../../../services/apiEndpoints";

const LeaseViewModal = ({ lease, onClose, onEdit, onPrint }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  // State for unit and tenant names
  const [unitName, setUnitName] = useState("");
  const [tenantName, setTenantName] = useState("");

  // Fetch unit and tenant names
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const unitId =
          typeof lease?.unit === "object" ? lease.unit.id : lease?.unit;
        const tenantId =
          typeof lease?.tenant === "object" ? lease.tenant.id : lease?.tenant;

        if (unitId) {
          try {
            const unitData = await api.get(API_ENDPOINTS.UNITS.DETAIL(unitId));
            const unitLabelParts = [
              unitData.name || `#${unitData.id}`,
              (unitData.city_name || unitData.city) &&
              (unitData.district_name || unitData.district)
                ? `${unitData.city_name || unitData.city} - ${
                    unitData.district_name || unitData.district
                  }`
                : unitData.city_name ||
                  unitData.city ||
                  unitData.district_name ||
                  unitData.district,
            ].filter(Boolean);
            setUnitName(unitLabelParts.join(" - "));
          } catch (e) {
            setUnitName(unitId.toString());
          }
        }

        if (tenantId) {
          try {
            const tenantData = await api.get(
              API_ENDPOINTS.TENANTS.DETAIL(tenantId)
            );
            setTenantName(
              tenantData.full_name ||
                tenantData.name ||
                tenantData.phone ||
                `#${tenantId}`
            );
          } catch (e) {
            setTenantName(tenantId.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };

    if (lease) {
      fetchNames();
    }
  }, [lease]);

  const translatePaymentStatus = (status) => {
    if (status === "paid") return direction === "rtl" ? "مدفوع" : "Paid";
    if (status === "pending")
      return direction === "rtl" ? "قيد الانتظار" : "Pending";
    if (status === "overdue") return direction === "rtl" ? "متأخر" : "Overdue";
    return status;
  };

  const translatePaymentMethod = (method) => {
    const methods = {
      cash: direction === "rtl" ? "نقدًا" : "Cash",
      bank_transfer: direction === "rtl" ? "تحويل بنكي" : "Bank Transfer",
      credit_card: direction === "rtl" ? "بطاقة ائتمان" : "Credit Card",
      online_payment: direction === "rtl" ? "دفع إلكتروني" : "Online Payment",
    };
    return methods[method] || method;
  };

  const getPaymentStatusColor = (status) => {
    if (status === "paid")
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
    if (status === "pending")
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
    if (status === "overdue")
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300";
    return "bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
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
    if (!amount) return "$0.00";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount || 0);
  };

  const calculateDuration = () => {
    if (!lease?.rent_start || !lease?.rent_end) return { days: 0 };
    try {
      const start = new Date(lease.rent_start);
      const end = new Date(lease.rent_end);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const diffTime = end - start;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return { days: diffDays };
    } catch (e) {
      return { days: 0 };
    }
  };

  const isExpiringSoon = () => {
    if (!lease?.rent_end) return false;
    try {
      const endDate = new Date(lease.rent_end);
      const today = new Date();
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    } catch (e) {
      return false;
    }
  };

  if (!lease) return null;

  const duration = calculateDuration();

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
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
      >
        <Card className="p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {direction === "rtl" ? "تفاصيل الإيجار" : "Rent Details"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "عرض تفاصيل الإيجار"
                    : "View rent details"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors self-start sm:self-auto"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Rent Header */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                {direction === "rtl" ? "إيجار" : "Rent"}
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                {direction === "rtl"
                  ? "تفاصيل عقد الإيجار"
                  : "Rental Agreement Details"}
              </p>
              <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
                <span
                  className={`px-4 py-2 text-sm rounded-full font-medium ${getPaymentStatusColor(
                    lease.payment_status || "pending"
                  )}`}
                >
                  {translatePaymentStatus(lease.payment_status || "pending")}
                </span>
                {isExpiringSoon() && (
                  <span className="px-4 py-2 text-sm rounded-full font-medium bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
                    {direction === "rtl" ? "ينتهي قريباً" : "Expiring Soon"}
                  </span>
                )}
              </div>
            </div>

            {/* Rent Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Unit Information */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Building
                    className={`h-5 w-5 text-green-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "الوحدة" : "Unit"}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "اسم الوحدة:" : "Unit Name:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {unitName || lease.unit_name || lease.unit || "-"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Tenant Information */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <User
                    className={`h-5 w-5 text-blue-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl"
                    ? "معلومات المستأجر"
                    : "Tenant Information"}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "الاسم:" : "Name:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {tenantName || lease.tenant_name || "-"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Rent Details */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText
                    className={`h-5 w-5 text-purple-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "تفاصيل الإيجار" : "Rent Details"}
                </h4>
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide block mb-1">
                      {direction === "rtl" ? "رقم الإيجار" : "Rent #"}
                    </span>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                      #{lease.id || "-"}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide block mb-1">
                      {direction === "rtl" ? "المدة" : "Duration"}
                    </span>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {duration.days} {direction === "rtl" ? "يوم" : "day"}
                      {duration.days !== 1
                        ? direction === "rtl"
                          ? ""
                          : "s"
                        : ""}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Dates and Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dates */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar
                    className={`h-5 w-5 text-orange-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "تواريخ الإيجار" : "Rent Dates"}
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {direction === "rtl" ? "تاريخ البداية:" : "Start Date:"}
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDate(lease.rent_start)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {direction === "rtl" ? "تاريخ النهاية:" : "End Date:"}
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDate(lease.rent_end)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Financial Information */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <DollarSign
                    className={`h-5 w-5 text-yellow-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl"
                    ? "المعلومات المالية"
                    : "Financial Information"}
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {direction === "rtl"
                        ? "المبلغ الإجمالي:"
                        : "Total Amount:"}
                    </span>
                    <span className="text-green-900 dark:text-green-100 font-bold text-lg">
                      {formatCurrency(lease.total_amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                      <CreditCard className="h-4 w-4 mr-1" />
                      {direction === "rtl" ? "طريقة الدفع:" : "Payment Method:"}
                    </span>
                    <span className="text-blue-900 dark:text-blue-100 font-medium">
                      {translatePaymentMethod(lease.payment_method || "cash")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      {direction === "rtl" ? "تاريخ الدفع:" : "Payment Date:"}
                    </span>
                    <span className="text-purple-900 dark:text-purple-100 font-medium">
                      {formatDate(lease.payment_date)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Notes Section */}
            {lease.notes && (
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MessageSquare
                    className={`h-5 w-5 text-orange-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "ملاحظات" : "Notes"}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  {lease.notes}
                </p>
              </Card>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
            <div
              className={`flex flex-col sm:flex-row items-center gap-4 ${
                direction === "rtl" ? "justify-start" : "justify-end"
              }`}
            >
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2"
              >
                <X
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "إغلاق" : "Close"}
              </Button>
              {onPrint && (
                <Button
                  variant="outline"
                  onClick={() => onPrint(lease)}
                  className="w-full sm:w-auto px-6 py-2"
                >
                  <FileText
                    className={`h-4 w-4 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "طباعة" : "Print"}
                </Button>
              )}
              {onEdit && (
                <Button
                  onClick={() => onEdit(lease)}
                  className="w-full sm:w-auto px-6 py-2"
                >
                  <Edit
                    className={`h-4 w-4 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "تعديل" : "Edit"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LeaseViewModal;
