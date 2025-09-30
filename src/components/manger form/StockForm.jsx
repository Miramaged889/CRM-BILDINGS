import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  Package,
  Building,
  DollarSign,
  Calendar,
  MapPin,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

const StockForm = ({ stock = null, onSave, onCancel, isEdit = false }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: stock?.name || "",
    category: stock?.category || "",
    quantity: stock?.quantity || "",
    minQuantity: stock?.minQuantity || "",
    unit: stock?.unit || "",
    unitPrice: stock?.unitPrice || "",
    supplier: stock?.supplier || "",
    location: stock?.location || "",
    description: stock?.description || "",
    lastRestocked:
      stock?.lastRestocked || new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: "maintenance", label: "Maintenance" },
    { value: "electrical", label: "Electrical" },
    { value: "plumbing", label: "Plumbing" },
    { value: "security", label: "Security" },
    { value: "cleaning", label: "Cleaning" },
    { value: "furniture", label: "Furniture" },
  ];

  const units = [
    { value: "pieces", label: "Pieces" },
    { value: "boxes", label: "Boxes" },
    { value: "gallons", label: "Gallons" },
    { value: "liters", label: "Liters" },
    { value: "kits", label: "Kits" },
    { value: "sets", label: "Sets" },
    { value: "meters", label: "Meters" },
    { value: "feet", label: "Feet" },
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        direction === "rtl" ? "اسم العنصر مطلوب" : "Item name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category =
        direction === "rtl" ? "الفئة مطلوبة" : "Category is required";
    }

    if (!formData.quantity || formData.quantity < 0) {
      newErrors.quantity =
        direction === "rtl" ? "الكمية مطلوبة" : "Quantity is required";
    }

    if (!formData.minQuantity || formData.minQuantity < 0) {
      newErrors.minQuantity =
        direction === "rtl"
          ? "الحد الأدنى للكمية مطلوب"
          : "Minimum quantity is required";
    }

    if (!formData.unit.trim()) {
      newErrors.unit =
        direction === "rtl" ? "الوحدة مطلوبة" : "Unit is required";
    }

    if (!formData.unitPrice || formData.unitPrice <= 0) {
      newErrors.unitPrice =
        direction === "rtl" ? "سعر الوحدة مطلوب" : "Unit price is required";
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier =
        direction === "rtl" ? "المورد مطلوب" : "Supplier is required";
    }

    if (!formData.location.trim()) {
      newErrors.location =
        direction === "rtl" ? "الموقع مطلوب" : "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const stockData = {
        ...formData,
        id: stock?.id || Date.now(),
        status:
          formData.quantity > formData.minQuantity
            ? "in_stock"
            : formData.quantity > 0
            ? "low_stock"
            : "out_of_stock",
      };

      onSave(stockData);
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
                      ? "تعديل عنصر المخزون"
                      : "Edit Stock Item"
                    : direction === "rtl"
                    ? "إضافة عنصر مخزون جديد"
                    : "Add New Stock Item"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "املأ البيانات التالية لإضافة عنصر مخزون جديد"
                    : "Fill in the following information to add a new stock item"}
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
                <Package
                  className={`h-5 w-5 text-blue-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "المعلومات الأساسية"
                  : "Basic Information"}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اسم العنصر" : "Item Name"} *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل اسم العنصر"
                        : "Enter item name"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الفئة" : "Category"} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.category ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر الفئة" : "Select Category"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {direction === "rtl"
                          ? t(`stock.${category.value}`)
                          : category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الوصف" : "Description"}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل وصف العنصر"
                        : "Enter item description"
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Quantity Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <TrendingUp
                  className={`h-5 w-5 text-green-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "معلومات الكمية"
                  : "Quantity Information"}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "الكمية الحالية"
                      : "Current Quantity"}{" "}
                    *
                  </label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                    placeholder={
                      direction === "rtl" ? "أدخل الكمية" : "Enter quantity"
                    }
                    min="0"
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.quantity ? "border-red-500" : ""
                    }`}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.quantity}
                    </p>
                  )}
                </div>

                {/* Minimum Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الحد الأدنى" : "Minimum Quantity"} *
                  </label>
                  <Input
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      handleInputChange("minQuantity", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل الحد الأدنى"
                        : "Enter minimum quantity"
                    }
                    min="0"
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.minQuantity ? "border-red-500" : ""
                    }`}
                  />
                  {errors.minQuantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.minQuantity}
                    </p>
                  )}
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الوحدة" : "Unit"} *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.unit ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر الوحدة" : "Select Unit"}
                    </option>
                    {units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {direction === "rtl"
                          ? t(`stock.${unit.value}`)
                          : unit.label}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
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
                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "سعر الوحدة" : "Unit Price"} *
                  </label>
                  <Input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      handleInputChange("unitPrice", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل سعر الوحدة"
                        : "Enter unit price"
                    }
                    min="0"
                    step="0.01"
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.unitPrice ? "border-red-500" : ""
                    }`}
                  />
                  {errors.unitPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.unitPrice}
                    </p>
                  )}
                </div>

                {/* Supplier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "المورد" : "Supplier"} *
                  </label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) =>
                      handleInputChange("supplier", e.target.value)
                    }
                    placeholder={
                      direction === "rtl"
                        ? "أدخل اسم المورد"
                        : "Enter supplier name"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.supplier ? "border-red-500" : ""
                    }`}
                  />
                  {errors.supplier && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.supplier}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <MapPin
                  className={`h-5 w-5 text-orange-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "معلومات الموقع"
                  : "Location Information"}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الموقع" : "Location"} *
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder={
                      direction === "rtl" ? "أدخل الموقع" : "Enter location"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.location ? "border-red-500" : ""
                    }`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Last Restocked */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "آخر إعادة تخزين" : "Last Restocked"}
                  </label>
                  <Input
                    type="date"
                    value={formData.lastRestocked}
                    onChange={(e) =>
                      handleInputChange("lastRestocked", e.target.value)
                    }
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
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
                  ? "إضافة العنصر"
                  : "Add Item"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StockForm;
