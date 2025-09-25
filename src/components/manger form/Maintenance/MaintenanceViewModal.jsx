import React from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  User,
  Calendar,
  Wrench,
  Building,
  Phone,
  Mail,
  X,
  Edit,
  Printer,
  Clock,
  AlertCircle,
  CheckCircle,
  UserCheck,
  DollarSign,
  Image,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";

const MaintenanceViewModal = ({ maintenance, onClose, onEdit }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  if (!maintenance) return null;

  const getPriorityColor = (priority) => {
    if (priority === "high")
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300";
    if (priority === "medium")
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300";
    if (priority === "low")
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300";
    return "bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300";
  };

  const getStatusColor = (status) => {
    if (status === "completed")
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300";
    if (status === "in_progress")
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
    if (status === "pending")
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300";
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

  const handlePrint = () => {
    console.log("Print maintenance:", maintenance);
    window.print();
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
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
      >
        <Card className="p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {direction === "rtl"
                    ? "تفاصيل طلب الصيانة"
                    : "Maintenance Request Details"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl" ? "طلب صيانة" : "Maintenance Request"} #
                  {maintenance.id} - {maintenance.tenant}
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
            {/* Request Header */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                {maintenance.title}
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                {direction === "rtl"
                  ? "طلب صيانة عقاري"
                  : "Property Maintenance Request"}
              </p>
            </div>

            {/* Request Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Tenant Information */}
              <Card className="p-4 sm:p-6">
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
                      {maintenance.tenant}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "الوحدة:" : "Unit:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {maintenance.unit}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Request Details */}
              <Card className="p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Wrench
                    className={`h-5 w-5 text-green-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "تفاصيل الطلب" : "Request Details"}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "رقم الطلب:" : "Request #:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      #{maintenance.id}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "الحالة:" : "Status:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {direction === "rtl" ? "معلق" : "Pending"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Date Information */}
              <Card className="p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar
                    className={`h-5 w-5 text-orange-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "معلومات التاريخ" : "Date Information"}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "تاريخ الطلب:" : "Request Date:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formatDate(maintenance.date)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "الأولوية:" : "Priority:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {direction === "rtl" ? "متوسط" : "Medium"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Completed By Information */}
              <Card className="p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <UserCheck
                    className={`h-5 w-5 text-green-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "معلومات المنفذ" : "Completed By"}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "الاسم:" : "Name:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {maintenance.completedBy ||
                        (direction === "rtl" ? "غير محدد" : "Not specified")}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "المبلغ المدفوع:" : "Amount Paid:"}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      ${maintenance.amount || "0.00"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Description */}
            <Card className="p-4 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertCircle
                  className={`h-5 w-5 text-purple-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "وصف المشكلة" : "Problem Description"}
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {maintenance.description}
                </p>
              </div>
            </Card>

            {/* Photos Section */}
            {maintenance.photos && maintenance.photos.length > 0 && (
              <Card className="p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Image
                    className={`h-5 w-5 text-purple-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "صور الصيانة" : "Maintenance Photos"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {maintenance.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                    >
                      <div className="aspect-w-16 aspect-h-9 mb-3">
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-32 object-cover rounded border border-gray-200 dark:border-gray-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {photo.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(photo.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Additional Information */}
            <Card className="p-4 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {direction === "rtl"
                  ? "معلومات إضافية"
                  : "Additional Information"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Building className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {direction === "rtl" ? "المبنى" : "Building"}
                    </span>
                  </div>
                  <p className="text-blue-900 dark:text-blue-100 text-sm">
                    {direction === "rtl" ? "مبنى سكني" : "Residential Building"}
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {direction === "rtl" ? "الوقت المتوقع" : "Estimated Time"}
                    </span>
                  </div>
                  <p className="text-green-900 dark:text-green-100 text-sm">
                    {direction === "rtl" ? "2-3 أيام" : "2-3 days"}
                  </p>
                </div>
              </div>
            </Card>
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
              <Button
                variant="outline"
                onClick={handlePrint}
                className="w-full sm:w-auto px-6 py-2"
              >
                <Printer
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "طباعة" : "Print"}
              </Button>
              <Button
                onClick={() => onEdit(maintenance)}
                className="w-full sm:w-auto px-6 py-2"
              >
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

export default MaintenanceViewModal;
