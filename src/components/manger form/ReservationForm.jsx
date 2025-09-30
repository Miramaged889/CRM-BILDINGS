import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Users,
  MapPin,
  Building,
  Save,
  X,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

const ReservationForm = ({
  reservation = null,
  onSave,
  onCancel,
  isEdit = false,
}) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    tenantName: reservation?.tenantName || "",
    tenantEmail: reservation?.tenantEmail || "",
    tenantPhone: reservation?.tenantPhone || "",
    unit: reservation?.unit || "",
    building: reservation?.building || "",
    startDate: reservation?.startDate || "",
    endDate: reservation?.endDate || "",
    purpose: reservation?.purpose || "",
    guests: reservation?.guests || "",
    specialRequests: reservation?.specialRequests || "",
    totalCost: reservation?.totalCost || "",
    deposit: reservation?.deposit || "",
    status: reservation?.status || "pending",
    rentalType: reservation?.rentalType || "monthly",
  });

  const [errors, setErrors] = useState({});

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
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenantName.trim()) {
      newErrors.tenantName =
        direction === "rtl" ? "اسم المستأجر مطلوب" : "Tenant name is required";
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

    if (!formData.unit.trim()) {
      newErrors.unit =
        direction === "rtl" ? "الوحدة مطلوبة" : "Unit is required";
    }

    if (!formData.startDate.trim()) {
      newErrors.startDate =
        direction === "rtl" ? "تاريخ البداية مطلوب" : "Start date is required";
    }

    if (!formData.endDate.trim()) {
      newErrors.endDate =
        direction === "rtl" ? "تاريخ النهاية مطلوب" : "End date is required";
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose =
        direction === "rtl" ? "الغرض مطلوب" : "Purpose is required";
    }

    if (!formData.guests || formData.guests <= 0) {
      newErrors.guests =
        direction === "rtl"
          ? "عدد الضيوف مطلوب"
          : "Number of guests is required";
    }

    if (!formData.totalCost || formData.totalCost <= 0) {
      newErrors.totalCost =
        direction === "rtl"
          ? "التكلفة الإجمالية مطلوبة"
          : "Total cost is required";
    }

    if (!formData.deposit || formData.deposit <= 0) {
      newErrors.deposit =
        direction === "rtl" ? "الضمان مطلوب" : "Deposit is required";
    }

    if (!formData.rentalType) {
      newErrors.rentalType =
        direction === "rtl" ? "نوع الإيجار مطلوب" : "Rental type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const reservationData = {
        ...formData,
        id: reservation?.id || Date.now(),
      };

      onSave(reservationData);
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
                      ? "تعديل الحجز"
                      : "Edit Reservation"
                    : direction === "rtl"
                    ? "إضافة حجز جديد"
                    : "Add New Reservation"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "املأ البيانات التالية لإضافة حجز جديد"
                    : "Fill in the following information to add a new reservation"}
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
            {/* Tenant Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <User
                  className={`h-5 w-5 text-blue-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "معلومات المستأجر"
                  : "Tenant Information"}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الاسم الكامل" : "Full Name"} *
                  </label>
                  <Input
                    value={formData.tenantName}
                    onChange={(e) =>
                      handleInputChange("tenantName", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل الاسم الكامل"
                        : "Enter full name"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.tenantName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.tenantName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tenantName}
                    </p>
                  )}
                </div>

                {/* Email */}
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
                    placeholder={
                      direction === "rtl"
                        ? "أدخل البريد الإلكتروني"
                        : "Enter email address"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.tenantEmail ? "border-red-500" : ""
                    }`}
                  />
                  {errors.tenantEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tenantEmail}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "رقم الهاتف" : "Phone Number"} *
                  </label>
                  <Input
                    value={formData.tenantPhone}
                    onChange={(e) =>
                      handleInputChange("tenantPhone", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل رقم الهاتف"
                        : "Enter phone number"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.tenantPhone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.tenantPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tenantPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Calendar
                  className={`h-5 w-5 text-green-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "تفاصيل الحجز" : "Reservation Details"}
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
                        {unit.id} - {unit.building}
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

                {/* Start Date */}
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
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.startDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
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
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.endDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الغرض" : "Purpose"} *
                  </label>
                  <Input
                    value={formData.purpose}
                    onChange={(e) =>
                      handleInputChange("purpose", e.target.value)
                    }
                    placeholder={
                      direction === "rtl" ? "أدخل الغرض" : "Enter purpose"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.purpose ? "border-red-500" : ""
                    }`}
                  />
                  {errors.purpose && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.purpose}
                    </p>
                  )}
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "عدد الضيوف" : "Number of Guests"} *
                  </label>
                  <Input
                    type="number"
                    value={formData.guests}
                    onChange={(e) =>
                      handleInputChange("guests", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل عدد الضيوف"
                        : "Enter number of guests"
                    }
                    min="1"
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.guests ? "border-red-500" : ""
                    }`}
                  />
                  {errors.guests && (
                    <p className="text-red-500 text-sm mt-1">{errors.guests}</p>
                  )}
                </div>

                {/* Rental Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "نوع الإيجار" : "Rental Type"} *
                  </label>
                  <select
                    value={formData.rentalType}
                    onChange={(e) =>
                      handleInputChange("rentalType", e.target.value)
                    }
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.rentalType ? "border-red-500" : ""
                    }`}
                  >
                    <option value="monthly">
                      {direction === "rtl" ? "شهري" : "Monthly"}
                    </option>
                    <option value="daily">
                      {direction === "rtl" ? "يومي" : "Daily"}
                    </option>
                  </select>
                  {errors.rentalType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rentalType}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <DollarSign
                  className={`h-5 w-5 text-purple-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "المعلومات المالية"
                  : "Financial Information"}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? `التكلفة الإجمالية (${
                          formData.rentalType === "daily" ? "يومي" : "شهري"
                        })`
                      : `Total Cost (${
                          formData.rentalType === "daily"
                            ? "per day"
                            : "per month"
                        })`}{" "}
                    *
                  </label>
                  <Input
                    type="number"
                    value={formData.totalCost}
                    onChange={(e) =>
                      handleInputChange("totalCost", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? `أدخل التكلفة الإجمالية ${
                            formData.rentalType === "daily"
                              ? "اليومية"
                              : "الشهرية"
                          }`
                        : `Enter ${
                            formData.rentalType === "daily"
                              ? "daily"
                              : "monthly"
                          } total cost`
                    }
                    min="0"
                    step="0.01"
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.totalCost ? "border-red-500" : ""
                    }`}
                  />
                  {errors.totalCost && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.totalCost}
                    </p>
                  )}
                </div>

                {/* Deposit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الضمان" : "Deposit"} *
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

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الحالة" : "Status"}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="pending">
                      {direction === "rtl" ? "معلق" : "Pending"}
                    </option>
                    <option value="confirmed">
                      {direction === "rtl" ? "مؤكد" : "Confirmed"}
                    </option>
                    <option value="completed">
                      {direction === "rtl" ? "مكتمل" : "Completed"}
                    </option>
                    <option value="cancelled">
                      {direction === "rtl" ? "ملغي" : "Cancelled"}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <MessageSquare
                  className={`h-5 w-5 text-orange-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "الطلبات الخاصة" : "Special Requests"}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {direction === "rtl" ? "الطلبات الخاصة" : "Special Requests"}
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) =>
                    handleInputChange("specialRequests", e.target.value)
                  }
                  placeholder={
                    direction === "rtl"
                      ? "أدخل أي طلبات خاصة..."
                      : "Enter any special requests..."
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
                  ? "إضافة الحجز"
                  : "Add Reservation"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ReservationForm;
