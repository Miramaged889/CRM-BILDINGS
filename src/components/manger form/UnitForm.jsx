import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../stores/languageStore";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchOwners } from "../../store/slices/ownersSlice";
import {
  fetchCities,
  fetchDistricts,
  clearDistricts,
} from "../../store/slices/citiesSlice";
import { isoToDateInput } from "../../utils/dateUtils";
import {
  Home,
  MapPin,
  User,
  Building2,
  Calendar,
  DollarSign,
  Camera,
  Save,
  X,
  Image as ImageIcon,
  Trash2,
  Percent,
  Bed,
  Bath,
  Square,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

const UnitForm = ({ unit = null, onSave, onCancel, isEdit = false }) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { owners } = useAppSelector((state) => state.owners);
  const {
    cities,
    districts,
    isLoading: citiesLoading,
  } = useAppSelector((state) => state.cities);

  const [formData, setFormData] = useState({
    name: unit?.name || "",
    location_url: unit?.location_url || "",
    location_text: unit?.location_text || "",
    owner: unit?.owner || unit?.owner?.id || "",
    city: unit?.city || unit?.city?.id || "",
    city_name: unit?.city_name || unit?.city?.name || "",
    district: unit?.district || unit?.district?.id || "",
    district_name: unit?.district_name || unit?.district?.name || "",
    owner_percentage: unit?.owner_percentage || "",
    type: unit?.type?.toLowerCase() || "",
    bedrooms: unit?.bedrooms || unit?.details?.bedrooms || "",
    bathrooms: unit?.bathrooms || unit?.details?.bathrooms || "",
    area: unit?.area || unit?.details?.area || "",
    lease_start: unit?.lease_start
      ? isoToDateInput(unit.lease_start)
      : new Date().toISOString().split("T")[0],
    lease_end: unit?.lease_end ? isoToDateInput(unit.lease_end) : "",
    price_per_day: unit?.price_per_day || "",
    status: unit?.status?.toLowerCase() || "available",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch owners, cities on mount for dropdown
  useEffect(() => {
    if (owners.length === 0) {
      dispatch(fetchOwners());
    }
    if (cities.length === 0) {
      dispatch(fetchCities());
    }
  }, [dispatch, owners.length, cities.length]);

  // Fetch districts when city changes
  useEffect(() => {
    if (formData.city) {
      dispatch(fetchDistricts(formData.city));
    } else {
      dispatch(clearDistricts());
    }
  }, [dispatch, formData.city]);

  // Update form data when unit prop changes
  useEffect(() => {
    if (unit) {
      setFormData({
        name: unit.name || "",
        location_url: unit.location_url || "",
        location_text: unit.location_text || "",
        owner: unit.owner || unit.owner?.id || "",
        city: unit.city || unit.city?.id || "",
        city_name: unit.city_name || unit.city?.name || "",
        district: unit.district || unit.district?.id || "",
        district_name: unit.district_name || unit.district?.name || "",
        owner_percentage: unit.owner_percentage || "",
        type: (unit.type || "").toLowerCase(),
        bedrooms: unit.bedrooms || unit.details?.bedrooms || "",
        bathrooms: unit.bathrooms || unit.details?.bathrooms || "",
        area: unit.area || unit.details?.area || "",
        lease_start: unit.lease_start
          ? isoToDateInput(unit.lease_start)
          : new Date().toISOString().split("T")[0],
        lease_end: unit.lease_end ? isoToDateInput(unit.lease_end) : "",
        price_per_day: unit.price_per_day || "",
        status: (unit.status || "available").toLowerCase(),
      });

      // Set existing images as previews
      if (unit.images && Array.isArray(unit.images)) {
        setImagePreviews(unit.images);
      }
    }
  }, [unit]);

  const handleInputChange = (field, value) => {
    // If city changes, reset district and update city_name
    if (field === "city") {
      const selectedCity = cities.find((c) => c.id === parseInt(value));
      setFormData((prev) => ({
        ...prev,
        city: value,
        city_name: selectedCity?.name || "",
        district: "",
        district_name: "",
      }));
    }
    // If district changes, update district_name
    else if (field === "district") {
      const selectedDistrict = districts.find((d) => d.id === parseInt(value));
      setFormData((prev) => ({
        ...prev,
        district: value,
        district_name: selectedDistrict?.name || "",
      }));
    }
    // For other fields, just update normally
    else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 10) {
      setErrors((prev) => ({
        ...prev,
        images:
          direction === "rtl"
            ? "يمكن رفع 10 صور كحد أقصى"
            : "Maximum 10 images allowed",
      }));
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = [];
    newImages.forEach((file) => {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          if (newPreviews.length === newImages.length) {
            setImagePreviews([...imagePreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      } else if (typeof file === "string") {
        newPreviews.push(file);
      }
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        direction === "rtl" ? "اسم الوحدة مطلوب" : "Unit name is required";
    }

    if (!formData.location_url.trim()) {
      newErrors.location_url =
        direction === "rtl" ? "رابط الخريطة مطلوب" : "Location URL is required";
    } else if (
      !formData.location_url.includes("maps.app.goo.gl") &&
      !formData.location_url.includes("maps.google.com")
    ) {
      newErrors.location_url =
        direction === "rtl"
          ? "يجب أن يكون رابط Google Maps أو Apple Maps"
          : "Must be Google Maps or Apple Maps link";
    }

    if (!formData.location_text.trim()) {
      newErrors.location_text =
        direction === "rtl" ? "موقع الوحدة مطلوب" : "Location text is required";
    }

    if (!formData.owner) {
      newErrors.owner =
        direction === "rtl" ? "اختر المالك" : "Owner is required";
    }

    if (!formData.city) {
      newErrors.city =
        direction === "rtl" ? "اختر المدينة" : "City is required";
    }

    if (!formData.district) {
      newErrors.district =
        direction === "rtl" ? "اختر الحي" : "District is required";
    }

    if (
      !formData.owner_percentage ||
      formData.owner_percentage < 0 ||
      formData.owner_percentage > 100
    ) {
      newErrors.owner_percentage =
        direction === "rtl"
          ? "النسبة المئوية للمالك يجب أن تكون بين 0 و 100"
          : "Owner percentage must be between 0 and 100";
    }

    if (!formData.type) {
      newErrors.type =
        direction === "rtl" ? "اختر نوع الوحدة" : "Unit type is required";
    }

    if (!formData.bedrooms || formData.bedrooms < 0) {
      newErrors.bedrooms =
        direction === "rtl" ? "عدد الغرف مطلوب" : "Bedrooms is required";
    }

    if (!formData.bathrooms || formData.bathrooms < 0) {
      newErrors.bathrooms =
        direction === "rtl" ? "عدد الحمامات مطلوب" : "Bathrooms is required";
    }

    if (!formData.area || formData.area < 0) {
      newErrors.area =
        direction === "rtl" ? "المساحة مطلوبة" : "Area is required";
    }

    if (!formData.lease_start) {
      newErrors.lease_start =
        direction === "rtl"
          ? "تاريخ بداية الإيجار مطلوب"
          : "Lease start date is required";
    }

    if (!formData.lease_end) {
      newErrors.lease_end =
        direction === "rtl"
          ? "تاريخ نهاية الإيجار مطلوب"
          : "Lease end date is required";
    }

    if (
      formData.lease_start &&
      formData.lease_end &&
      new Date(formData.lease_start) >= new Date(formData.lease_end)
    ) {
      newErrors.lease_end =
        direction === "rtl"
          ? "تاريخ النهاية يجب أن يكون بعد تاريخ البداية"
          : "End date must be after start date";
    }

    // Images validation (required for new units, optional for edit)
    if (!isEdit && images.length === 0) {
      newErrors.images =
        direction === "rtl"
          ? "يجب رفع صورة واحدة على الأقل"
          : "At least one image is required";
    }

    if (images.length > 10) {
      newErrors.images =
        direction === "rtl"
          ? "يمكن رفع 10 صور كحد أقصى"
          : "Maximum 10 images allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const unitData = {
        ...formData,
        owner: parseInt(formData.owner),
        city: parseInt(formData.city),
        district: parseInt(formData.district),
        owner_percentage: parseFloat(formData.owner_percentage),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        type: formData.type.toLowerCase(),
        status: formData.status,
        images: images,
      };

      onSave(unitData);
    }
  };

  const unitTypes = [
    { value: "apartment", label: direction === "rtl" ? "شقة" : "Apartment" },
    { value: "villa", label: direction === "rtl" ? "فيلا" : "Villa" },
    { value: "office", label: direction === "rtl" ? "مكتب" : "Office" },
    { value: "shop", label: direction === "rtl" ? "محل" : "Shop" },
    { value: "studio", label: direction === "rtl" ? "استوديو" : "Studio" },
    {
      value: "penthouse",
      label: direction === "rtl" ? "بنتهاوس" : "Penthouse",
    },
    { value: "warehouse", label: direction === "rtl" ? "مستودع" : "Warehouse" },
    { value: "retail", label: direction === "rtl" ? "تجاري" : "Retail" },
  ];

  const statusOptions = [
    { value: "available", label: direction === "rtl" ? "متاح" : "Available" },
    { value: "occupied", label: direction === "rtl" ? "مؤجر" : "Occupied" },
    {
      value: "in_maintenance",
      label: direction === "rtl" ? "تحت الصيانة" : "In Maintenance",
    },
  ];

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
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit
                ? direction === "rtl"
                  ? "تعديل الوحدة"
                  : "Edit Unit"
                : direction === "rtl"
                ? "إضافة وحدة جديدة"
                : "Add New Unit"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {direction === "rtl"
                ? "املأ التفاصيل أدناه لإضافة وحدة جديدة"
                : "Fill in the details below to add a new unit"}
            </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unit Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "اسم الوحدة" : "Unit Name"} *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={direction === "rtl" ? "مثال: A2028" : "e.g. A2028"}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Unit Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "نوع الوحدة" : "Unit Type"} *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                  errors.type
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">
                  {direction === "rtl" ? "اختر النوع" : "Select Type"}
                </option>
                {unitTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            {/* Bedrooms, Bathrooms, Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2  items-center">
                <Bed
                  className={`h-4 w-4 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-blue-500`}
                />
                {direction === "rtl" ? "عدد الغرف" : "Bedrooms"} *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                className={errors.bedrooms ? "border-red-500" : ""}
              />
              {errors.bedrooms && (
                <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2  items-center">
                <Bath
                  className={`h-4 w-4 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-blue-500`}
                />
                {direction === "rtl" ? "عدد الحمامات" : "Bathrooms"} *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                className={errors.bathrooms ? "border-red-500" : ""}
              />
              {errors.bathrooms && (
                <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center">
                <Square
                  className={`h-4 w-4 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-blue-500`}
                />
                {direction === "rtl" ? "المساحة (م²)" : "Area (m²)"} *
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
                className={errors.area ? "border-red-500" : ""}
              />
              {errors.area && (
                <p className="text-red-500 text-sm mt-1">{errors.area}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center">
                <MapPin
                  className={`h-4 w-4 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-green-500`}
                />
                {direction === "rtl" ? "رابط الخريطة" : "Location URL"} *
              </label>
              <Input
                value={formData.location_url}
                onChange={(e) =>
                  handleInputChange("location_url", e.target.value)
                }
                placeholder={
                  direction === "rtl"
                    ? "https://maps.app.goo.gl/..."
                    : "https://maps.app.goo.gl/..."
                }
                className={errors.location_url ? "border-red-500" : ""}
              />
              {errors.location_url && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location_url}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "موقع الوحدة (نص)" : "Location Text"} *
              </label>
              <Input
                value={formData.location_text}
                onChange={(e) =>
                  handleInputChange("location_text", e.target.value)
                }
                placeholder={
                  direction === "rtl"
                    ? "مثال: القاهرة، مصر"
                    : "e.g. Cairo, Egypt"
                }
                className={errors.location_text ? "border-red-500" : ""}
              />
              {errors.location_text && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location_text}
                </p>
              )}
            </div>

            {/* Owner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center">
                <User
                  className={`h-4 w-4 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-purple-500`}
                />
                {direction === "rtl" ? "المالك" : "Owner"} *
              </label>
              <select
                value={formData.owner}
                onChange={(e) => handleInputChange("owner", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                  errors.owner
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">
                  {direction === "rtl" ? "اختر المالك" : "Select Owner"}
                </option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.full_name || owner.name}
                  </option>
                ))}
              </select>
              {errors.owner && (
                <p className="text-red-500 text-sm mt-1">{errors.owner}</p>
              )}
            </div>

            {/* Owner Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center">
                <Percent
                  className={`h-4 w-4 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-purple-500`}
                />
                {direction === "rtl"
                  ? "نسبة المالك (%)"
                  : "Owner Percentage (%)"}{" "}
                *
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.owner_percentage}
                onChange={(e) =>
                  handleInputChange("owner_percentage", e.target.value)
                }
                placeholder="0-100"
                className={errors.owner_percentage ? "border-red-500" : ""}
              />
              {errors.owner_percentage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.owner_percentage}
                </p>
              )}
            </div>

            {/* City & District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "المدينة" : "City"} *
              </label>
              <select
                value={formData.city}
                onChange={(e) => {
                  handleInputChange("city", e.target.value);
                }}
                disabled={citiesLoading}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                  errors.city
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } ${citiesLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <option value="">
                  {citiesLoading
                    ? direction === "rtl"
                      ? "جاري التحميل..."
                      : "Loading..."
                    : direction === "rtl"
                    ? "اختر المدينة"
                    : "Select City"}
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

            {/* City Name Display (Read-only) */}
            {formData.city_name && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {direction === "rtl" ? "اسم المدينة" : "City Name"}
                </label>
                <Input
                  value={formData.city_name}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "الحي" : "District"} *
              </label>
              <select
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                disabled={!formData.city || citiesLoading}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 ${
                  errors.district
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } ${
                  !formData.city || citiesLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <option value="">
                  {citiesLoading
                    ? direction === "rtl"
                      ? "جاري التحميل..."
                      : "Loading..."
                    : direction === "rtl"
                    ? "اختر الحي"
                    : "Select District"}
                </option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">{errors.district}</p>
              )}
            </div>

            {/* District Name Display (Read-only) */}
            {formData.district_name && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {direction === "rtl" ? "اسم الحي" : "District Name"}
                </label>
                <Input
                  value={formData.district_name}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            )}

            {/* Lease Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center">
                <Calendar
                  className={`h-4 w-4 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-blue-500`}
                />
                {direction === "rtl"
                  ? "تاريخ بداية الإيجار"
                  : "Lease Start Date"}{" "}
                *
              </label>
              <Input
                type="date"
                value={formData.lease_start}
                onChange={(e) =>
                  handleInputChange("lease_start", e.target.value)
                }
                className={errors.lease_start ? "border-red-500" : ""}
              />
              {errors.lease_start && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lease_start}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center">
                <Calendar
                  className={`h-4 w-4 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-blue-500`}
                />
                {direction === "rtl" ? "تاريخ نهاية الإيجار" : "Lease End Date"}{" "}
                *
              </label>
              <Input
                type="date"
                value={formData.lease_end}
                onChange={(e) => handleInputChange("lease_end", e.target.value)}
                min={formData.lease_start}
                className={errors.lease_end ? "border-red-500" : ""}
              />
              {errors.lease_end && (
                <p className="text-red-500 text-sm mt-1">{errors.lease_end}</p>
              )}
            </div>

            {/* Price Per Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center">
                <DollarSign
                  className={`h-4 w-4 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-green-500`}
                />
                {direction === "rtl" ? "السعر اليومي" : "Price Per Day"}{" "}
                (Optional)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.price_per_day}
                onChange={(e) =>
                  handleInputChange("price_per_day", e.target.value)
                }
                placeholder={direction === "rtl" ? "0.00" : "0.00"}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center">
                {direction === "rtl" ? "الحالة" : "Status"} (Optional)
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 items-center">
              <Camera
                className={`h-4 w-4 ${
                  direction === "rtl" ? "ml-2" : "mr-2"
                } text-purple-500`}
              />
              {direction === "rtl" ? "صور الوحدة" : "Unit Images"}{" "}
              {!isEdit && "*"} ({images.length}/10)
            </label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={images.length >= 10}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  images.length >= 10 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {direction === "rtl" ? "رفع صور" : "Upload Images"}
              </label>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onCancel}>
              {direction === "rtl" ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="submit">
              <Save
                className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
              />
              {isEdit
                ? direction === "rtl"
                  ? "حفظ التغييرات"
                  : "Save Changes"
                : direction === "rtl"
                ? "إضافة الوحدة"
                : "Add Unit"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UnitForm;
