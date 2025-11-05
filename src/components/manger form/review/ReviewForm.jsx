import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import { Star, User, MessageSquare, Save, X } from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { createReview, updateReview } from "../../../store/slices/reviewsSlice";
import { fetchTenants } from "../../../store/slices/tenantsSlice";

const ReviewForm = ({ review = null, onSave, onCancel, isEdit = false }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { tenants } = useSelector((state) => state.tenants);
  const { isLoading: isSaving } = useSelector((state) => state.reviews);

  const [formData, setFormData] = useState({
    tenantId: review?.tenant || review?.tenantId || "",
    rate: review?.rate || review?.rating || 0,
    comment: review?.comment || "",
  });

  const [hoveredStar, setHoveredStar] = useState(null);

  useEffect(() => {
    // Fetch tenants for the dropdown
    if (!tenants || tenants.length === 0) {
      dispatch(fetchTenants({}));
    }
  }, [dispatch]);

  const availableTenants = useMemo(() => {
    return (tenants || []).map((t) => ({
      id: t.id,
      name: t.full_name || t.name || "",
      unit: t.rent_info?.unit_name || "",
      building: t.rent_info?.building_name || "",
    }));
  }, [tenants]);

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleTenantChange = (tenantId) => {
    setFormData((prev) => ({
      ...prev,
      tenantId: tenantId ? parseInt(tenantId) : "",
    }));
  };

  const handleStarClick = (rate) => {
    setFormData((prev) => ({
      ...prev,
      rate: rate,
    }));
    // Clear error when user selects a rating
    if (errors.rate) {
      setErrors((prev) => ({
        ...prev,
        rate: "",
      }));
    }
  };

  const handleStarHover = (starIndex) => {
    setHoveredStar(starIndex + 1);
  };

  const handleStarLeave = () => {
    setHoveredStar(null);
  };

  const getStarFill = (starIndex) => {
    const starValue = starIndex + 1;
    if (hoveredStar !== null) {
      return starValue <= hoveredStar;
    }
    return starValue <= formData.rate;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenantId || formData.tenantId === "") {
      newErrors.tenantId =
        direction === "rtl" ? "اسم المستأجر مطلوب" : "Tenant is required";
    }

    if (!formData.rate || formData.rate < 1 || formData.rate > 5) {
      newErrors.rate =
        direction === "rtl"
          ? "التقييم مطلوب ويجب أن يكون بين 1 و 5"
          : "Rating is required and must be between 1 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      tenant: parseInt(formData.tenantId, 10),
      rate: parseInt(formData.rate, 10),
      ...(formData.comment &&
        formData.comment.trim() && { comment: formData.comment.trim() }),
    };

    try {
      let result;
      if (isEdit && review?.id) {
        result = await dispatch(
          updateReview({ id: review.id, data: payload })
        ).unwrap();
      } else {
        result = await dispatch(createReview(payload)).unwrap();
      }
      if (onSave) onSave(result);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err?.message || "Failed" }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
      >
        <Card className="p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit
                    ? direction === "rtl"
                      ? "تعديل المراجعة"
                      : "Edit Review"
                    : direction === "rtl"
                    ? "إضافة مراجعة جديدة"
                    : "Add New Review"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "املأ البيانات التالية لإضافة مراجعة جديدة"
                    : "Fill in the following information to add a new review"}
                </p>
              </div>
              <button
                onClick={onCancel}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors self-start sm:self-auto"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tenant Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <User
                    className={`h-5 w-5 text-blue-600 dark:text-blue-400 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl"
                    ? "المعلومات الأساسية"
                    : "Basic Information"}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اسم المستأجر" : "Tenant"} *
                  </label>
                  <select
                    value={formData.tenantId || ""}
                    onChange={(e) => handleTenantChange(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors ${
                      errors.tenantId
                        ? "border-red-500 dark:border-red-400"
                        : ""
                    }`}
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر المستأجر" : "Select Tenant"}
                    </option>
                    {availableTenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} {tenant.unit && `- ${tenant.unit}`}{" "}
                        {tenant.building && `(${tenant.building})`}
                      </option>
                    ))}
                  </select>
                  {errors.tenantId && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.tenantId}
                    </p>
                  )}
                </div>
              </div>

              {/* Review Rating */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <MessageSquare
                    className={`h-5 w-5 text-green-600 dark:text-green-400 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "التقييم" : "Rating"}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "التقييم" : "Rating"} *
                  </label>
                  <div
                    className={`flex items-center gap-1 ${
                      direction === "rtl" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => {
                      const isFilled = getStarFill(i);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleStarClick(i + 1)}
                          onMouseEnter={() => handleStarHover(i)}
                          onMouseLeave={handleStarLeave}
                          className="focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded transition-all transform hover:scale-125 active:scale-95"
                          aria-label={`${i + 1} ${
                            direction === "rtl" ? "نجمة" : "star"
                          }`}
                        >
                          <Star
                            className={`h-10 w-10 sm:h-12 sm:w-12 transition-all duration-300 ${
                              isFilled
                                ? "text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400 drop-shadow-md scale-110"
                                : "text-gray-300 dark:text-gray-600 hover:text-amber-200 dark:hover:text-amber-700"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span
                      className={`text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 min-w-[60px] ${
                        direction === "rtl" ? "mr-3" : "ml-3"
                      }`}
                    >
                      {formData.rate > 0 ? (
                        <>
                          {formData.rate}{" "}
                          {direction === "rtl" ? "نجمة" : "Star"}
                          {formData.rate > 1
                            ? direction === "rtl"
                              ? "ات"
                              : "s"
                            : ""}
                        </>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                          {direction === "rtl"
                            ? "اختر التقييم"
                            : "Select rating"}
                        </span>
                      )}
                    </span>
                  </div>
                  {errors.rate && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {errors.rate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "التعليق" : "Comment"}
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                  ({direction === "rtl" ? "اختياري" : "Optional"})
                </span>
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                placeholder={
                  direction === "rtl"
                    ? "اكتب تعليقك هنا (اختياري)..."
                    : "Write your comment here (optional)..."
                }
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 resize-none transition-colors`}
              />
            </div>

            {/* Form Actions */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 ${
                direction === "rtl" ? "sm:flex-row-reverse" : ""
              }`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white disabled:opacity-60"
              >
                <Save
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {isSaving
                  ? direction === "rtl"
                    ? "جارٍ الحفظ..."
                    : "Saving..."
                  : isEdit
                  ? direction === "rtl"
                    ? "حفظ التغييرات"
                    : "Save Changes"
                  : direction === "rtl"
                  ? "إضافة المراجعة"
                  : "Add Review"}
              </Button>
              {errors.submit && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {errors.submit}
                </p>
              )}
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ReviewForm;
