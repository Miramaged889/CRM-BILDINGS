import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  DollarSign,
  Save,
  X,
  Upload,
  Image,
  MapPin,
  Building,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

const TenantForm = ({ tenant = null, onSave, onCancel, isEdit = false }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: tenant?.name || "",
    email: tenant?.email || "",
    phone: tenant?.phone || "",
    unit: tenant?.unit || "",
    building: tenant?.building || "",
    leaseStart: tenant?.leaseStart || new Date().toISOString().split("T")[0],
    leaseEnd: tenant?.leaseEnd || "",
    rent: tenant?.rent || "",
    deposit: tenant?.deposit || "",
    avatar: tenant?.avatar || "",
    address: tenant?.address || "",
    emergencyContact: tenant?.emergencyContact || "",
    emergencyPhone: tenant?.emergencyPhone || "",
    notes: tenant?.notes || "",
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  // Mock buildings data - in real app, this would come from API
  const availableBuildings = [
    { id: 1, name: "Sunset Tower", address: "123 Sunset Blvd" },
    { id: 2, name: "Palm Residency", address: "456 Palm Street" },
    { id: 3, name: "Nile Heights", address: "789 Nile Avenue" },
    { id: 4, name: "Garden Plaza", address: "321 Garden Road" },
  ];

  // Mock units data - in real app, this would come from API
  const availableUnits = [
    { id: "A-101", building: "Sunset Tower", rent: 1200 },
    { id: "A-102", building: "Sunset Tower", rent: 1300 },
    { id: "B-201", building: "Palm Residency", rent: 1500 },
    { id: "C-301", building: "Nile Heights", rent: 1800 },
    { id: "B-102", building: "Palm Residency", rent: 1350 },
    { id: "C-202", building: "Nile Heights", rent: 1600 },
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
    if (selectedUnit) {
      setFormData((prev) => ({
        ...prev,
        unit: selectedUnit.id,
        building: selectedUnit.building,
        rent: selectedUnit.rent,
      }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    // Simulate file upload process
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          avatar: e.target.result,
        }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        direction === "rtl" ? "اسم المستأجر مطلوب" : "Tenant name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        direction === "rtl" ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email =
        direction === "rtl"
          ? "البريد الإلكتروني غير صحيح"
          : "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        direction === "rtl" ? "رقم الهاتف مطلوب" : "Phone number is required";
    }

    if (!formData.unit.trim()) {
      newErrors.unit =
        direction === "rtl" ? "رقم الوحدة مطلوب" : "Unit number is required";
    }

    if (!formData.leaseStart.trim()) {
      newErrors.leaseStart =
        direction === "rtl"
          ? "تاريخ بداية العقد مطلوب"
          : "Lease start date is required";
    }

    if (!formData.leaseEnd.trim()) {
      newErrors.leaseEnd =
        direction === "rtl"
          ? "تاريخ نهاية العقد مطلوب"
          : "Lease end date is required";
    }

    if (!formData.rent || formData.rent <= 0) {
      newErrors.rent =
        direction === "rtl" ? "مبلغ الإيجار مطلوب" : "Rent amount is required";
    }

    if (!formData.deposit || formData.deposit <= 0) {
      newErrors.deposit =
        direction === "rtl"
          ? "مبلغ الضمان مطلوب"
          : "Deposit amount is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const tenantData = {
        ...formData,
        id: tenant?.id || Date.now(),
      };

      onSave(tenantData);
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
                      ? "تعديل بيانات المستأجر"
                      : "Edit Tenant Information"
                    : direction === "rtl"
                    ? "إضافة مستأجر جديد"
                    : "Add New Tenant"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "املأ البيانات التالية لإضافة مستأجر جديد"
                    : "Fill in the following information to add a new tenant"}
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
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <User
                  className={`h-5 w-5 text-blue-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "المعلومات الشخصية"
                  : "Personal Information"}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Avatar Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {direction === "rtl" ? "الصورة الشخصية" : "Profile Picture"}
                  </label>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="relative">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        {uploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        {uploading
                          ? direction === "rtl"
                            ? "جاري الرفع..."
                            : "Uploading..."
                          : direction === "rtl"
                          ? "رفع صورة"
                          : "Upload Photo"}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الاسم الكامل" : "Full Name"} *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل الاسم الكامل"
                        : "Enter full name"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "البريد الإلكتروني" : "Email"} *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل البريد الإلكتروني"
                        : "Enter email address"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "رقم الهاتف" : "Phone Number"} *
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل رقم الهاتف"
                        : "Enter phone number"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "العنوان" : "Address"}
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder={
                      direction === "rtl" ? "أدخل العنوان" : "Enter address"
                    }
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Lease Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Home
                  className={`h-5 w-5 text-green-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "معلومات العقد" : "Lease Information"}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Unit Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الوحدة" : "Unit"} *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleUnitChange(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.unit ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر الوحدة" : "Select Unit"}
                    </option>
                    {availableUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.id} - {unit.building} (${unit.rent}/month)
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
                  )}
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
                      ? "يتم ملؤها تلقائياً عند اختيار الوحدة"
                      : "Auto-filled when unit is selected"}
                  </p>
                </div>

                {/* Lease Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "تاريخ بداية العقد"
                      : "Lease Start Date"}{" "}
                    *
                  </label>
                  <Input
                    type="date"
                    value={formData.leaseStart}
                    onChange={(e) =>
                      handleInputChange("leaseStart", e.target.value)
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.leaseStart ? "border-red-500" : ""
                    }`}
                  />
                  {errors.leaseStart && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.leaseStart}
                    </p>
                  )}
                </div>

                {/* Lease End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "تاريخ نهاية العقد"
                      : "Lease End Date"}{" "}
                    *
                  </label>
                  <Input
                    type="date"
                    value={formData.leaseEnd}
                    onChange={(e) =>
                      handleInputChange("leaseEnd", e.target.value)
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.leaseEnd ? "border-red-500" : ""
                    }`}
                  />
                  {errors.leaseEnd && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.leaseEnd}
                    </p>
                  )}
                </div>

                {/* Rent Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "مبلغ الإيجار الشهري"
                      : "Monthly Rent"}{" "}
                    *
                  </label>
                  <Input
                    type="number"
                    value={formData.rent}
                    onChange={(e) => handleInputChange("rent", e.target.value)}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل مبلغ الإيجار"
                        : "Enter rent amount"
                    }
                    min="0"
                    step="0.01"
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.rent ? "border-red-500" : ""
                    }`}
                  />
                  {errors.rent && (
                    <p className="text-red-500 text-sm mt-1">{errors.rent}</p>
                  )}
                </div>

                {/* Deposit Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "مبلغ الضمان" : "Security Deposit"} *
                  </label>
                  <Input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) =>
                      handleInputChange("deposit", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل مبلغ الضمان"
                        : "Enter deposit amount"
                    }
                    min="0"
                    step="0.01"
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.deposit ? "border-red-500" : ""
                    }`}
                  />
                  {errors.deposit && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deposit}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Phone
                  className={`h-5 w-5 text-red-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "جهة الاتصال في الطوارئ"
                  : "Emergency Contact"}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "اسم جهة الاتصال"
                      : "Emergency Contact Name"}
                  </label>
                  <Input
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      handleInputChange("emergencyContact", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل اسم جهة الاتصال"
                        : "Enter emergency contact name"
                    }
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "رقم هاتف الطوارئ"
                      : "Emergency Phone"}
                  </label>
                  <Input
                    value={formData.emergencyPhone}
                    onChange={(e) =>
                      handleInputChange("emergencyPhone", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل رقم هاتف الطوارئ"
                        : "Enter emergency phone number"
                    }
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Calendar
                  className={`h-5 w-5 text-purple-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "ملاحظات إضافية" : "Additional Notes"}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {direction === "rtl" ? "ملاحظات" : "Notes"}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder={
                    direction === "rtl"
                      ? "أدخل أي ملاحظات إضافية..."
                      : "Enter any additional notes..."
                  }
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
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
                  ? "إضافة المستأجر"
                  : "Add Tenant"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TenantForm;
