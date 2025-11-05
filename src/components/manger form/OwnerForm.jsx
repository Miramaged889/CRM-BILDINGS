import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../stores/languageStore";
import { useTranslation } from "react-i18next";
import { isoToDateInput } from "../../utils/dateUtils";
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
  FileText,
  Camera,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

const OwnerForm = ({ owner = null, onSave, onCancel, isEdit = false }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: owner?.full_name || owner?.name || "",
    email: owner?.email || "",
    phone: owner?.phone || "",
    address: owner?.address || "",
    dateJoined: owner?.date_joined || owner?.dateJoined 
      ? isoToDateInput(owner.date_joined || owner.dateJoined)
      : new Date().toISOString().split("T")[0],
    avatar: owner?.avatar || "",
    notes: owner?.notes || "",
    rate: owner?.rate || owner?.rating || "",
  });

  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(owner?.avatar || "");

  // Update form data when owner prop changes
  React.useEffect(() => {
    if (owner) {
      setFormData({
        name: owner.full_name || owner.name || "",
        email: owner.email || "",
        phone: owner.phone || "",
        address: owner.address || "",
        dateJoined: owner.date_joined || owner.dateJoined
          ? isoToDateInput(owner.date_joined || owner.dateJoined)
          : new Date().toISOString().split("T")[0],
        avatar: owner.avatar || "",
        notes: owner.notes || "",
        rate: owner.rate || owner.rating || "",
      });
      setAvatarPreview(owner.avatar || "");
    }
  }, [owner]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const ownerData = {
        ...formData,
        id: owner?.id || Date.now(),
        // Map to API format
        full_name: formData.name,
        rate: parseFloat(formData.rate || '0'),
        rating: parseFloat(formData.rate || '0'), // For backward compatibility
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
        className="w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
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
            </div>
            <button
              onClick={onCancel}
              className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
            >
              <X className="h-6 w-6 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200 flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
                    <Camera className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </div>
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
              {direction === "rtl"
                ? "انقر لتغيير صورة المالك"
                : "Click to change owner avatar"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-2 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center m-2">
                  <div
                    className={`w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center ${
                      direction === "rtl" ? "ml-3" : "mr-3"
                    }`}
                  >
                    <User className="h-4 w-4 text-white" />
                  </div>
                  {direction === "rtl"
                    ? "المعلومات الأساسية"
                    : "Basic Information"}
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className=" text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <User
                      className={`h-4 w-4 text-blue-500 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {direction === "rtl" ? "اسم المالك" : "Owner Name"}
                    <span
                      className={`text-red-500 ${
                        direction === "rtl" ? "mr-1" : "ml-1"
                      }`}
                    >
                      *
                    </span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل اسم المالك"
                        : "Enter owner name"
                    }
                    className={`h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 ${
                      errors.name
                        ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                        : ""
                    }`}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 flex items-center"
                    >
                      <X
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className=" text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Mail
                      className={`h-4 w-4 text-blue-500 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {direction === "rtl" ? "البريد الإلكتروني" : "Email"}
                    <span
                      className={`text-red-500 ${
                        direction === "rtl" ? "mr-1" : "ml-1"
                      }`}
                    >
                      *
                    </span>
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
                    className={`h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 ${
                      errors.email
                        ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                        : ""
                    }`}
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 flex items-center"
                    >
                      <X
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className=" text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Phone
                      className={`h-4 w-4 text-blue-500 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {direction === "rtl" ? "رقم الهاتف" : "Phone Number"}
                    <span
                      className={`text-red-500 ${
                        direction === "rtl" ? "mr-1" : "ml-1"
                      }`}
                    >
                      *
                    </span>
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل رقم الهاتف"
                        : "Enter phone number"
                    }
                    className={`h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 ${
                      errors.phone
                        ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                        : ""
                    }`}
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 flex items-center"
                    >
                      <X
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {errors.phone}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-2 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center m-2">
                  <div
                    className={`w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center ${
                      direction === "rtl" ? "ml-3" : "mr-3"
                    }`}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  {direction === "rtl"
                    ? "معلومات الاتصال"
                    : "Contact Information"}
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className=" text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <MapPin
                      className={`h-4 w-4 text-green-500 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {direction === "rtl" ? "العنوان" : "Address"}
                    <span
                      className={`text-red-500 ${
                        direction === "rtl" ? "mr-1" : "ml-1"
                      }`}
                    >
                      *
                    </span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder={
                      direction === "rtl" ? "أدخل العنوان" : "Enter address"
                    }
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-0 transition-all duration-200 resize-none ${
                      errors.address
                        ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                        : ""
                    }`}
                  />
                  {errors.address && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 flex items-center"
                    >
                      <X
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {errors.address}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className=" text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Building2
                      className={`h-4 w-4 text-green-500 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {direction === "rtl" ? "تاريخ الانضمام" : "Date Joined"}
                  </label>
                  <Input
                    type="date"
                    value={formData.dateJoined}
                    onChange={(e) =>
                      handleInputChange("dateJoined", e.target.value)
                    }
                    className="h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:border-green-500 focus:ring-0 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className=" text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Star
                      className={`h-4 w-4 text-amber-500 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {direction === "rtl" ? "التقييم" : "Rating"} (0-5)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rate}
                    onChange={(e) =>
                      handleInputChange("rate", e.target.value)
                    }
                    placeholder={direction === "rtl" ? "0.0 - 5.0" : "0.0 - 5.0"}
                    className="h-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:border-amber-500 focus:ring-0 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-2 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center m-2">
                <div
                  className={`w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center ${
                    direction === "rtl" ? "ml-3" : "mr-3"
                  }`}
                >
                  <FileText className="h-4 w-4 text-white" />
                </div>
                {direction === "rtl" ? "ملاحظات إضافية" : "Additional Notes"}
              </h3>
            </div>

            <div>
              <label className=" text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <FileText
                  className={`h-4 w-4 text-purple-500 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "ملاحظات حول المالك"
                  : "Notes about the owner"}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder={
                  direction === "rtl"
                    ? "أضف أي ملاحظات إضافية حول المالك..."
                    : "Add any additional notes about the owner..."
                }
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-0 transition-all duration-200 resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                <FileText
                  className={`h-3 w-3 ${direction === "rtl" ? "ml-1" : "mr-1"}`}
                />
                {direction === "rtl"
                  ? "اختياري: يمكن إضافة معلومات إضافية مثل التفضيلات أو التاريخ السابق"
                  : "Optional: You can add additional information like preferences or previous history"}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-8 py-3 h-12 text-base font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <X
                className={`h-5 w-5 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
              />
              {direction === "rtl" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              type="submit"
              className="px-8 py-3 h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Save
                className={`h-5 w-5 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
              />
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
      </motion.div>
    </motion.div>
  );
};

export default OwnerForm;
