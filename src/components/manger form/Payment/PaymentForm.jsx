import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchUnits } from "../../../store/slices/unitsSlice";
import {
  User,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  X,
  Save,
  Building,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const PaymentForm = ({ payment, unitId, onSave, onClose, isEdit = false }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { units } = useAppSelector((state) => state.units);

  // Fetch units on mount if not already loaded
  useEffect(() => {
    if (!units || units.length === 0) {
      dispatch(fetchUnits());
    }
  }, [dispatch, units]);

  // Format payment data from API response
  const formatPaymentForForm = (payment) => {
    if (!payment) return {};

    // Handle both old format and new API format
    return {
      unit_id: payment.unit_id || payment.unit || unitId || "",
      category: payment.category || "",
      amount: payment.amount || "",
      payment_method: payment.payment_method || payment.method || "cash",
      payment_date:
        payment.payment_date ||
        payment.date ||
        new Date().toISOString().split("T")[0],
      notes: payment.notes || payment.description || "",
      // Legacy fields for backward compatibility
      tenant: payment.tenant || "",
      unit: payment.unit || "",
      status: payment.status || "paid",
      dueDate: payment.dueDate || "",
      description: payment.description || payment.notes || "",
      reference: payment.reference || "",
    };
  };

  const [formData, setFormData] = useState(() => formatPaymentForForm(payment));

  const [errors, setErrors] = useState({});

  const categories = [
    { value: "wifi", label: direction === "rtl" ? "واي فاي" : "WiFi" },
    {
      value: "electricity",
      label: direction === "rtl" ? "كهرباء" : "Electricity",
    },
    { value: "water", label: direction === "rtl" ? "مياه" : "Water" },
    { value: "cleaning", label: direction === "rtl" ? "تنظيف" : "Cleaning" },
    {
      value: "maintenance",
      label: direction === "rtl" ? "صيانة" : "Maintenance",
    },
    { value: "repair", label: direction === "rtl" ? "إصلاح" : "Repair" },
    { value: "other", label: direction === "rtl" ? "أخرى" : "Other" },
  ];

  const paymentMethods = [
    {
      value: "bank_transfer",
      label: direction === "rtl" ? "تحويل بنكي" : "Bank Transfer",
    },
    { value: "cash", label: direction === "rtl" ? "نقداً" : "Cash" },
    {
      value: "credit_card",
      label: direction === "rtl" ? "بطاقة ائتمان" : "Credit Card",
    },
    {
      value: "online_payment",
      label: direction === "rtl" ? "دفع إلكتروني" : "Online Payment",
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

  // Update unit_id when unitId prop changes
  React.useEffect(() => {
    if (unitId && !formData.unit_id) {
      setFormData((prev) => ({
        ...prev,
        unit_id: unitId,
      }));
    }
  }, [unitId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.unit_id) {
      newErrors.unit_id =
        direction === "rtl" ? "الوحدة مطلوبة" : "Unit is required";
    }

    if (!formData.category) {
      newErrors.category =
        direction === "rtl" ? "الفئة مطلوبة" : "Category is required";
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount =
        direction === "rtl" ? "المبلغ مطلوب" : "Amount is required";
    }

    if (!formData.payment_method) {
      newErrors.payment_method =
        direction === "rtl"
          ? "طريقة الدفع مطلوبة"
          : "Payment method is required";
    }

    // Payment date is optional, but if provided, check it's not in the future
    if (formData.payment_date) {
      const paymentDate = new Date(formData.payment_date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Allow today's date
      if (paymentDate > today) {
        newErrors.payment_date =
          direction === "rtl"
            ? "تاريخ الدفع لا يمكن أن يكون في المستقبل"
            : "Payment date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const paymentData = {
        unit_id: formData.unit_id,
        category: formData.category,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        payment_date:
          formData.payment_date || new Date().toISOString().split("T")[0],
        notes: formData.notes || "",
      };
      onSave(paymentData);
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
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit
                    ? direction === "rtl"
                      ? "تعديل الدفع"
                      : "Edit Payment"
                    : direction === "rtl"
                    ? "إضافة دفعة جديدة"
                    : "Add New Payment"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "إدارة معلومات الدفع"
                    : "Manage payment information"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Unit and Category Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Building
                  className={`h-5 w-5 text-blue-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "معلومات الوحدة والفئة"
                  : "Unit and Category Information"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الوحدة" : "Unit"} *
                  </label>
                  <select
                    value={formData.unit_id}
                    onChange={(e) =>
                      handleInputChange("unit_id", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.unit_id
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر الوحدة" : "Select Unit"}
                    </option>
                    {units &&
                      units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name || unit.unit_name || `Unit ${unit.id}`}{" "}
                          
                        </option>
                      ))}
                  </select>
                  {errors.unit_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.unit_id}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الفئة" : "Category"} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.category
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر الفئة" : "Select Category"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <DollarSign
                  className={`h-5 w-5 text-green-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "معلومات الدفع" : "Payment Information"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "المبلغ" : "Amount"} *
                  </label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    className={errors.amount ? "border-red-500" : ""}
                    placeholder={
                      direction === "rtl" ? "أدخل المبلغ" : "Enter amount"
                    }
                    min="0"
                    step="0.01"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "تاريخ الدفع" : "Payment Date"}
                  </label>
                  <Input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) =>
                      handleInputChange("payment_date", e.target.value)
                    }
                    className={errors.payment_date ? "border-red-500" : ""}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.payment_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.payment_date}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {direction === "rtl"
                      ? "سيتم تعيين التاريخ الحالي تلقائياً إذا لم يتم تحديده"
                      : "Current date will be set automatically if not specified"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "طريقة الدفع" : "Payment Method"} *
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) =>
                      handleInputChange("payment_method", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.payment_method
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {paymentMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  {errors.payment_method && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.payment_method}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Additional Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText
                  className={`h-5 w-5 text-purple-600 ${
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
                    {direction === "rtl" ? "ملاحظات" : "Notes"}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={
                      direction === "rtl"
                        ? "أدخل ملاحظات (اختياري)"
                        : "Enter notes (optional)"
                    }
                  />
                </div>
              </div>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 py-2"
              >
                <X
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="px-6 py-2">
                <Save
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {isEdit
                  ? direction === "rtl"
                    ? "حفظ التغييرات"
                    : "Save Changes"
                  : direction === "rtl"
                  ? "إضافة الدفعة"
                  : "Add Payment"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PaymentForm;
