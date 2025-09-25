import React from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  User,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  X,
  Edit,
  Printer,
  MapPin,
  Clock,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";

const ContractViewModal = ({ contract, onClose, onEdit, onPrint }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const translateStatus = (status) => {
    if (status === "active") return direction === "rtl" ? "نشط" : "Active";
    if (status === "expired") return direction === "rtl" ? "منتهي" : "Expired";
    if (status === "pending") return direction === "rtl" ? "معلق" : "Pending";
    return status;
  };

  const translateType = (type) => {
    if (type === "management")
      return direction === "rtl" ? "إدارة" : "Management";
    if (type === "maintenance")
      return direction === "rtl" ? "صيانة" : "Maintenance";
    if (type === "cleaning") return direction === "rtl" ? "تنظيف" : "Cleaning";
    if (type === "security") return direction === "rtl" ? "أمن" : "Security";
    return type;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateDuration = () => {
    const start = new Date(contract.start);
    const end = new Date(contract.end);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.ceil(diffDays / 30);
    return months;
  };

  const calculateTotalValue = () => {
    const months = calculateDuration();
    return contract.monthlyFee * months;
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
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {direction === "rtl" ? "تفاصيل العقد" : "Contract Details"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "عرض تفاصيل عقد الإيجار"
                    : "View rental contract details"}
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
            {/* Contract Header */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                {direction === "rtl" ? "عقد إيجار" : "Rental Contract"}
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                {direction === "rtl"
                  ? "عقد إيجار عقاري"
                  : "Property Rental Agreement"}
              </p>
              <div className="mt-4">
                <span
                  className={`px-4 py-2 text-sm rounded-full font-medium ${getStatusColor(
                    contract.status
                  )}`}
                >
                  {translateStatus(contract.status)}
                </span>
              </div>
            </div>

            {/* Contract Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Owner Information */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <User
                    className={`h-5 w-5 text-blue-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "معلومات المالك" : "Owner Information"}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "الاسم:" : "Name:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {contract.owner}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Building Information */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Building2
                    className={`h-5 w-5 text-green-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl"
                    ? "معلومات المبنى"
                    : "Building Information"}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "المبنى:" : "Building:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {contract.building}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "الوحدات:" : "Units:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {contract.occupiedUnits}/{contract.totalUnits}{" "}
                      {direction === "rtl" ? "وحدة" : "units"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "النوع:" : "Type:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {translateType(contract.type)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Contract Details */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText
                    className={`h-5 w-5 text-purple-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "تفاصيل العقد" : "Contract Details"}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "رقم العقد:" : "Contract #:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      #{contract.id}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "المدة:" : "Duration:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {calculateDuration()}{" "}
                      {direction === "rtl" ? "شهر" : "months"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Dates and Financial Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dates */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar
                    className={`h-5 w-5 text-orange-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "تواريخ العقد" : "Contract Dates"}
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
                      {formatDate(contract.start)}
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
                      {formatDate(contract.end)}
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
                      {direction === "rtl" ? "الرسوم الشهرية:" : "Monthly Fee:"}
                    </span>
                    <span className="text-green-900 dark:text-green-100 font-bold text-lg">
                      {formatCurrency(contract.monthlyFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {direction === "rtl"
                        ? "الوحدات المشغولة:"
                        : "Occupied Units:"}
                    </span>
                    <span className="text-blue-900 dark:text-blue-100 font-bold">
                      {contract.occupiedUnits}/{contract.totalUnits}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      {direction === "rtl"
                        ? "إجمالي قيمة العقد:"
                        : "Total Contract Value:"}
                    </span>
                    <span className="text-purple-900 dark:text-purple-100 font-bold">
                      {formatCurrency(calculateTotalValue())}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Notes Section */}
            {contract.notes && (
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {direction === "rtl" ? "ملاحظات إضافية" : "Additional Notes"}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  {contract.notes}
                </p>
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
                onClick={() => onPrint(contract)}
                className="px-6 py-2"
              >
                <Printer
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "طباعة" : "Print"}
              </Button>
              <Button onClick={() => onEdit(contract)} className="px-6 py-2">
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

export default ContractViewModal;
