import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../stores/languageStore";
import { useTranslation } from "react-i18next";
import { Package, DollarSign, Save, X, TrendingUp } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

const normalizeRentEndQuantity = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  return String(value);
};

const StockForm = ({
  stock = null,
  onSave,
  onCancel,
  isEdit = false,
  isLoading = false,
}) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: stock?.name || "",
    category: stock?.category || "",
    quantity: stock?.quantity || "",
    minQuantity: stock?.lower_quantity || stock?.minQuantity || "",
    unit: stock?.unit_of_measure || stock?.unit || "",
    unitPrice: stock?.unit_price || stock?.unitPrice || "",
    supplier: stock?.supplier_name || stock?.supplier || "",
    description: stock?.description || "",
    autoDeduct: Boolean(
      stock?.auto_deduct_on_rent_end ?? stock?.autoDeduct ?? false
    ),
    rentEndQuantity: normalizeRentEndQuantity(
      stock?.rent_end_quantity ?? stock?.rentEndQuantity ?? ""
    ),
  });

  const [errors, setErrors] = useState({});

  // Update form data when stock prop changes
  React.useEffect(() => {
    if (stock) {
      setFormData({
        name: stock.name || "",
        category: stock.category || "",
        quantity: stock.quantity || "",
        minQuantity: stock.lower_quantity || stock.minQuantity || "",
        unit: stock.unit_of_measure || stock.unit || "",
        unitPrice: stock.unit_price || stock.unitPrice || "",
        supplier: stock.supplier_name || stock.supplier || "",
        description: stock.description || "",
        autoDeduct: Boolean(
          stock.auto_deduct_on_rent_end ?? stock.autoDeduct ?? false
        ),
        rentEndQuantity: normalizeRentEndQuantity(
          stock.rent_end_quantity ?? stock.rentEndQuantity ?? ""
        ),
      });
    }
  }, [stock]);

  const categories = [
    { value: "Maintenance", labelKey: "stock.maintenance" },
    { value: "Electrical", labelKey: "stock.electrical" },
    { value: "Plumbing", labelKey: "stock.plumbing" },
    { value: "Security", labelKey: "stock.security" },
    { value: "Cleaning", labelKey: "stock.cleaning" },
    { value: "Furniture", labelKey: "stock.furniture" },
  ];

  const units = [
    { value: "Pieces", labelKey: "stock.pieces" },
    { value: "Boxes", labelKey: "stock.boxes" },
    { value: "Gallons", labelKey: "stock.gallons" },
    { value: "Liters", labelKey: "stock.liters" },
    { value: "Kits", labelKey: "stock.kits" },
    { value: "Sets", labelKey: "stock.sets" },
    { value: "Meters", labelKey: "stock.meters" },
    { value: "Feet", labelKey: "stock.feet" },
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

  const handleAutoDeductChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      autoDeduct: checked,
      rentEndQuantity: checked ? prev.rentEndQuantity || "" : "",
    }));

    if (!checked && errors.rentEndQuantity) {
      setErrors((prev) => ({ ...prev, rentEndQuantity: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("stock.errors.nameRequired");
    }

    if (!formData.category.trim()) {
      newErrors.category = t("stock.errors.categoryRequired");
    }

    if (!formData.quantity || formData.quantity < 0) {
      newErrors.quantity = t("stock.errors.quantityRequired");
    }

    if (!formData.minQuantity || formData.minQuantity < 0) {
      newErrors.minQuantity = t("stock.errors.minimumQuantityRequired");
    }

    if (!formData.unit.trim()) {
      newErrors.unit = t("stock.errors.unitRequired");
    }

    if (!formData.unitPrice || formData.unitPrice <= 0) {
      newErrors.unitPrice = t("stock.errors.unitPriceRequired");
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = t("stock.errors.supplierRequired");
    }

    if (formData.autoDeduct) {
      if (!formData.rentEndQuantity || Number(formData.rentEndQuantity) <= 0) {
        newErrors.rentEndQuantity = t("stock.errors.rentEndQuantityRequired");
      }
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
        // Map to API format
        lower_quantity: formData.minQuantity,
        unit_of_measure: formData.unit,
        unit_price: formData.unitPrice,
        supplier_name: formData.supplier,
        auto_deduct_on_rent_end: Boolean(formData.autoDeduct),
        rent_end_quantity: formData.autoDeduct
          ? Number(formData.rentEndQuantity)
          : null,
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
                  {t(isEdit ? "stock.editItem" : "stock.addItem")}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {t("stock.formSubtitle")}
                </p>
              </div>
              <button
                onClick={onCancel}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors self-start sm:self-auto"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {isLoading && (
              <div className="mt-3 text-sm text-primary-600 dark:text-primary-400">
                {t("common.loading")}
              </div>
            )}
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
                {t("stock.basicInfo")}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("stock.itemName")} *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t("stock.enterItemName")}
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
                    {t("stock.category")} *
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
                    <option value="">{t("stock.selectCategory")}</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {t(category.labelKey)}
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
                    {t("stock.description")}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder={t("stock.enterDescription")}
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
                {t("stock.quantityInfo")}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("stock.currentQuantity")} *
                  </label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                    placeholder={t("stock.enterQuantity")}
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
                    {t("stock.minimumQuantity")} *
                  </label>
                  <Input
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      handleInputChange("minQuantity", e.target.value)
                    }
                    placeholder={t("stock.enterMinimumQuantity")}
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
                    {t("stock.unit")} *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.unit ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">{t("stock.selectUnit")}</option>
                    {units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {t(unit.labelKey)}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <label className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={formData.autoDeduct}
                      onChange={(e) => handleAutoDeductChange(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span
                      className={`${direction === "rtl" ? "mr-2" : "ml-2"}`}
                    >
                      {t("stock.autoDeductOnRentEnd")}
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("stock.autoDeductDescription")}
                  </p>
                </div>

                {formData.autoDeduct && (
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("stock.rentEndQuantity")} *
                    </label>
                    <Input
                      type="number"
                      value={formData.rentEndQuantity}
                      onChange={(e) =>
                        handleInputChange("rentEndQuantity", e.target.value)
                      }
                      placeholder={t("stock.enterRentEndQuantity")}
                      min="1"
                      className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                        errors.rentEndQuantity ? "border-red-500" : ""
                      }`}
                    />
                    {errors.rentEndQuantity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.rentEndQuantity}
                      </p>
                    )}
                  </div>
                )}
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
                {t("stock.financialInfo")}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("stock.unitPrice")} *
                  </label>
                  <Input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      handleInputChange("unitPrice", e.target.value)
                    }
                    placeholder={t("stock.enterUnitPrice")}
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
                    {t("stock.supplier")} *
                  </label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) =>
                      handleInputChange("supplier", e.target.value)
                    }
                    placeholder={t("stock.enterSupplier")}
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

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-2"
                disabled={isLoading}
              >
                <X
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto px-6 py-2"
                disabled={isLoading}
              >
                <Save
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t(isEdit ? "common.save" : "stock.addItem")}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StockForm;
