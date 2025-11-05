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
import { createRent, deleteRent } from "../../services/api";
import api from "../../services/api";
import API_ENDPOINTS from "../../services/apiEndpoints";
import toast from "react-hot-toast";

const ReservationForm = ({
  reservation = null,
  unit = null,
  onSave,
  onCancel,
  isEdit = false,
}) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    unit: reservation?.unit ? String(reservation.unit) : (unit ? String(unit) : ""),
    tenant: reservation?.tenant ? String(reservation.tenant) : "",
    rent_start: reservation?.rent_start || "",
    rent_end: reservation?.rent_end || "",
    total_amount: reservation?.total_amount ? String(reservation.total_amount) : "",
    payment_status: reservation?.payment_status || "paid",
    payment_method: reservation?.payment_method || "cash",
    payment_date: reservation?.payment_date ? (reservation.payment_date.slice ? reservation.payment_date.slice(0, 10) : reservation.payment_date) : "",
    notes: reservation?.notes || "",
    attachment: null,
    // Additional fields that might be used in the form
    totalCost: reservation?.totalCost ? String(reservation.totalCost) : "",
    rentalType: reservation?.rentalType || "monthly",
    status: reservation?.status || "pending",
  });

  const [errors, setErrors] = useState({});

  // Units/Tenants lists for selects
  const [availableUnits, setAvailableUnits] = useState([]);
  const [availableTenants, setAvailableTenants] = useState([]);

  React.useEffect(() => {
    const fetchLists = async () => {
      try {
        const [unitsData, tenantsData] = await Promise.all([
          api.get(API_ENDPOINTS.UNITS.LIST),
          api.get(API_ENDPOINTS.TENANTS.LIST),
        ]);

        const units = (unitsData?.results || unitsData || []).map((u) => {
          const labelParts = [
            u.name || `#${u.id}`,
            (u.city_name || u.city) && (u.district_name || u.district)
              ? `${u.city_name || u.city} - ${u.district_name || u.district}`
              : u.city_name || u.city || u.district_name || u.district,
          ].filter(Boolean);
          return { id: u.id, label: labelParts.join(" - ") };
        });
        setAvailableUnits(units);

        const tenants = (tenantsData?.results || tenantsData || []).map((t) => ({
          id: t.id,
          label: t.full_name || t.name || t.phone || `#${t.id}`,
        }));
        setAvailableTenants(tenants);
      } catch (e) {
        setAvailableUnits([]);
        setAvailableTenants([]);
      }
    };
    fetchLists();
  }, []);

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
    setFormData((prev) => ({
      ...prev,
      unit: unitId,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!String(formData.unit).trim()) {
      newErrors.unit =
        direction === "rtl" ? "الوحدة مطلوبة" : "Unit is required";
    }

    if (!String(formData.tenant).trim()) {
      newErrors.tenant =
        direction === "rtl" ? "المستأجر مطلوب" : "Tenant is required";
    }

    if (!String(formData.rent_start).trim()) {
      newErrors.rent_start =
        direction === "rtl" ? "تاريخ البداية مطلوب" : "Start date is required";
    }

    if (!String(formData.rent_end).trim()) {
      newErrors.rent_end =
        direction === "rtl" ? "تاريخ النهاية مطلوب" : "End date is required";
    }

    if (!formData.total_amount || Number(formData.total_amount) <= 0) {
      newErrors.total_amount =
        direction === "rtl" ? "المبلغ الإجمالي مطلوب" : "Total amount is required";
    }

    if (!String(formData.payment_status).trim()) {
      newErrors.payment_status =
        direction === "rtl" ? "حالة الدفع مطلوبة" : "Payment status is required";
    }

    if (!String(formData.payment_method).trim()) {
      newErrors.payment_method =
        direction === "rtl" ? "طريقة الدفع مطلوبة" : "Payment method is required";
    }

    if (!String(formData.payment_date).trim()) {
      newErrors.payment_date =
        direction === "rtl" ? "تاريخ الدفع مطلوب" : "Payment date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const fd = new FormData();
      fd.append("unit", String(formData.unit));
      fd.append("tenant", String(formData.tenant));
      fd.append("rent_start", formData.rent_start);
      fd.append("rent_end", formData.rent_end);
      fd.append("total_amount", String(formData.total_amount));
      fd.append("payment_status", formData.payment_status);
      fd.append("payment_method", formData.payment_method);
      fd.append("payment_date", formData.payment_date);
      if (formData.notes) fd.append("notes", formData.notes);
      if (formData.attachment) fd.append("attachment", formData.attachment);

      try {
        const created = await createRent(fd);
        toast.success(
          direction === "rtl"
            ? "تم إنشاء الإيجار بنجاح"
            : "Rent created successfully"
        );
        // Dispatch event to update Calendar
        window.dispatchEvent(new Event("rent-created"));
        onSave?.(created);
      } catch (err) {
        console.error("Error creating rent:", err);
        const apiErrors = err?.response?.data || err?.data || {};
        const mapped = {};
        Object.keys(apiErrors).forEach((k) => {
          const errorValue = apiErrors[k];
          if (Array.isArray(errorValue)) {
            mapped[k] = errorValue.join(" ");
          } else if (typeof errorValue === "object") {
            mapped[k] = JSON.stringify(errorValue);
          } else {
            mapped[k] = String(errorValue);
          }
        });
        setErrors((prev) => ({ ...prev, ...mapped }));
        
        // Show specific error messages
        let errorMessage = "";
        if (apiErrors.unit && Array.isArray(apiErrors.unit)) {
          errorMessage = apiErrors.unit.join(" ");
        } else if (apiErrors.message) {
          errorMessage = Array.isArray(apiErrors.message) 
            ? apiErrors.message.join(" ") 
            : apiErrors.message;
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.message) {
          errorMessage = err.message;
        } else {
          errorMessage = direction === "rtl" 
            ? "فشل إنشاء الإيجار. يرجى التحقق من البيانات." 
            : "Failed to create rent. Please check the data.";
        }
        
        toast.error(errorMessage);
      }
    }
  };

  const handleDelete = async () => {
    if (!reservation?.id) return;
    try {
      await deleteRent(reservation.id);
      toast.success(
        direction === "rtl"
          ? "تم حذف الإيجار بنجاح"
          : "Rent deleted successfully"
      );
      // Dispatch event to update Calendar
      window.dispatchEvent(new Event("rent-deleted"));
      onSave?.({ deleted: true, id: reservation.id });
    } catch (err) {
      toast.error(
        err?.message ||
          (direction === "rtl" ? "فشل حذف الإيجار" : "Failed to delete rent")
      );
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
                      ? "تعديل إيجار"
                      : "Edit Rent"
                    : direction === "rtl"
                    ? "إضافة إيجار جديد"
                    : "Add New Rent"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "املأ البيانات التالية لإضافة إيجار جديد"
                    : "Fill in the following information to add a new rent"}
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
            {/* Rent Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <User
                  className={`h-5 w-5 text-blue-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "بيانات الإيجار" : "Rent Details"}
              </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Unit */}
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
                  {availableUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
                )}
              </div>

              {/* Tenant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {direction === "rtl" ? "المستأجر" : "Tenant"} *
                </label>
                <select
                  value={formData.tenant}
                  onChange={(e) => handleInputChange("tenant", e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.tenant ? "border-red-500" : ""
                  }`}
                >
                  <option value="">
                    {direction === "rtl" ? "اختر المستأجر" : "Select Tenant"}
                  </option>
                  {availableTenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {errors.tenant && (
                  <p className="text-red-500 text-sm mt-1">{errors.tenant}</p>
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
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "بداية الإيجار" : "Rent Start"} *
                  </label>
                  <Input
                    type="date"
                    value={formData.rent_start || ""}
                    onChange={(e) =>
                      handleInputChange("rent_start", e.target.value || "")
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.rent_start ? "border-red-500" : ""
                    }`}
                  />
                  {errors.rent_start && (
                    <p className="text-red-500 text-sm mt-1">{errors.rent_start}</p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "نهاية الإيجار" : "Rent End"} *
                  </label>
                  <Input
                    type="date"
                    value={formData.rent_end || ""}
                    onChange={(e) =>
                      handleInputChange("rent_end", e.target.value || "")
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.rent_end ? "border-red-500" : ""
                    }`}
                  />
                  {errors.rent_end && (
                    <p className="text-red-500 text-sm mt-1">{errors.rent_end}</p>
                  )}
                </div>

                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "المبلغ الإجمالي" : "Total Amount"} *
                  </label>
                  <Input
                    type="number"
                    value={formData.total_amount || ""}
                    onChange={(e) => handleInputChange("total_amount", e.target.value || "")}
                    min="0"
                    step="0.01"
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.total_amount ? "border-red-500" : ""
                    }`}
                  />
                  {errors.total_amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.total_amount}</p>
                  )}
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "حالة الدفع" : "Payment Status"} *
                  </label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) => handleInputChange("payment_status", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.payment_status ? "border-red-500" : ""
                    }`}
                  >
                    <option value="paid">{direction === "rtl" ? "مدفوع" : "Paid"}</option>
                    <option value="pending">{direction === "rtl" ? "قيد الانتظار" : "Pending"}</option>
                    <option value="overdue">{direction === "rtl" ? "متأخر" : "Overdue"}</option>
                  </select>
                  {errors.payment_status && (
                    <p className="text-red-500 text-sm mt-1">{errors.payment_status}</p>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "طريقة الدفع" : "Payment Method"} *
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => handleInputChange("payment_method", e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.payment_method ? "border-red-500" : ""
                    }`}
                  >
                    <option value="cash">{direction === "rtl" ? "نقدًا" : "Cash"}</option>
                    <option value="bank_transfer">{direction === "rtl" ? "تحويل بنكي" : "Bank Transfer"}</option>
                    <option value="credit_card">{direction === "rtl" ? "بطاقة ائتمان" : "Credit Card"}</option>
                    <option value="online_payment">{direction === "rtl" ? "دفع إلكتروني" : "Online Payment"}</option>
                  </select>
                  {errors.payment_method && (
                    <p className="text-red-500 text-sm mt-1">{errors.payment_method}</p>
                  )}
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "تاريخ الدفع" : "Payment Date"} *
                  </label>
                  <Input
                    type="date"
                    value={formData.payment_date || ""}
                    onChange={(e) => handleInputChange("payment_date", e.target.value || "")}
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.payment_date ? "border-red-500" : ""
                    }`}
                  />
                  {errors.payment_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.payment_date}</p>
                  )}
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "مرفق (اختياري)" : "Attachment (optional)"}
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleInputChange("attachment", e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-700 dark:text-gray-300"
                  />
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
                    value={formData.totalCost || ""}
                    onChange={(e) =>
                      handleInputChange("totalCost", e.target.value || "")
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

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <MessageSquare
                  className={`h-5 w-5 text-orange-600 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  }`}
                />
                {direction === "rtl" ? "ملاحظات" : "Notes"}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {direction === "rtl" ? "ملاحظات" : "Notes"}
                </label>
                <textarea
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value || "")}
                  placeholder={
                    direction === "rtl"
                      ? "أدخل أي ملاحظات..."
                      : "Enter any notes..."
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
              {isEdit && reservation?.id ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  className="w-full sm:w-auto px-6 py-2"
                >
                  <X
                    className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                  />
                  {direction === "rtl" ? "حذف الإيجار" : "Delete Rent"}
                </Button>
              ) : null}
              <Button type="submit" className="w-full sm:w-auto px-6 py-2">
                <Save
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {isEdit
                  ? direction === "rtl"
                    ? "حفظ التغييرات"
                    : "Save Changes"
                  : direction === "rtl"
                  ? "إضافة إيجار"
                  : "Add Rent"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ReservationForm;
