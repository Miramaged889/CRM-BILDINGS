import React from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  User,
  Calendar,
  Sparkles,
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

const CleaningViewModal = ({ cleaning, onClose, onEdit }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  if (!cleaning) return null;

  const getStatusColor = (status) => {
    if (status === "completed")
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300";
    if (status === "in_progress")
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
    if (status === "pending")
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300";
    return "bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300";
  };

  const handlePrint = () => {
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
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {direction === "rtl"
                    ? "تفاصيل طلب التنظيف"
                    : "Cleaning Request Details"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {cleaning.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="hidden sm:flex"
                >
                  <Printer className="h-4 w-4" />
                  {direction === "rtl" ? "طباعة" : "Print"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(cleaning)}
                >
                  <Edit className="h-4 w-4" />
                  {direction === "rtl" ? "تعديل" : "Edit"}
                </Button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Sparkles
                    className={`h-5 w-5 text-green-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl"
                    ? "معلومات التنظيف"
                    : "Cleaning Information"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "العنوان" : "Title"}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {cleaning.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "التاريخ" : "Date"}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(cleaning.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "الوحدة" : "Unit"}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {cleaning.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "المبنى" : "Building"}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {cleaning.building}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <User
                    className={`h-5 w-5 text-blue-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl"
                    ? "معلومات المستأجر"
                    : "Tenant Information"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "الاسم" : "Name"}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {cleaning.tenant}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "الوحدة" : "Unit"}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {cleaning.unit}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Description */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {direction === "rtl" ? "وصف التنظيف" : "Cleaning Description"}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {cleaning.description}
              </p>
            </Card>

            {/* Completion Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <UserCheck
                    className={`h-5 w-5 text-purple-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl"
                    ? "معلومات الإنجاز"
                    : "Completion Information"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "منفذ التنظيف" : "Cleaned By"}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {cleaning.completedBy}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "التكلفة" : "Amount"}
                    </span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ${cleaning.amount}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar
                    className={`h-5 w-5 text-orange-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "التوقيت" : "Timing"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "تاريخ التنظيف" : "Cleaning Date"}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(cleaning.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "الحالة" : "Status"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        "completed"
                      )}`}
                    >
                      {direction === "rtl" ? "مكتمل" : "Completed"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Photos */}
            {cleaning.photos && cleaning.photos.length > 0 && (
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Image
                    className={`h-5 w-5 text-indigo-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "صور التنظيف" : "Cleaning Photos"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {cleaning.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => window.open(photo.url, "_blank")}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {direction === "rtl" ? "عرض" : "View"}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {photo.name}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                {direction === "rtl" ? "إغلاق" : "Close"}
              </Button>
              <Button onClick={() => onEdit(cleaning)}>
                <Edit className="h-4 w-4" />
                {direction === "rtl" ? "تعديل" : "Edit"}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CleaningViewModal;
