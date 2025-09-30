import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  User,
  Home,
  Calendar,
  MessageSquare,
  Save,
  X,
  Building2,
  Upload,
  Image,
  DollarSign,
  UserCheck,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const CleaningForm = ({
  cleaning = null,
  onSave,
  onCancel,
  isEdit = false,
}) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: cleaning?.title || "",
    unit: cleaning?.unit || "",
    tenant: cleaning?.tenant || "",
    building: cleaning?.building || "",
    description: cleaning?.description || "",
    date: cleaning?.date || new Date().toISOString().split("T")[0],
    completedBy: cleaning?.completedBy || "",
    amount: cleaning?.amount || "",
    photos: cleaning?.photos || [],
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  // Mock tenants data - in real app, this would come from API
  const availableTenants = [
    {
      id: 1,
      name: "John Smith",
      unit: "A-101",
      building: "Sunset Tower",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      unit: "B-205",
      building: "Palm Residency",
    },
    {
      id: 3,
      name: "Mike Davis",
      unit: "C-301",
      building: "Nile Heights",
    },
    {
      id: 4,
      name: "Emma Wilson",
      unit: "D-402",
      building: "Garden Plaza",
    },
  ];

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
        unit: selectedTenant.unit,
        building: selectedTenant.building,
      }));
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setUploading(true);

    // Simulate file upload
    setTimeout(() => {
      const newPhotos = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      }));

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
      setUploading(false);
    }, 1000);
  };

  const handleRemovePhoto = (photoId) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.id !== photoId),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title =
        direction === "rtl"
          ? "عنوان التنظيف مطلوب"
          : "Cleaning title is required";
    }

    if (!formData.unit.trim()) {
      newErrors.unit =
        direction === "rtl" ? "الوحدة مطلوبة" : "Unit is required";
    }

    if (!formData.tenant.trim()) {
      newErrors.tenant =
        direction === "rtl" ? "اسم المستأجر مطلوب" : "Tenant name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        direction === "rtl"
          ? "وصف التنظيف مطلوب"
          : "Cleaning description is required";
    }

    if (!formData.date.trim()) {
      newErrors.date =
        direction === "rtl"
          ? "تاريخ التنظيف مطلوب"
          : "Cleaning date is required";
    }

    if (!formData.completedBy.trim()) {
      newErrors.completedBy =
        direction === "rtl"
          ? "اسم منفذ التنظيف مطلوب"
          : "Cleaner name is required";
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount =
        direction === "rtl" ? "التكلفة مطلوبة" : "Amount is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const cleaningData = {
        ...formData,
        id: cleaning?.id || Date.now(),
      };

      onSave(cleaningData);
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
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit
                    ? direction === "rtl"
                      ? "تعديل طلب التنظيف"
                      : "Edit Cleaning Request"
                    : direction === "rtl"
                    ? "إضافة طلب تنظيف جديد"
                    : "Add New Cleaning Request"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "املأ البيانات التالية لإضافة طلب تنظيف جديد"
                    : "Fill in the following information to add a new cleaning request"}
                </p>
              </div>
              <button
                onClick={onCancel}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors self-start sm:self-auto"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Sparkles
                  className={`h-5 w-5 text-green-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "معلومات التنظيف الأساسية"
                  : "Basic Cleaning Information"}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cleaning Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "عنوان التنظيف" : "Cleaning Title"} *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل عنوان التنظيف"
                        : "Enter cleaning title"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.title ? "border-red-500" : ""
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Tenant Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "المستأجر" : "Tenant"} *
                  </label>
                  <select
                    value={
                      availableTenants.find((t) => t.name === formData.tenant)
                        ?.id || ""
                    }
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
                        {tenant.name} - {tenant.unit}
                      </option>
                    ))}
                  </select>
                  {errors.tenant && (
                    <p className="text-red-500 text-sm mt-1">{errors.tenant}</p>
                  )}
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الوحدة" : "Unit"}
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

                {/* Building */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "المبنى" : "Building"}
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

                {/* Cleaning Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "تاريخ التنظيف" : "Cleaning Date"} *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.date ? "border-red-500" : ""
                    }`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Cleaning Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <MessageSquare
                  className={`h-5 w-5 text-blue-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "تفاصيل التنظيف" : "Cleaning Details"}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {direction === "rtl" ? "وصف التنظيف" : "Cleaning Description"}{" "}
                  *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder={
                    direction === "rtl"
                      ? "أدخل وصف مفصل للتنظيف المطلوب..."
                      : "Enter detailed description of cleaning required..."
                  }
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Completion Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <UserCheck
                  className={`h-5 w-5 text-purple-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "معلومات الإنجاز"
                  : "Completion Information"}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Completed By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "منفذ التنظيف" : "Cleaned By"} *
                  </label>
                  <Input
                    value={formData.completedBy}
                    onChange={(e) =>
                      handleInputChange("completedBy", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل اسم منفذ التنظيف"
                        : "Enter cleaner name"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.completedBy ? "border-red-500" : ""
                    }`}
                  />
                  {errors.completedBy && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.completedBy}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "التكلفة" : "Amount"} *
                  </label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    placeholder={
                      direction === "rtl" ? "أدخل التكلفة" : "Enter amount"
                    }
                    min="0"
                    step="0.01"
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.amount ? "border-red-500" : ""
                    }`}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Image
                  className={`h-5 w-5 text-orange-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "صور التنظيف" : "Cleaning Photos"}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {direction === "rtl" ? "رفع الصور" : "Upload Photos"}
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {direction === "rtl"
                      ? "اسحب الصور هنا أو انقر للاختيار"
                      : "Drag photos here or click to select"}
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="photo-upload"
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploading
                      ? direction === "rtl"
                        ? "جاري الرفع..."
                        : "Uploading..."
                      : direction === "rtl"
                      ? "اختيار الصور"
                      : "Select Photos"}
                  </label>
                </div>

                {/* Display uploaded photos */}
                {formData.photos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl"
                        ? "الصور المرفوعة"
                        : "Uploaded Photos"}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.photos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {photo.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-2"
              >
                <X
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="w-full sm:w-auto px-6 py-2">
                <Save
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {isEdit
                  ? direction === "rtl"
                    ? "حفظ التغييرات"
                    : "Save Changes"
                  : direction === "rtl"
                  ? "إضافة طلب التنظيف"
                  : "Add Cleaning Request"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CleaningForm;
