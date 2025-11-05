import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { fetchTenants } from "../../../store/slices/tenantsSlice";
import {
  Star,
  User,
  MessageSquare,
  X,
  Calendar,
  Edit,
  Printer,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";

const ReviewViewModal = ({ review, onClose, onEdit }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { tenants } = useSelector((state) => state.tenants);

  useEffect(() => {
    if (!tenants || tenants.length === 0) {
      dispatch(fetchTenants({}));
    }
  }, [dispatch, tenants]);

  // Helper function to get tenant name by ID
  const getTenantNameById = useMemo(() => {
    return (tenantId) => {
      if (!tenantId) return "-";
      const foundTenant = tenants?.find((t) => t.id === tenantId);
      return (
        foundTenant?.full_name || foundTenant?.name || `Tenant #${tenantId}`
      );
    };
  }, [tenants]);

  // Use the function from useMemo
  const getTenantName = getTenantNameById;

  // Get tenant name from review data
  const tenantName =
    review?.tenantName ||
    (review?.tenant
      ? getTenantName(
          typeof review.tenant === "object" ? review.tenant.id : review.tenant
        )
      : "-");

  // Get rate value (support both rate and rating fields)
  const rate = review?.rate || review?.rating || "0.0";
  const rateNumber = parseFloat(rate);

  if (!review) return null;

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
                  {direction === "rtl" ? "مراجعة" : "Review"} #{review.id}
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
            <Card className="p-6">
              {/* Rating and Tenant Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={`review-${review.id}-star-${i}`}
                        className={`h-5 w-5 ${
                          i < rateNumber
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {rateNumber.toFixed(1)}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ${
                    direction === "rtl" ? "flex-row-reverse" : ""
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">{tenantName}</span>
                  <span className="mx-1">•</span>
                  <Calendar className="h-4 w-4" />
                  <span>
                    {review.date
                      ? new Date(review.date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>

              {/* Comment */}
              {review.comment && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {direction === "rtl" ? "التعليق:" : "Comment:"}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ReviewViewModal;
