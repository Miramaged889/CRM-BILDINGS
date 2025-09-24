import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  User,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const ContractForm = ({
  contract = null,
  onSave,
  onCancel,
  isEdit = false,
}) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    owner: contract?.owner || "",
    ownerId: contract?.ownerId || "",
    building: contract?.building || "",
    buildingId: contract?.buildingId || "",
    startDate: contract?.start || "",
    endDate: contract?.end || "",
    monthlyFee: contract?.monthlyFee || "",
    totalUnits: contract?.totalUnits || "",
    occupiedUnits: contract?.occupiedUnits || "",
    contractType: contract?.type || "management",
    status: contract?.status || "active",
    notes: contract?.notes || "",
  });

  // Mock owners data - in real app, this would come from API
  const availableOwners = [
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@example.com",
      phone: "+201234567890",
      buildings: ["Sunset Tower", "Ocean View"],
    },
    {
      id: 2,
      name: "Mona Ali",
      email: "mona.ali@example.com",
      phone: "+201112223334",
      buildings: ["Palm Residency", "Garden Plaza"],
    },
    {
      id: 3,
      name: "Omar Khalil",
      email: "omar.khalil@example.com",
      phone: "+201998887766",
      buildings: ["Nile Heights", "City Center"],
    },
    {
      id: 4,
      name: "Sarah Mohamed",
      email: "sarah.mohamed@example.com",
      phone: "+201555666777",
      buildings: ["Royal Tower", "Business District"],
    },
    {
      id: 5,
      name: "Mohamed Hassan",
      email: "mohamed.hassan@example.com",
      phone: "+201888999000",
      buildings: ["Sunset Tower", "Marina View"],
    },
  ];

  // Mock buildings data
  const availableBuildings = [
    { id: 1, name: "Sunset Tower", totalUnits: 25, occupiedUnits: 20 },
    { id: 2, name: "Palm Residency", totalUnits: 30, occupiedUnits: 28 },
    { id: 3, name: "Nile Heights", totalUnits: 20, occupiedUnits: 18 },
    { id: 4, name: "Ocean View", totalUnits: 35, occupiedUnits: 32 },
    { id: 5, name: "Garden Plaza", totalUnits: 40, occupiedUnits: 38 },
  ];

  const [errors, setErrors] = useState({});

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

  const handleOwnerChange = (ownerId) => {
    const selectedOwner = availableOwners.find(
      (owner) => owner.id === parseInt(ownerId)
    );
    if (selectedOwner) {
      setFormData((prev) => ({
        ...prev,
        owner: selectedOwner.name,
        ownerId: selectedOwner.id,
      }));
    }
  };

  const handleBuildingChange = (buildingId) => {
    const selectedBuilding = availableBuildings.find(
      (building) => building.id === parseInt(buildingId)
    );
    if (selectedBuilding) {
      setFormData((prev) => ({
        ...prev,
        building: selectedBuilding.name,
        buildingId: selectedBuilding.id,
        totalUnits: selectedBuilding.totalUnits,
        occupiedUnits: selectedBuilding.occupiedUnits,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.owner.trim()) {
      newErrors.owner =
        direction === "rtl" ? "اسم المالك مطلوب" : "Owner name is required";
    }

    if (!formData.building.trim()) {
      newErrors.building =
        direction === "rtl" ? "اسم المبنى مطلوب" : "Building name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate =
        direction === "rtl" ? "تاريخ البداية مطلوب" : "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate =
        direction === "rtl" ? "تاريخ النهاية مطلوب" : "End date is required";
    }

    if (!formData.monthlyFee || formData.monthlyFee <= 0) {
      newErrors.monthlyFee =
        direction === "rtl"
          ? "الرسوم الشهرية مطلوبة"
          : "Monthly fee is required";
    }

    if (!formData.totalUnits || formData.totalUnits <= 0) {
      newErrors.totalUnits =
        direction === "rtl" ? "عدد الوحدات مطلوب" : "Total units is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate =
        direction === "rtl"
          ? "تاريخ النهاية يجب أن يكون بعد تاريخ البداية"
          : "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const contractData = {
        ...formData,
        id: contract?.id || Date.now(),
        monthlyFee: parseFloat(formData.monthlyFee),
        totalUnits: parseInt(formData.totalUnits),
        occupiedUnits: parseInt(formData.occupiedUnits),
      };

      onSave(contractData);
    }
  };

  const contractTypes = [
    {
      value: "management",
      label: direction === "rtl" ? "إدارة" : "Management",
    },
    {
      value: "maintenance",
      label: direction === "rtl" ? "صيانة" : "Maintenance",
    },
    { value: "cleaning", label: direction === "rtl" ? "تنظيف" : "Cleaning" },
    { value: "security", label: direction === "rtl" ? "أمن" : "Security" },
  ];

  const statusOptions = [
    { value: "active", label: direction === "rtl" ? "نشط" : "Active" },
    { value: "pending", label: direction === "rtl" ? "معلق" : "Pending" },
    { value: "expired", label: direction === "rtl" ? "منتهي" : "Expired" },
  ];

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
                      ? "تعديل العقد"
                      : "Edit Contract"
                    : direction === "rtl"
                    ? "إضافة عقد جديد"
                    : "Add New Contract"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "املأ البيانات التالية لإنشاء عقد إيجار جديد"
                    : "Fill in the following information to create a new rental contract"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <User
                    className={`h-5 w-5 text-blue-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "معلومات المالك" : "Owner Information"}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اسم المالك" : "Owner Name"}
                  </label>
                  <select
                    value={formData.ownerId || ""}
                    onChange={(e) => handleOwnerChange(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.owner ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر المالك" : "Select Owner"}
                    </option>
                    {availableOwners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} - {owner.buildings.join(", ")}
                      </option>
                    ))}
                  </select>
                  {errors.owner && (
                    <p className="text-red-500 text-sm mt-1">{errors.owner}</p>
                  )}
                </div>
              </div>

              {/* Building Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Building2
                    className={`h-5 w-5 text-green-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl"
                    ? "معلومات المبنى"
                    : "Building Information"}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اسم المبنى" : "Building Name"}
                  </label>
                  <select
                    value={formData.buildingId || ""}
                    onChange={(e) => handleBuildingChange(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.building ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر المبنى" : "Select Building"}
                    </option>
                    {availableBuildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name} ({building.totalUnits} units)
                      </option>
                    ))}
                  </select>
                  {errors.building && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.building}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl" ? "إجمالي الوحدات" : "Total Units"}
                    </label>
                    <Input
                      type="number"
                      value={formData.totalUnits}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl"
                        ? "الوحدات المشغولة"
                        : "Occupied Units"}
                    </label>
                    <Input
                      type="number"
                      value={formData.occupiedUnits}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FileText
                  className={`h-5 w-5 text-purple-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "تفاصيل العقد" : "Contract Details"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "تاريخ البداية" : "Start Date"}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "تاريخ النهاية" : "End Date"}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "نوع العقد" : "Contract Type"}
                  </label>
                  <select
                    value={formData.contractType}
                    onChange={(e) =>
                      handleInputChange("contractType", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {contractTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "حالة العقد" : "Contract Status"}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <DollarSign
                  className={`h-5 w-5 text-yellow-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl"
                  ? "المعلومات المالية"
                  : "Financial Information"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الرسوم الشهرية" : "Monthly Fee"}
                  </label>
                  <div className="relative">
                    <DollarSign
                      className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
                        direction === "rtl" ? "right-3" : "left-3"
                      }`}
                    />
                    <Input
                      type="number"
                      value={formData.monthlyFee}
                      onChange={(e) =>
                        handleInputChange("monthlyFee", e.target.value)
                      }
                      placeholder="0.00"
                      className={`${
                        direction === "rtl" ? "pr-10" : "pl-10"
                      } bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                        errors.monthlyFee ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.monthlyFee && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.monthlyFee}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "عدد الوحدات الإجمالي"
                      : "Total Units"}
                  </label>
                  <div className="relative">
                    <Building2
                      className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
                        direction === "rtl" ? "right-3" : "left-3"
                      }`}
                    />
                    <Input
                      type="number"
                      value={formData.totalUnits}
                      onChange={(e) =>
                        handleInputChange("totalUnits", e.target.value)
                      }
                      placeholder="0"
                      className={`${
                        direction === "rtl" ? "pr-10" : "pl-10"
                      } bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                        errors.totalUnits ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.totalUnits && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.totalUnits}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "ملاحظات إضافية" : "Additional Notes"}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder={
                  direction === "rtl"
                    ? "أي ملاحظات إضافية..."
                    : "Any additional notes..."
                }
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            {/* Form Actions */}
            <div
              className={`flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 ${
                direction === "rtl" ? "justify-start" : "justify-end"
              }`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
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
                  ? "إنشاء العقد"
                  : "Create Contract"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ContractForm;
