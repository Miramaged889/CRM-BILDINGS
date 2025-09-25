import React, { useState } from "react";
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
  Save,
  Home,
  Mail,
  Phone,
  Car,
  Shield,
  Droplets,
  Zap,
  Upload,
  Image,
  Paperclip,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const LeaseForm = ({ lease, onSave, onClose, isEdit = false }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    tenant: lease?.tenant || "",
    unit: lease?.unit || "",
    startDate: lease?.startDate || "",
    endDate: lease?.endDate || "",
    rent: lease?.rent || "",
    deposit: lease?.deposit || "",
    status: lease?.status || "active",
    type: lease?.type || "apartment",
    tenantEmail: lease?.tenantEmail || "",
    tenantPhone: lease?.tenantPhone || "",
    utilities: lease?.utilities || "",
    petPolicy: lease?.petPolicy || "",
    parking: lease?.parking || "",
    notes: lease?.notes || "",
    leasePhotos: lease?.leasePhotos || [],
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  // Mock data for dropdowns
  const availableUnits = [
    { id: "A-101", name: "A-101", type: "apartment" },
    { id: "A-203", name: "A-203", type: "apartment" },
    { id: "B-205", name: "B-205", type: "villa" },
    { id: "C-301", name: "C-301", type: "apartment" },
    { id: "D-102", name: "D-102", type: "villa" },
  ];

  const leaseTypes = [
    { value: "apartment", label: direction === "rtl" ? "شقة" : "Apartment" },
    { value: "villa", label: direction === "rtl" ? "فيلا" : "Villa" },
    { value: "office", label: direction === "rtl" ? "مكتب" : "Office" },
    { value: "shop", label: direction === "rtl" ? "محل" : "Shop" },
  ];

  const statusOptions = [
    { value: "active", label: direction === "rtl" ? "نشط" : "Active" },
    { value: "pending", label: direction === "rtl" ? "معلق" : "Pending" },
    { value: "expired", label: direction === "rtl" ? "منتهي" : "Expired" },
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

  const handleUnitChange = (unitId) => {
    const selectedUnit = availableUnits.find((unit) => unit.id === unitId);
    setFormData((prev) => ({
      ...prev,
      unit: selectedUnit?.name || "",
      type: selectedUnit?.type || "apartment",
    }));
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
        leasePhotos: [...prev.leasePhotos, ...newPhotos],
      }));

      setUploading(false);
    }, 1000);
  };

  const handleRemovePhoto = (photoId) => {
    setFormData((prev) => ({
      ...prev,
      leasePhotos: prev.leasePhotos.filter((photo) => photo.id !== photoId),
    }));
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

    if (!formData.startDate) {
      newErrors.startDate =
        direction === "rtl" ? "تاريخ البداية مطلوب" : "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate =
        direction === "rtl" ? "تاريخ النهاية مطلوب" : "End date is required";
    }

    if (!formData.rent || formData.rent <= 0) {
      newErrors.rent =
        direction === "rtl"
          ? "الإيجار الشهري مطلوب"
          : "Monthly rent is required";
    }

    if (!formData.deposit || formData.deposit <= 0) {
      newErrors.deposit =
        direction === "rtl" ? "الضمان مطلوب" : "Deposit is required";
    }

    if (!formData.tenantEmail.trim()) {
      newErrors.tenantEmail =
        direction === "rtl" ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.tenantEmail)) {
      newErrors.tenantEmail =
        direction === "rtl"
          ? "البريد الإلكتروني غير صحيح"
          : "Invalid email format";
    }

    if (!formData.tenantPhone.trim()) {
      newErrors.tenantPhone =
        direction === "rtl" ? "رقم الهاتف مطلوب" : "Phone number is required";
    }

    // Check if end date is after start date
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate =
          direction === "rtl"
            ? "تاريخ النهاية يجب أن يكون بعد تاريخ البداية"
            : "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const leaseData = {
        ...formData,
        rent: parseFloat(formData.rent),
        deposit: parseFloat(formData.deposit),
        id: lease?.id || Date.now(),
      };
      onSave(leaseData);
    }
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
                  {isEdit
                    ? direction === "rtl"
                      ? "تعديل عقد الإيجار"
                      : "Edit Lease"
                    : direction === "rtl"
                    ? "إضافة عقد إيجار جديد"
                    : "Add New Lease"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "إدارة معلومات عقد الإيجار"
                    : "Manage lease information"}
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

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {/* Tenant Information */}
            <Card className="p-4 sm:p-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اسم المستأجر" : "Tenant Name"} *
                  </label>
                  <Input
                    type="text"
                    value={formData.tenant}
                    onChange={(e) =>
                      handleInputChange("tenant", e.target.value)
                    }
                    className={errors.tenant ? "border-red-500" : ""}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل اسم المستأجر"
                        : "Enter tenant name"
                    }
                  />
                  {errors.tenant && (
                    <p className="text-red-500 text-sm mt-1">{errors.tenant}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "البريد الإلكتروني" : "Email"} *
                  </label>
                  <Input
                    type="email"
                    value={formData.tenantEmail}
                    onChange={(e) =>
                      handleInputChange("tenantEmail", e.target.value)
                    }
                    className={errors.tenantEmail ? "border-red-500" : ""}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل البريد الإلكتروني"
                        : "Enter email"
                    }
                  />
                  {errors.tenantEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tenantEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "رقم الهاتف" : "Phone Number"} *
                  </label>
                  <Input
                    type="tel"
                    value={formData.tenantPhone}
                    onChange={(e) =>
                      handleInputChange("tenantPhone", e.target.value)
                    }
                    className={errors.tenantPhone ? "border-red-500" : ""}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل رقم الهاتف"
                        : "Enter phone number"
                    }
                  />
                  {errors.tenantPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tenantPhone}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Property Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Building
                  className={`h-5 w-5 text-green-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "معلومات العقار"
                  : "Property Information"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "رقم الوحدة" : "Unit Number"} *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleUnitChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.unit
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر الوحدة" : "Select Unit"}
                    </option>
                    {availableUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} ({unit.type})
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "نوع العقار" : "Property Type"}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {leaseTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Lease Terms */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText
                  className={`h-5 w-5 text-purple-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "شروط الإيجار" : "Lease Terms"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "تاريخ البداية" : "Start Date"} *
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "تاريخ النهاية" : "End Date"} *
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الإيجار الشهري" : "Monthly Rent"} *
                  </label>
                  <Input
                    type="number"
                    value={formData.rent}
                    onChange={(e) => handleInputChange("rent", e.target.value)}
                    className={errors.rent ? "border-red-500" : ""}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل الإيجار الشهري"
                        : "Enter monthly rent"
                    }
                    min="0"
                    step="0.01"
                  />
                  {errors.rent && (
                    <p className="text-red-500 text-sm mt-1">{errors.rent}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الضمان" : "Security Deposit"} *
                  </label>
                  <Input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) =>
                      handleInputChange("deposit", e.target.value)
                    }
                    className={errors.deposit ? "border-red-500" : ""}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل مبلغ الضمان"
                        : "Enter security deposit"
                    }
                    min="0"
                    step="0.01"
                  />
                  {errors.deposit && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deposit}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الحالة" : "Status"}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Additional Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Home
                  className={`h-5 w-5 text-orange-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "معلومات إضافية"
                  : "Additional Information"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Droplets className="inline h-4 w-4 mr-1" />
                    {direction === "rtl" ? "المرافق" : "Utilities"}
                  </label>
                  <Input
                    type="text"
                    value={formData.utilities}
                    onChange={(e) =>
                      handleInputChange("utilities", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل المرافق المتاحة"
                        : "Enter available utilities"
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Shield className="inline h-4 w-4 mr-1" />
                    {direction === "rtl"
                      ? "سياسة الحيوانات الأليفة"
                      : "Pet Policy"}
                  </label>
                  <Input
                    type="text"
                    value={formData.petPolicy}
                    onChange={(e) =>
                      handleInputChange("petPolicy", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل سياسة الحيوانات الأليفة"
                        : "Enter pet policy"
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Car className="inline h-4 w-4 mr-1" />
                    {direction === "rtl" ? "مواقف السيارات" : "Parking"}
                  </label>
                  <Input
                    type="text"
                    value={formData.parking}
                    onChange={(e) =>
                      handleInputChange("parking", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل معلومات مواقف السيارات"
                        : "Enter parking information"
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "ملاحظات إضافية"
                      : "Additional Notes"}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={
                      direction === "rtl"
                        ? "أدخل أي ملاحظات إضافية"
                        : "Enter any additional notes"
                    }
                  />
                </div>
              </div>
            </Card>

            {/* Lease Photos */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Paperclip
                  className={`h-5 w-5 text-indigo-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "مرفقات عقد الإيجار"
                  : "Lease Attachments"}
              </h3>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  id="lease-photos"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="lease-photos"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
                        <span className="font-medium text-indigo-600 hover:text-indigo-500">
                          {direction === "rtl"
                            ? "انقر لرفع الملفات"
                            : "Click to upload files"}
                        </span>
                        <br />
                        <span>
                          {direction === "rtl"
                            ? "أو اسحب وأفلت الملفات هنا"
                            : "or drag and drop files here"}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {direction === "rtl"
                      ? "PNG, JPG, PDF حتى 10MB"
                      : "PNG, JPG, PDF up to 10MB"}
                  </p>
                </label>
              </div>

              {/* Uploaded Photos */}
              {formData.leasePhotos.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {direction === "rtl"
                      ? "الملفات المرفوعة"
                      : "Uploaded Files"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.leasePhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="flex-shrink-0">
                            {photo.type.startsWith("image/") ? (
                              <Image className="h-8 w-8 text-blue-500" />
                            ) : (
                              <FileText className="h-8 w-8 text-red-500" />
                            )}
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
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {photo.type.startsWith("image/") && (
                          <div className="mt-2">
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-20 object-cover rounded border border-gray-200 dark:border-gray-600"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
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
                  ? "إضافة عقد الإيجار"
                  : "Add Lease"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LeaseForm;
