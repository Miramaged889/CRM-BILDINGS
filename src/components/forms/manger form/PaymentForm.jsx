import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
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

const PaymentForm = ({ payment, onSave, onClose, isEdit = false }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    tenant: payment?.tenant || "",
    unit: payment?.unit || "",
    amount: payment?.amount || "",
    date: payment?.date || "",
    method: payment?.method || "Bank Transfer",
    status: payment?.status || "paid",
    dueDate: payment?.dueDate || "",
    description: payment?.description || "",
    reference: payment?.reference || "",
  });

  const [errors, setErrors] = useState({});

  // Mock data for dropdowns
  const availableTenants = [
    { id: "john-smith", name: "John Smith", unit: "A-101" },
    { id: "sarah-johnson", name: "Sarah Johnson", unit: "B-205" },
    { id: "mike-davis", name: "Mike Davis", unit: "C-301" },
    { id: "emily-brown", name: "Emily Brown", unit: "D-102" },
    { id: "david-wilson", name: "David Wilson", unit: "A-203" },
    { id: "ahmed-ali", name: "Ahmed Ali", unit: "E-401" },
    { id: "fatima-hassan", name: "Fatima Hassan", unit: "F-502" },
  ];

  const paymentMethods = [
    {
      value: "Bank Transfer",
      label: direction === "rtl" ? "تحويل بنكي" : "Bank Transfer",
    },
    { value: "Cash", label: direction === "rtl" ? "نقداً" : "Cash" },
    {
      value: "Credit Card",
      label: direction === "rtl" ? "بطاقة ائتمان" : "Credit Card",
    },
    { value: "Check", label: direction === "rtl" ? "شيك" : "Check" },
    {
      value: "Online Payment",
      label: direction === "rtl" ? "دفع إلكتروني" : "Online Payment",
    },
  ];

  const statusOptions = [
    { value: "paid", label: direction === "rtl" ? "مدفوع" : "Paid" },
    { value: "pending", label: direction === "rtl" ? "معلق" : "Pending" },
    { value: "overdue", label: direction === "rtl" ? "متأخر" : "Overdue" },
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

  const handleTenantChange = (tenantName) => {
    const selectedTenant = availableTenants.find(
      (tenant) => tenant.name === tenantName
    );
    setFormData((prev) => ({
      ...prev,
      tenant: selectedTenant?.name || "",
      unit: selectedTenant?.unit || "",
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

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount =
        direction === "rtl" ? "المبلغ مطلوب" : "Amount is required";
    }

    if (!formData.date) {
      newErrors.date =
        direction === "rtl" ? "تاريخ الدفع مطلوب" : "Payment date is required";
    }

    if (!formData.method.trim()) {
      newErrors.method =
        direction === "rtl"
          ? "طريقة الدفع مطلوبة"
          : "Payment method is required";
    }

    if (!formData.status.trim()) {
      newErrors.status =
        direction === "rtl"
          ? "حالة الدفع مطلوبة"
          : "Payment status is required";
    }

    // Check if payment date is not in the future
    if (formData.date) {
      const paymentDate = new Date(formData.date);
      const today = new Date();
      if (paymentDate > today) {
        newErrors.date =
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
        ...formData,
        amount: parseFloat(formData.amount),
        id: payment?.id || Date.now(),
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
            {/* Tenant Information */}
            <Card className="p-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اسم المستأجر" : "Tenant Name"} *
                  </label>
                  <select
                    value={formData.tenant}
                    onChange={(e) => handleTenantChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.tenant
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر المستأجر" : "Select Tenant"}
                    </option>
                    {availableTenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.name}>
                        {tenant.name} - {tenant.unit}
                      </option>
                    ))}
                  </select>
                  {errors.tenant && (
                    <p className="text-red-500 text-sm mt-1">{errors.tenant}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "رقم الوحدة" : "Unit Number"} *
                  </label>
                  <Input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                    className={errors.unit ? "border-red-500" : ""}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل رقم الوحدة"
                        : "Enter unit number"
                    }
                    readOnly
                  />
                  {errors.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
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
                    {direction === "rtl" ? "تاريخ الدفع" : "Payment Date"} *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={errors.date ? "border-red-500" : ""}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "طريقة الدفع" : "Payment Method"} *
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) =>
                      handleInputChange("method", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.method
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
                  {errors.method && (
                    <p className="text-red-500 text-sm mt-1">{errors.method}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "حالة الدفع" : "Payment Status"} *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.status
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">{errors.status}</p>
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
                    {direction === "rtl" ? "تاريخ الاستحقاق" : "Due Date"}
                  </label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل تاريخ الاستحقاق"
                        : "Enter due date"
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "رقم المرجع" : "Reference Number"}
                  </label>
                  <Input
                    type="text"
                    value={formData.reference}
                    onChange={(e) =>
                      handleInputChange("reference", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل رقم المرجع"
                        : "Enter reference number"
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "وصف الدفع" : "Payment Description"}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={
                      direction === "rtl"
                        ? "أدخل وصف الدفع"
                        : "Enter payment description"
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
