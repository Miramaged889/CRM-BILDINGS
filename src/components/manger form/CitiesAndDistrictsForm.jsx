import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../stores/languageStore";
import { MapPin, Save, X, Map } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

const CitiesAndDistrictsForm = ({ 
  type = "city", // "city" or "district"
  item = null, 
  onSave, 
  onCancel, 
  isEdit = false,
  cities = [] // For districts form
}) => {
  const { direction } = useLanguageStore();

  const [formData, setFormData] = useState({
    name: item?.name || "",
    city: item?.city || item?.city_id || "",
  });

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        direction === "rtl"
          ? type === "city" ? "اسم المدينة مطلوب" : "اسم الحي مطلوب"
          : type === "city" ? "City name is required" : "District name is required";
    }

    if (type === "district" && !formData.city) {
      newErrors.city =
        direction === "rtl" ? "اختر المدينة" : "Select city";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const data = type === "city" 
        ? { name: formData.name }
        : { name: formData.name, city: formData.city };
      
      onSave(data);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              {type === "city" ? (
                <MapPin className="h-5 w-5 text-white" />
              ) : (
                <Map className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEdit
                  ? direction === "rtl"
                    ? type === "city" ? "تعديل المدينة" : "تعديل الحي"
                    : type === "city" ? "Edit City" : "Edit District"
                  : direction === "rtl"
                  ? type === "city" ? "إضافة مدينة جديدة" : "إضافة حي جديد"
                  : type === "city" ? "Add New City" : "Add New District"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {direction === "rtl"
                  ? "املأ التفاصيل أدناه"
                  : "Fill in the details below"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {direction === "rtl" 
                ? (type === "city" ? "اسم المدينة" : "اسم الحي")
                : (type === "city" ? "City Name" : "District Name")}{" "}
              *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={direction === "rtl" 
                ? (type === "city" ? "مثال: القاهرة" : "مثال: وسط البلد")
                : (type === "city" ? "e.g. Cairo" : "e.g. Downtown")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* City Field (only for districts) */}
          {type === "district" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "المدينة" : "City"} *
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                  errors.city
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">
                  {direction === "rtl" ? "اختر المدينة" : "Select City"}
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onCancel}>
              {direction === "rtl" ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="submit">
              <Save className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
              {isEdit
                ? direction === "rtl"
                  ? "حفظ التغييرات"
                  : "Save Changes"
                : direction === "rtl"
                ? type === "city" ? "إضافة المدينة" : "إضافة الحي"
                : type === "city" ? "Add City" : "Add District"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CitiesAndDistrictsForm;

