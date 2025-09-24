import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  Star,
  User,
  Building2,
  Home,
  MessageSquare,
  Save,
  X,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Star as StarIcon,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const ReviewForm = ({ review = null, onSave, onCancel, isEdit = false }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    tenant: review?.tenant || "",
    tenantId: review?.tenantId || "",
    unit: review?.unit || "",
    building: review?.building || "",
    rating: review?.rating || 5,
    comment: review?.comment || "",
    status: review?.status || "positive",
    category: review?.category || "overall",
    date: review?.date || new Date().toISOString().split("T")[0],
  });

  // Mock tenants data - in real app, this would come from API
  const availableTenants = [
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@example.com",
      phone: "+201234567890",
      unit: "A-101",
      building: "Sunset Tower",
    },
    {
      id: 2,
      name: "Mona Ali",
      email: "mona.ali@example.com",
      phone: "+201112223334",
      unit: "A-102",
      building: "Sunset Tower",
    },
    {
      id: 3,
      name: "Omar Khalil",
      email: "omar.khalil@example.com",
      phone: "+201998887766",
      unit: "B-201",
      building: "Palm Residency",
    },
    {
      id: 4,
      name: "Sarah Mohamed",
      email: "sarah.mohamed@example.com",
      phone: "+201555666777",
      unit: "C-301",
      building: "Nile Heights",
    },
    {
      id: 5,
      name: "Mohamed Hassan",
      email: "mohamed.hassan@example.com",
      phone: "+201888999000",
      unit: "A-103",
      building: "Sunset Tower",
    },
  ];

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
    const selectedTenant = availableTenants.find(
      (tenant) => tenant.id === parseInt(tenantId)
    );
    if (selectedTenant) {
      setFormData((prev) => ({
        ...prev,
        tenant: selectedTenant.name,
        tenantId: selectedTenant.id,
        unit: selectedTenant.unit,
        building: selectedTenant.building,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenant.trim()) {
      newErrors.tenant =
        direction === "rtl" ? "اسم المستأجر مطلوب" : "Tenant name is required";
    }

    if (!formData.unit.trim()) {
      newErrors.unit =
        direction === "rtl" ? "رقم الوحدة مطلوب" : "Unit number is required";
    }

    if (!formData.building.trim()) {
      newErrors.building =
        direction === "rtl" ? "اسم المبنى مطلوب" : "Building name is required";
    }

    if (!formData.comment.trim()) {
      newErrors.comment =
        direction === "rtl" ? "التعليق مطلوب" : "Comment is required";
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating =
        direction === "rtl"
          ? "التقييم يجب أن يكون بين 1 و 5"
          : "Rating must be between 1 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const reviewData = {
        ...formData,
        id: review?.id || Date.now(),
        rating: parseInt(formData.rating),
      };

      onSave(reviewData);
    }
  };

  const categories = [
    { value: "payment", label: direction === "rtl" ? "الدفع" : "Payment" },
    {
      value: "maintenance",
      label: direction === "rtl" ? "الصيانة" : "Maintenance",
    },
    { value: "behavior", label: direction === "rtl" ? "السلوك" : "Behavior" },
    {
      value: "cleanliness",
      label: direction === "rtl" ? "النظافة" : "Cleanliness",
    },
    { value: "overall", label: direction === "rtl" ? "عام" : "Overall" },
  ];

  const statuses = [
    {
      value: "positive",
      label: direction === "rtl" ? "إيجابي" : "Positive",
      icon: ThumbsUp,
    },
    {
      value: "negative",
      label: direction === "rtl" ? "سلبي" : "Negative",
      icon: ThumbsDown,
    },
    {
      value: "neutral",
      label: direction === "rtl" ? "محايد" : "Neutral",
      icon: StarIcon,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit
                    ? direction === "rtl"
                      ? "تعديل المراجعة"
                      : "Edit Review"
                    : direction === "rtl"
                    ? "إضافة مراجعة جديدة"
                    : "Add New Review"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "املأ البيانات التالية لإضافة مراجعة جديدة"
                    : "Fill in the following information to add a new review"}
                </p>
              </div>
              <button
                onClick={onCancel}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <User className={`h-5 w-5 text-blue-600 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
                  {direction === "rtl"
                    ? "المعلومات الأساسية"
                    : "Basic Information"}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اسم المستأجر" : "Tenant Name"}
                  </label>
                  <select
                    value={formData.tenantId || ""}
                    onChange={(e) => handleTenantChange(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.tenant ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر المستأجر" : "Select Tenant"}
                    </option>
                    {availableTenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} - {tenant.unit} ({tenant.building})
                      </option>
                    ))}
                  </select>
                  {errors.tenant && (
                    <p className="text-red-500 text-sm mt-1">{errors.tenant}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl" ? "رقم الوحدة" : "Unit Number"}
                    </label>
                    <Input
                      value={formData.unit}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {direction === "rtl"
                        ? "يتم ملؤها تلقائياً عند اختيار المستأجر"
                        : "Auto-filled when tenant is selected"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl" ? "اسم المبنى" : "Building Name"}
                    </label>
                    <Input
                      value={formData.building}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {direction === "rtl"
                        ? "يتم ملؤها تلقائياً عند اختيار المستأجر"
                        : "Auto-filled when tenant is selected"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "التاريخ" : "Date"}
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Review Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <MessageSquare className={`h-5 w-5 text-green-600 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
                  {direction === "rtl" ? "تفاصيل المراجعة" : "Review Details"}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "التقييم" : "Rating"}
                  </label>
                  <div className={`flex items-center space-x-2 ${direction === "rtl" ? "space-x-reverse" : ""}`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleInputChange("rating", i + 1)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            i < formData.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                    <span className={`text-sm text-gray-600 dark:text-gray-400 ${direction === "rtl" ? "mr-2" : "ml-2"}`}>
                      {formData.rating} {direction === "rtl" ? "نجمة" : "Star"}
                      {formData.rating > 1
                        ? direction === "rtl"
                          ? "ات"
                          : "s"
                        : ""}
                    </span>
                  </div>
                  {errors.rating && (
                    <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الحالة" : "Status"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {statuses.map((status) => {
                      const IconComponent = status.icon;
                      return (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() =>
                            handleInputChange("status", status.value)
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.status === status.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          <IconComponent className="h-5 w-5 mx-auto mb-1" />
                          <span className="text-xs font-medium">
                            {status.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الفئة" : "Category"}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "التعليق" : "Comment"}
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                placeholder={
                  direction === "rtl"
                    ? "اكتب تعليقك هنا..."
                    : "Write your comment here..."
                }
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                  errors.comment ? "border-red-500" : ""
                }`}
              />
              {errors.comment && (
                <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-6 py-2"
              >
                <X className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
                {direction === "rtl" ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="px-6 py-2">
                <Save className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
                {isEdit
                  ? direction === "rtl"
                    ? "حفظ التغييرات"
                    : "Save Changes"
                  : direction === "rtl"
                  ? "إضافة المراجعة"
                  : "Add Review"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ReviewForm;
