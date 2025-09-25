import React from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  Star,
  User,
  Building2,
  Home,
  MessageSquare,
  X,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Printer,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";

const ReviewViewModal = ({ review, onClose, onEdit }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  if (!review) return null;

  const getStatusColor = (status) => {
    if (status === "positive")
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (status === "negative")
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  };

  const getStatusIcon = (status) => {
    if (status === "positive") return <ThumbsUp className="h-4 w-4" />;
    if (status === "negative") return <ThumbsDown className="h-4 w-4" />;
    return <Star className="h-4 w-4" />;
  };

  const translateCategory = (category) => {
    const categories = {
      payment: direction === "rtl" ? "الدفع" : "Payment",
      maintenance: direction === "rtl" ? "الصيانة" : "Maintenance",
      behavior: direction === "rtl" ? "السلوك" : "Behavior",
      cleanliness: direction === "rtl" ? "النظافة" : "Cleanliness",
      overall: direction === "rtl" ? "عام" : "Overall",
    };
    return categories[category] || category;
  };

  const handlePrint = () => {
    console.log("Print review:", review);
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
                  {direction === "rtl" ? "تفاصيل المراجعة" : "Review Details"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl" ? "مراجعة" : "Review"} #{review.id} -{" "}
                  {review.tenant}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="flex items-center w-full sm:w-auto"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  {direction === "rtl" ? "طباعة" : "Print"}
                </Button>
                <Button
                  size="sm"
                  onClick={onEdit}
                  className="flex items-center w-full sm:w-auto"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {direction === "rtl" ? "تعديل" : "Edit"}
                </Button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors self-start sm:self-auto"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Review Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                        <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {review.tenant}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {review.unit} - {review.building}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Status and Category */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        review.status
                      )}`}
                    >
                      {getStatusIcon(review.status)}
                      <span className="ml-2">
                        {direction === "rtl"
                          ? review.status === "positive"
                            ? "إيجابي"
                            : review.status === "negative"
                            ? "سلبي"
                            : "محايد"
                          : review.status === "positive"
                          ? "Positive"
                          : review.status === "negative"
                          ? "Negative"
                          : "Neutral"}
                      </span>
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {translateCategory(review.category)}
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {direction === "rtl" ? "التعليق:" : "Comment:"}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-4">
                {/* Date */}
                <Card className="p-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {direction === "rtl" ? "التاريخ" : "Date"}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Rating */}
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-500 mb-2">
                      {review.rating}
                    </div>
                    <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse mb-2">
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "من 5 نجوم" : "out of 5 stars"}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ReviewViewModal;
