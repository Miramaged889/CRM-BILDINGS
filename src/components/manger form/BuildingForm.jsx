import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  Building2,
  MapPin,
  Home,
  Camera,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  User,
  Calendar,
  FileText,
  Image,
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

const BuildingForm = ({
  building = null,
  onSave,
  onCancel,
  isEdit = false,
}) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: building?.name || "",
    address: building?.address || "",
    city: building?.city || "",
    country: building?.country || "",
    locationLink: building?.locationLink || "",
    totalUnits: building?.totalUnits || "",
    occupiedUnits: building?.occupiedUnits || "",
    vacantUnits: building?.vacantUnits || "",
    buildingType: building?.buildingType || "residential",
    yearBuilt: building?.yearBuilt || "",
    floors: building?.floors || "",
    description: building?.description || "",
    amenities: building?.amenities || [],
    photos: building?.photos || [],
    owners: building?.owners || [],
    rentStartDate: building?.rentStartDate || "",
    rentEndDate: building?.rentEndDate || "",
    contractPhotos: building?.contractPhotos || [],
  });

  const [errors, setErrors] = useState({});
  const [newAmenity, setNewAmenity] = useState("");
  const [newOwner, setNewOwner] = useState({
    ownerId: "",
    ownershipPercentage: "",
  });
  const [uploading, setUploading] = useState(false);

  // Mock owners data - in real app, this would come from API
  const availableOwners = [
    {
      id: 1,
      name: "Ahmed Ali",
      email: "ahmed@example.com",
      phone: "+201234567890",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    },
    {
      id: 2,
      name: "Mona Hassan",
      email: "mona@example.com",
      phone: "+201112223334",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    },
    {
      id: 3,
      name: "Omar Khalil",
      email: "omar@example.com",
      phone: "+201998887766",
      avatar:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    },
    {
      id: 4,
      name: "Sarah Ahmed",
      email: "sarah@example.com",
      phone: "+201555666777",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    },
    {
      id: 5,
      name: "Mohamed Hassan",
      email: "mohamed@example.com",
      phone: "+201888999000",
      avatar:
        "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
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

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
    }));

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  const removePhoto = (photoId) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.id !== photoId),
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (index) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const addOwner = () => {
    if (newOwner.ownerId && newOwner.ownershipPercentage) {
      const selectedOwner = availableOwners.find(
        (owner) => owner.id === parseInt(newOwner.ownerId)
      );
      if (selectedOwner) {
        const ownerData = {
          ...selectedOwner,
          ownershipPercentage: parseFloat(newOwner.ownershipPercentage),
        };

        setFormData((prev) => ({
          ...prev,
          owners: [...prev.owners, ownerData],
        }));
        setNewOwner({ ownerId: "", ownershipPercentage: "" });
      }
    }
  };

  const removeOwner = (ownerId) => {
    setFormData((prev) => ({
      ...prev,
      owners: prev.owners.filter((owner) => owner.id !== ownerId),
    }));
  };

  const updateOwnerPercentage = (ownerId, percentage) => {
    setFormData((prev) => ({
      ...prev,
      owners: prev.owners.map((owner) =>
        owner.id === ownerId
          ? { ...owner, ownershipPercentage: parseFloat(percentage) }
          : owner
      ),
    }));
  };

  const handleContractPhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);

    // Simulate file upload process
    setTimeout(() => {
      const newPhotos = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      }));

      setFormData((prev) => ({
        ...prev,
        contractPhotos: [...prev.contractPhotos, ...newPhotos],
      }));

      setUploading(false);
    }, 1000);
  };

  const handleRemoveContractPhoto = (photoId) => {
    setFormData((prev) => ({
      ...prev,
      contractPhotos: prev.contractPhotos.filter(
        (photo) => photo.id !== photoId
      ),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        direction === "rtl" ? "اسم المبنى مطلوب" : "Building name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        direction === "rtl" ? "العنوان مطلوب" : "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city =
        direction === "rtl" ? "المدينة مطلوبة" : "City is required";
    }

    if (!formData.totalUnits || formData.totalUnits <= 0) {
      newErrors.totalUnits =
        direction === "rtl" ? "عدد الوحدات مطلوب" : "Total units is required";
    }

    if (!formData.locationLink.trim()) {
      newErrors.locationLink =
        direction === "rtl" ? "رابط الموقع مطلوب" : "Location link is required";
    }

    if (formData.owners.length === 0) {
      newErrors.owners =
        direction === "rtl"
          ? "يجب اختيار مالك واحد على الأقل"
          : "At least one owner must be selected";
    }

    const totalOwnership = formData.owners.reduce(
      (sum, owner) => sum + (owner.ownershipPercentage || 0),
      0
    );
    if (totalOwnership !== 100) {
      newErrors.ownership =
        direction === "rtl"
          ? "يجب أن يكون إجمالي نسبة الملكية 100%"
          : "Total ownership must equal 100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const buildingData = {
        ...formData,
        id: building?.id || Date.now(),
        totalUnits: parseInt(formData.totalUnits),
        occupiedUnits: parseInt(formData.occupiedUnits) || 0,
        vacantUnits: parseInt(formData.vacantUnits) || 0,
        floors: parseInt(formData.floors) || 1,
        yearBuilt: parseInt(formData.yearBuilt) || new Date().getFullYear(),
      };

      onSave(buildingData);
    }
  };

  const buildingTypes = [
    {
      value: "residential",
      label: direction === "rtl" ? "سكني" : "Residential",
    },
    {
      value: "commercial",
      label: direction === "rtl" ? "تجاري" : "Commercial",
    },
    { value: "mixed", label: direction === "rtl" ? "مختلط" : "Mixed Use" },
    { value: "office", label: direction === "rtl" ? "مكتبي" : "Office" },
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
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit
                    ? direction === "rtl"
                      ? "تعديل المبنى"
                      : "Edit Building"
                    : direction === "rtl"
                    ? "إضافة مبنى جديد"
                    : "Add New Building"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {direction === "rtl"
                    ? "املأ البيانات التالية لإضافة مبنى جديد"
                    : "Fill in the following information to add a new building"}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Building2
                    className={`h-5 w-5 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    } text-blue-600`}
                  />
                  {direction === "rtl"
                    ? "المعلومات الأساسية"
                    : "Basic Information"}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اسم المبنى" : "Building Name"}
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={
                      direction === "rtl"
                        ? "أدخل اسم المبنى"
                        : "Enter building name"
                    }
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

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
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.address ? "border-red-500" : ""
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl" ? "المدينة" : "City"}
                    </label>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder={direction === "rtl" ? "المدينة" : "City"}
                      className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                        errors.city ? "border-red-500" : ""
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl" ? "البلد" : "Country"}
                    </label>
                    <Input
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      placeholder={direction === "rtl" ? "البلد" : "Country"}
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "نوع المبنى" : "Building Type"}
                  </label>
                  <select
                    value={formData.buildingType}
                    onChange={(e) =>
                      handleInputChange("buildingType", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {buildingTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <MapPin
                    className={`h-5 w-5 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    } text-green-600`}
                  />
                  {direction === "rtl"
                    ? "معلومات الموقع"
                    : "Location Information"}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "رابط الموقع" : "Location Link"}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={formData.locationLink}
                      onChange={(e) =>
                        handleInputChange("locationLink", e.target.value)
                      }
                      placeholder="https://www.google.com/maps/place/..."
                      className={`flex-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                        errors.locationLink ? "border-red-500" : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (formData.locationLink) {
                          window.open(formData.locationLink, "_blank");
                        }
                      }}
                      className="whitespace-nowrap"
                      disabled={!formData.locationLink}
                    >
                      <MapPin
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {direction === "rtl" ? "فتح" : "Open"}
                    </Button>
                  </div>
                  {errors.locationLink && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.locationLink}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl" ? "سنة البناء" : "Year Built"}
                    </label>
                    <Input
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) =>
                        handleInputChange("yearBuilt", e.target.value)
                      }
                      placeholder="2020"
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {direction === "rtl" ? "عدد الطوابق" : "Number of Floors"}
                    </label>
                    <Input
                      type="number"
                      value={formData.floors}
                      onChange={(e) =>
                        handleInputChange("floors", e.target.value)
                      }
                      placeholder="5"
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Units Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Home
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-purple-600`}
                />
                {direction === "rtl" ? "معلومات الوحدات" : "Units Information"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "إجمالي الوحدات" : "Total Units"}
                  </label>
                  <Input
                    type="number"
                    value={formData.totalUnits}
                    onChange={(e) =>
                      handleInputChange("totalUnits", e.target.value)
                    }
                    placeholder="24"
                    className={`bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
                      errors.totalUnits ? "border-red-500" : ""
                    }`}
                  />
                  {errors.totalUnits && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.totalUnits}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الوحدات المؤجرة" : "Occupied Units"}
                  </label>
                  <Input
                    type="number"
                    value={formData.occupiedUnits}
                    onChange={(e) =>
                      handleInputChange("occupiedUnits", e.target.value)
                    }
                    placeholder="18"
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "الوحدات الشاغرة" : "Vacant Units"}
                  </label>
                  <Input
                    type="number"
                    value={formData.vacantUnits}
                    onChange={(e) =>
                      handleInputChange("vacantUnits", e.target.value)
                    }
                    placeholder="6"
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Rent Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Calendar
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-orange-600`}
                />
                {direction === "rtl" ? "فترة الإيجار" : "Rent Period"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "تاريخ بداية الإيجار"
                      : "Rent Start Date"}
                  </label>
                  <Input
                    type="date"
                    value={formData.rentStartDate}
                    onChange={(e) =>
                      handleInputChange("rentStartDate", e.target.value)
                    }
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl"
                      ? "تاريخ نهاية الإيجار"
                      : "Rent End Date"}
                  </label>
                  <Input
                    type="date"
                    value={formData.rentEndDate}
                    onChange={(e) =>
                      handleInputChange("rentEndDate", e.target.value)
                    }
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Camera
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-yellow-600`}
                />
                {direction === "rtl" ? "صور المبنى" : "Building Photos"}
              </h3>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {direction === "rtl"
                    ? "اسحب الصور هنا أو انقر للاختيار"
                    : "Drag photos here or click to select"}
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                >
                  <Camera
                    className={`h-4 w-4 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "اختيار الصور" : "Select Photos"}
                </label>
              </div>

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contract Photos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FileText
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-indigo-600`}
                />
                {direction === "rtl" ? "صور العقد" : "Contract Photos"}
              </h3>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="contract-photos"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleContractPhotoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="contract-photos"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {uploading ? (
                      direction === "rtl" ? (
                        "جاري الرفع..."
                      ) : (
                        "Uploading..."
                      )
                    ) : (
                      <>
                        <span className="font-medium text-indigo-600 hover:text-indigo-500">
                          {direction === "rtl"
                            ? "انقر لرفع صور العقد"
                            : "Click to upload contract photos"}
                        </span>
                        <br />
                        <span>
                          {direction === "rtl"
                            ? "أو اسحب وأفلت الملفات هنا"
                            : "or drag and drop files here"}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {direction === "rtl"
                      ? "PNG, JPG, PDF حتى 10MB"
                      : "PNG, JPG, PDF up to 10MB"}
                  </p>
                </label>
              </div>

              {formData.contractPhotos.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {direction === "rtl"
                      ? "الملفات المرفوعة"
                      : "Uploaded Files"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.contractPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="flex-shrink-0">
                            {photo.type.startsWith("image/") ? (
                              <Image className="h-8 w-8 text-blue-500" />
                            ) : (
                              <FileText className="h-8 w-8 text-red-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {photo.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(photo.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveContractPhoto(photo.id)}
                            className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {photo.type.startsWith("image/") && (
                          <div className="mt-2">
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-20 object-cover rounded border border-gray-200 dark:border-gray-600"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {direction === "rtl" ? "المرافق" : "Amenities"}
              </h3>

              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder={
                    direction === "rtl" ? "أضف مرفق جديد" : "Add new amenity"
                  }
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className={`${
                          direction === "rtl" ? "mr-2" : "ml-2"
                        } text-blue-600 hover:text-blue-800`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Owners */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <User
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-purple-600`}
                />
                {direction === "rtl" ? "الملاك" : "Owners"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "اختيار المالك" : "Select Owner"}
                  </label>
                  <select
                    value={newOwner.ownerId}
                    onChange={(e) =>
                      setNewOwner({ ...newOwner, ownerId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">
                      {direction === "rtl" ? "اختر مالك" : "Select Owner"}
                    </option>
                    {availableOwners
                      .filter(
                        (owner) =>
                          !formData.owners.some(
                            (selectedOwner) => selectedOwner.id === owner.id
                          )
                      )
                      .map((owner) => (
                        <option key={owner.id} value={owner.id}>
                          {owner.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {direction === "rtl" ? "نسبة الملكية (%)" : "Ownership %"}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={newOwner.ownershipPercentage}
                    onChange={(e) =>
                      setNewOwner({
                        ...newOwner,
                        ownershipPercentage: e.target.value,
                      })
                    }
                    placeholder="50"
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addOwner}
                    className="w-full px-4 py-2"
                    disabled={
                      !newOwner.ownerId || !newOwner.ownershipPercentage
                    }
                  >
                    <Plus
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {direction === "rtl" ? "إضافة" : "Add"}
                  </Button>
                </div>
              </div>

              {errors.owners && (
                <p className="text-red-500 text-sm">{errors.owners}</p>
              )}
              {errors.ownership && (
                <p className="text-red-500 text-sm">{errors.ownership}</p>
              )}

              {formData.owners.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    {direction === "rtl"
                      ? "الملاك المختارون"
                      : "Selected Owners"}
                  </h4>
                  {formData.owners.map((owner) => (
                    <div
                      key={owner.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={owner.avatar}
                          alt={owner.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {owner.name}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {owner.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={owner.ownershipPercentage}
                            onChange={(e) =>
                              updateOwnerPercentage(owner.id, e.target.value)
                            }
                            className="w-20 px-2 py-1 text-sm"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOwner(owner.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Total Ownership Percentage */}
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                        {direction === "rtl"
                          ? "إجمالي نسبة الملكية"
                          : "Total Ownership"}
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          formData.owners.reduce(
                            (sum, owner) =>
                              sum + (owner.ownershipPercentage || 0),
                            0
                          ) === 100
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {formData.owners
                          .reduce(
                            (sum, owner) =>
                              sum + (owner.ownershipPercentage || 0),
                            0
                          )
                          .toFixed(1)}
                        %
                      </span>
                    </div>
                    {formData.owners.reduce(
                      (sum, owner) => sum + (owner.ownershipPercentage || 0),
                      0
                    ) !== 100 && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {direction === "rtl"
                          ? "يجب أن يكون إجمالي نسبة الملكية 100%"
                          : "Total ownership must equal 100%"}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "وصف المبنى" : "Building Description"}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder={
                  direction === "rtl"
                    ? "وصف المبنى..."
                    : "Building description..."
                }
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                  ? "إنشاء المبنى"
                  : "Create Building"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BuildingForm;
