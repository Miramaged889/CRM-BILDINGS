import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../stores/languageStore";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createTenant, updateTenant } from "../../store/slices/tenantsSlice";
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
import api from "../../services/api";
import API_ENDPOINTS from "../../services/apiEndpoints";

const TenantForm = ({ tenant = null, onSave, onCancel, isEdit = false }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.tenants);
  const [availableUnits, setAvailableUnits] = useState([]);

  // Helper function to map API data to form data
  const mapTenantToFormData = (tenantData) => {
    if (!tenantData) {
      return {
        name: "",
        email: "",
        phone: "",
        unit: "",
        building: "",
        leaseStart: new Date().toISOString().split("T")[0],
        leaseEnd: "",
        rentalType: "daily",
        rent: "",
        avatar: "",
        address: "",
        notes: "",
      };
    }

    // Handle API response structure: { id, full_name, email, phone, address, rent_info: { unit_name, rent_start, rent_end, total_amount, ... } }
    const rentInfo = tenantData.rent_info || {};
    return {
      name: tenantData.full_name || tenantData.name || "",
      email: tenantData.email || "",
      phone: tenantData.phone || "",
      unit: rentInfo.unit_name || "",
      building: rentInfo.building_name || "",
      leaseStart: rentInfo.rent_start
        ? rentInfo.rent_start.split("T")[0]
        : new Date().toISOString().split("T")[0],
      leaseEnd: rentInfo.rent_end ? rentInfo.rent_end.split("T")[0] : "",
      rentalType: "daily",
      rent: rentInfo.total_amount || "",
      avatar: tenantData.avatar || "",
      address: tenantData.address || "",
      notes: rentInfo.notes || "",
    };
  };

  const [formData, setFormData] = useState(() => mapTenantToFormData(tenant));

  // Update form when tenant prop changes
  useEffect(() => {
    if (tenant) {
      setFormData(mapTenantToFormData(tenant));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant?.id, tenant?.full_name, tenant?.phone, tenant?.email]);

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

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
    const numericId = isNaN(unitId) ? unitId : parseInt(unitId);
    const selectedUnit = availableUnits.find((unit) => unit.id === numericId);
    if (selectedUnit) {
      setFormData((prev) => ({
        ...prev,
        unit: selectedUnit.id,
        rent: selectedUnit.rent,
      }));
    }
  };

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await api.get(API_ENDPOINTS.UNITS.LIST);
        const list = (data?.results || data || [])
          .filter((u) => (u.status || "").toLowerCase() === "available")
          .map((u) => {
            const labelParts = [
              u.name || `#${u.id}`,
              (u.city_name || u.city) && (u.district_name || u.district)
                ? `${u.city_name || u.city} - ${u.district_name || u.district}`
                : u.city_name || u.city || u.district_name || u.district,
            ].filter(Boolean);
            return {
              id: u.id,
              label: labelParts.join(" - "),
              rent: u.price_per_day || 0,
            };
          });
        setAvailableUnits(list);
      } catch (e) {
        setAvailableUnits([]);
      }
    };
    fetchUnits();
  }, []);

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

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email =
        direction === "rtl"
          ? "البريد الإلكتروني غير صحيح"
          : "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        direction === "rtl" ? "رقم الهاتف مطلوب" : "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Map form data to API payload structure
    const payload = {
      full_name: formData.name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim(),
      address: formData.address.trim() || null,
    };

    try {
      let result;
      if (isEdit && tenant?.id) {
        // Update existing tenant
        result = await dispatch(
          updateTenant({ id: tenant.id, data: payload })
        ).unwrap();
      } else {
        // Create new tenant
        result = await dispatch(createTenant(payload)).unwrap();
      }

      // Call onSave callback with the result
      if (onSave) {
        onSave(result);
      }
    } catch (error) {
      // Handle API errors
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (direction === "rtl"
          ? "حدث خطأ أثناء الحفظ"
          : "An error occurred while saving");

      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));
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
              <Button
                type="submit"
                className="w-full sm:w-auto px-6 py-2"
                disabled={isLoading}
              >
                <Save
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {isLoading
                  ? direction === "rtl"
                    ? "جارٍ الحفظ..."
                    : "Saving..."
                  : isEdit
                  ? direction === "rtl"
                    ? "حفظ التغييرات"
                    : "Save Changes"
                  : direction === "rtl"
                  ? "إضافة المستأجر"
                  : "Add Tenant"}
              </Button>
            </div>
            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">
                  {errors.submit}
                </p>
              </div>
            )}
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TenantForm;
