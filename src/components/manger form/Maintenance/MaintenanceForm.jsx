import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  Wrench,
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

const MaintenanceForm = ({
  maintenance = null,
  onSave,
  onCancel,
  isEdit = false,
}) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: maintenance?.title || "",
    unit: maintenance?.unit || "",
    tenant: maintenance?.tenant || "",
    building: maintenance?.building || "",
    description: maintenance?.description || "",
    date: maintenance?.date || new Date().toISOString().split("T")[0],
    completedBy: maintenance?.completedBy || "",
    amount: maintenance?.amount || "",
    photos: maintenance?.photos || [],
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

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
    } else {
      setFormData((prev) => ({
        ...prev,
        tenant: "",
        unit: "",
        building: "",
      }));
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);

    // Simulate file upload process
    setTimeout(() => {
      const newPhotos = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: file.size,
        type: file.type,
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
        direction === "rtl" ? "عنوان الطلب مطلوب" : "Request title is required";
    }

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

    if (!formData.description.trim()) {
      newErrors.description =
        direction === "rtl"
          ? "وصف المشكلة مطلوب"
          : "Problem description is required";
    }

    if (!formData.completedBy.trim()) {
      newErrors.completedBy =
        direction === "rtl"
          ? "اسم المنفذ مطلوب"
          : "Completed by name is required";
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount =
        direction === "rtl"
          ? "المبلغ المدفوع مطلوب"
          : "Amount paid is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const maintenanceData = {
        ...formData,
        id: maintenance?.id || Date.now(),
      };

      onSave(maintenanceData);
    }
  };

  // Find the selected tenant for display
  const getSelectedTenantId = () => {
    const tenant = availableTenants.find((t) => t.name === formData.tenant);
    return tenant ? tenant.id : "";
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
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit
                    ? direction === "rtl"
                      ? "تعديل طلب الصيانة"
                      : "Edit Maintenance Request"
                    : direction === "rtl"
                    ? "إضافة طلب صيانة جديد"
                    : "Add New Maintenance Request"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "املأ البيانات التالية لإضافة طلب صيانة جديد"
                    : "Fill in the following information to add a new maintenance request"}
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
                  <Wrench
                    className={`h-5 w-5 text-blue-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl"
                    ? "المعلومات الأساسية"
                    : "Basic Information"}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "الصيانة التي تمت"
                      : "Maintenance Done"}
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل الصيانة التي تمت"
                        : "Enter maintenance done"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.title ? "border-red-500" : ""
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اسم المستأجر" : "Tenant Name"} *
                  </label>
                  <select
                    value={getSelectedTenantId()}
                    onChange={(e) => handleTenantChange(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.tenant ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">
                      {direction === "rtl"
                        ? "اختر المستأجر"
                        : "Select Tenant Name"}
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
                  {formData.tenant && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                        <User
                          className={`h-4 w-4 ${
                            direction === "rtl" ? "ml-2" : "mr-2"
                          }`}
                        />
                        {direction === "rtl"
                          ? "المستأجر المحدد:"
                          : "Selected Tenant:"}
                        <span className="font-medium">{formData.tenant}</span>
                      </p>
                    </div>
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
                    {direction === "rtl" ? "تاريخ الصيانة" : "Maintenance Date"}
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اسم المنفذ" : "Completed By"} *
                  </label>
                  <Input
                    value={formData.completedBy}
                    onChange={(e) =>
                      handleInputChange("completedBy", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل اسم المنفذ"
                        : "Enter person who completed the work"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "المبلغ المدفوع" : "Amount Paid"} *
                  </label>
                  <div className="relative">
                    <div
                      className={`absolute inset-y-0 flex items-center px-3 pointer-events-none ${
                        direction === "rtl" ? "right-0" : "left-0"
                      }`}
                    >
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                      placeholder={
                        direction === "rtl"
                          ? "أدخل المبلغ المدفوع"
                          : "Enter amount paid"
                      }
                      min="0"
                      step="0.01"
                      className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                        direction === "rtl" ? "pr-10" : "pl-10"
                      } ${errors.amount ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>
              </div>

              {/* Problem Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <MessageSquare
                    className={`h-5 w-5 text-green-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "وصف المشكلة" : "Problem Description"}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "وصف المشكلة"
                      : "Problem Description"}{" "}
                    *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "اكتب وصفاً مفصلاً للمشكلة..."
                        : "Write a detailed description of the problem..."
                    }
                    rows={6}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-colors ${
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
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Image
                  className={`h-5 w-5 text-purple-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "صور الصيانة" : "Maintenance Photos"}
              </h3>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  id="maintenance-photos"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="maintenance-photos"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {uploading ? (
                      direction === "rtl" ? (
                        "جاري الرفع..."
                      ) : (
                        "Uploading..."
                      )
                    ) : (
                      <>
                        <span className="font-medium text-purple-600 hover:text-purple-500">
                          {direction === "rtl"
                            ? "انقر لرفع الصور"
                            : "Click to upload photos"}
                        </span>
                        <br />
                        <span>
                          {direction === "rtl"
                            ? "أو اسحب وأفلت الصور هنا"
                            : "or drag and drop photos here"}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {direction === "rtl"
                      ? "PNG, JPG حتى 10MB"
                      : "PNG, JPG up to 10MB"}
                  </p>
                </label>
              </div>

              {/* Uploaded Photos */}
              {formData.photos.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {direction === "rtl" ? "الصور المرفوعة" : "Uploaded Photos"}{" "}
                    ({formData.photos.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                          <div className="flex-shrink-0">
                            <Image className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {photo.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(photo.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-24 object-cover rounded border border-gray-200 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-6 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {isEdit
                  ? direction === "rtl"
                    ? "حفظ التغييرات"
                    : "Save Changes"
                  : direction === "rtl"
                  ? "إضافة الطلب"
                  : "Add Request"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MaintenanceForm;
