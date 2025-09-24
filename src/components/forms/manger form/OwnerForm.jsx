import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
  Upload,
  Building2,
  DollarSign,
  Star,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const OwnerForm = ({ owner = null, onSave, onCancel, isEdit = false }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: owner?.name || "",
    email: owner?.email || "",
    phone: owner?.phone || "",
    address: owner?.address || "",
    dateJoined: owner?.dateJoined || new Date().toISOString().split("T")[0],
    buildings: owner?.buildings || 0,
    units: owner?.units || 0,
    rating: owner?.rating || 5.0,
    totalRevenue: owner?.totalRevenue || 0,
    monthlyRevenue: owner?.monthlyRevenue || 0,
    avatar: owner?.avatar || "",
  });

  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(owner?.avatar || "");

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

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
        setFormData((prev) => ({
          ...prev,
          avatar: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        direction === "rtl" ? "اسم المالك مطلوب" : "Owner name is required";
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

    if (!formData.address.trim()) {
      newErrors.address =
        direction === "rtl" ? "العنوان مطلوب" : "Address is required";
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating =
        direction === "rtl"
          ? "التقييم يجب أن يكون بين 0 و 5"
          : "Rating must be between 0 and 5";
    }

    if (formData.buildings < 0) {
      newErrors.buildings =
        direction === "rtl"
          ? "عدد المباني يجب أن يكون أكبر من أو يساوي 0"
          : "Number of buildings must be 0 or greater";
    }

    if (formData.units < 0) {
      newErrors.units =
        direction === "rtl"
          ? "عدد الوحدات يجب أن يكون أكبر من أو يساوي 0"
          : "Number of units must be 0 or greater";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const ownerData = {
        ...formData,
        id: owner?.id || Date.now(),
        buildings: parseInt(formData.buildings),
        units: parseInt(formData.units),
        rating: parseFloat(formData.rating),
        totalRevenue: parseFloat(formData.totalRevenue),
        monthlyRevenue: parseFloat(formData.monthlyRevenue),
      };

      onSave(ownerData);
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
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit
                    ? direction === "rtl"
                      ? "تعديل المالك"
                      : "Edit Owner"
                    : direction === "rtl"
                    ? "إضافة مالك جديد"
                    : "Add New Owner"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "املأ البيانات التالية لإضافة مالك جديد"
                    : "Fill in the following information to add a new owner"}
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
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  {direction === "rtl"
                    ? "المعلومات الأساسية"
                    : "Basic Information"}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اسم المالك" : "Owner Name"}
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل اسم المالك"
                        : "Enter owner name"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "البريد الإلكتروني" : "Email"}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "رقم الهاتف" : "Phone Number"}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "العنوان" : "Address"}
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder={
                      direction === "rtl" ? "أدخل العنوان" : "Enter address"
                    }
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                      errors.address ? "border-red-500" : ""
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "تاريخ الانضمام" : "Date Joined"}
                  </label>
                  <Input
                    type="date"
                    value={formData.dateJoined}
                    onChange={(e) =>
                      handleInputChange("dateJoined", e.target.value)
                    }
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Property Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-green-600" />
                  {direction === "rtl"
                    ? "معلومات العقارات"
                    : "Property Information"}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl"
                        ? "عدد المباني"
                        : "Number of Buildings"}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.buildings}
                      onChange={(e) =>
                        handleInputChange("buildings", e.target.value)
                      }
                      className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                        errors.buildings ? "border-red-500" : ""
                      }`}
                    />
                    {errors.buildings && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.buildings}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl" ? "عدد الوحدات" : "Number of Units"}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.units}
                      onChange={(e) =>
                        handleInputChange("units", e.target.value)
                      }
                      className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                        errors.units ? "border-red-500" : ""
                      }`}
                    />
                    {errors.units && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.units}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "التقييم" : "Rating"}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) =>
                      handleInputChange("rating", e.target.value)
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.rating ? "border-red-500" : ""
                    }`}
                  />
                  {errors.rating && (
                    <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl"
                        ? "إجمالي الإيرادات"
                        : "Total Revenue"}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.totalRevenue}
                      onChange={(e) =>
                        handleInputChange("totalRevenue", e.target.value)
                      }
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl"
                        ? "الإيراد الشهري"
                        : "Monthly Revenue"}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.monthlyRevenue}
                      onChange={(e) =>
                        handleInputChange("monthlyRevenue", e.target.value)
                      }
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "صورة المالك" : "Owner Avatar"}
                  </label>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    {avatarPreview && (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {direction === "rtl" ? "رفع صورة" : "Upload Image"}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-6 py-2"
              >
                <X className="h-4 w-4 mr-2" />
                {direction === "rtl" ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="px-6 py-2">
                <Save className="h-4 w-4 mr-2" />
                {isEdit
                  ? direction === "rtl"
                    ? "حفظ التغييرات"
                    : "Save Changes"
                  : direction === "rtl"
                  ? "إضافة المالك"
                  : "Add Owner"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default OwnerForm;
