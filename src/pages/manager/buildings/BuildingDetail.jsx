import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Home,
  Calendar,
  Camera,
  Edit,
  Printer,
  Users,
  Layers,
  Star,
  Wrench,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { BuildingForm } from "../../../components/forms/manger form";

const BuildingDetail = () => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [building, setBuilding] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Mock data - in real app, this would come from API
  const mockBuildings = [
    {
      id: 1,
      name: "Sunset Tower",
      address: "Downtown, City",
      city: "Dubai",
      country: "UAE",
      lat: 25.2048,
      lng: 55.2708,
      totalUnits: 24,
      occupiedUnits: 18,
      vacantUnits: 6,
      buildingType: "residential",
      yearBuilt: 2020,
      floors: 8,
      description:
        "A modern residential tower with stunning city views and premium amenities.",
      owners: [
        {
          id: 1,
          name: "Ahmed Ali",
          email: "ahmed@example.com",
          phone: "+201234567890",
          ownershipPercentage: 60,
          avatar:
            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        },
        {
          id: 2,
          name: "Mona Hassan",
          email: "mona@example.com",
          phone: "+201112223334",
          ownershipPercentage: 40,
          avatar:
            "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        },
      ],
      amenities: [
        "Swimming Pool",
        "Gym",
        "Parking",
        "Security",
        "Garden",
        "Playground",
      ],
      photos: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
      ],
      assets: [
        { id: 1, name: "Elevator System", value: "$50,000", type: "equipment" },
        { id: 2, name: "HVAC System", value: "$30,000", type: "equipment" },
        {
          id: 3,
          name: "Security Cameras",
          value: "$15,000",
          type: "equipment",
        },
        { id: 4, name: "Maintenance Van", value: "$25,000", type: "vehicle" },
        { id: 5, name: "Office Furniture", value: "$8,000", type: "furniture" },
      ],
      units: [
        {
          id: 1,
          number: "A-101",
          type: "2BR",
          status: "occupied",
          tenant: "John Smith",
          rent: 2500,
        },
        {
          id: 2,
          number: "A-102",
          type: "1BR",
          status: "occupied",
          tenant: "Sarah Johnson",
          rent: 2000,
        },
        {
          id: 3,
          number: "A-103",
          type: "3BR",
          status: "vacant",
          tenant: null,
          rent: 3000,
        },
        {
          id: 4,
          number: "A-201",
          type: "2BR",
          status: "occupied",
          tenant: "Ahmed Hassan",
          rent: 2500,
        },
        {
          id: 5,
          number: "A-202",
          type: "1BR",
          status: "maintenance",
          tenant: null,
          rent: 2000,
        },
        {
          id: 6,
          number: "A-203",
          type: "2BR",
          status: "vacant",
          tenant: null,
          rent: 2500,
        },
      ],
    },
    {
      id: 2,
      name: "Palm Residency",
      address: "Palm District",
      city: "Dubai",
      country: "UAE",
      lat: 25.1121,
      lng: 55.1389,
      totalUnits: 16,
      occupiedUnits: 12,
      vacantUnits: 4,
      buildingType: "commercial",
      yearBuilt: 2018,
      floors: 6,
      description: "Premium commercial building in the heart of Palm District.",
      amenities: ["Parking", "Security", "Conference Rooms", "Cafeteria"],
      photos: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
      ],
      assets: [
        {
          id: 1,
          name: "Fire Safety System",
          value: "$20,000",
          type: "equipment",
        },
        { id: 2, name: "Generator", value: "$35,000", type: "equipment" },
      ],
      units: [
        {
          id: 1,
          number: "B-101",
          type: "Office",
          status: "occupied",
          tenant: "Tech Corp",
          rent: 4000,
        },
        {
          id: 2,
          number: "B-102",
          type: "Office",
          status: "occupied",
          tenant: "Design Studio",
          rent: 3500,
        },
        {
          id: 3,
          number: "B-201",
          type: "Retail",
          status: "vacant",
          tenant: null,
          rent: 5000,
        },
      ],
      owners: [
        {
          id: 1,
          name: "Ahmed Ali",
          email: "ahmed@example.com",
          phone: "+201234567890",
          ownershipPercentage: 60,
          avatar:
            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        },
      ],
    },
    {
      id: 3,
      name: "Nile Heights",
      address: "Zamalek, Cairo",
      city: "Cairo",
      country: "Egypt",
      lat: 30.0561,
      lng: 31.2212,
      totalUnits: 32,
      occupiedUnits: 28,
      vacantUnits: 4,
      buildingType: "mixed",
      yearBuilt: 2019,
      floors: 12,
      description:
        "Mixed-use building with residential and commercial spaces overlooking the Nile.",
      amenities: ["Nile View", "Parking", "Security", "Gym", "Restaurant"],
      photos: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
      ],
      assets: [
        {
          id: 1,
          name: "Water Treatment System",
          value: "$40,000",
          type: "equipment",
        },
        {
          id: 2,
          name: "Backup Generator",
          value: "$45,000",
          type: "equipment",
        },
        { id: 3, name: "Security System", value: "$20,000", type: "equipment" },
      ],
      units: [
        {
          id: 1,
          number: "C-101",
          type: "Office",
          status: "occupied",
          tenant: "Tech Corp",
          rent: 4000,
        },
        {
          id: 2,
          number: "C-102",
          type: "Office",
          status: "occupied",
          tenant: "Design Studio",
          rent: 3500,
        },
        {
          id: 3,
          number: "C-201",
          type: "Retail",
          status: "vacant",
          tenant: null,
          rent: 5000,
        },
        {
          id: 4,
          number: "C-202",
          type: "Retail",
          status: "vacant",
          tenant: null,
          rent: 5000,
        },
        {
          id: 5,
          number: "C-203",
          type: "Retail",
          status: "vacant",
          tenant: null,
          rent: 5000,
        },
        {
          id: 6,
          number: "C-204",
          type: "Retail",
          status: "vacant",
          tenant: null,
          rent: 5000,
        },
      ],
      owners: [
        {
          id: 1,
          name: "Ahmed Ali",
          email: "ahmed@example.com",
          phone: "+201234567890",
          ownershipPercentage: 60,
          avatar:
            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        },
        {
          id: 2,
          name: "Mona Hassan",
          email: "mona@example.com",
          phone: "+201112223334",
          ownershipPercentage: 40,
          avatar:
            "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        },
        {
          id: 3,
          name: "Omar Khalil",
          email: "omar@example.com",
          phone: "+201998887766",
          ownershipPercentage: 20,
          avatar:
            "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchBuilding = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundBuilding = mockBuildings.find((b) => b.id === parseInt(id));
      setBuilding(foundBuilding);
      setLoading(false);
    };

    fetchBuilding();
  }, [id]);

  const handleEdit = () => {
    setShowForm(true);
  };

  const handlePrint = () => {
    console.log("Print building details:", building);
    window.print();
  };

  const handleSaveBuilding = (buildingData) => {
    console.log("Saving building:", buildingData);
    setBuilding(buildingData);
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const nextPhoto = () => {
    if (building?.photos?.length > 0) {
      setCurrentPhotoIndex((prev) =>
        prev === building.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (building?.photos?.length > 0) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? building.photos.length - 1 : prev - 1
      );
    }
  };

  const translateType = (type) => {
    if (type === "residential")
      return direction === "rtl" ? "سكني" : "Residential";
    if (type === "commercial")
      return direction === "rtl" ? "تجاري" : "Commercial";
    if (type === "mixed") return direction === "rtl" ? "مختلط" : "Mixed Use";
    if (type === "office") return direction === "rtl" ? "مكتبي" : "Office";
    return type;
  };

  const translateStatus = (status) => {
    if (status === "occupied")
      return direction === "rtl" ? "مؤجرة" : "Occupied";
    if (status === "vacant") return direction === "rtl" ? "شاغرة" : "Vacant";
    if (status === "maintenance")
      return direction === "rtl" ? "صيانة" : "Maintenance";
    return status;
  };

  const translateAmenity = (amenity) => {
    const amenityTranslations = {
      "Swimming Pool": direction === "rtl" ? "حمام سباحة" : "Swimming Pool",
      Gym: direction === "rtl" ? "نادي رياضي" : "Gym",
      Parking: direction === "rtl" ? "موقف سيارات" : "Parking",
      Security: direction === "rtl" ? "أمن وحراسة" : "Security",
      Garden: direction === "rtl" ? "حديقة" : "Garden",
      Playground: direction === "rtl" ? "ملعب أطفال" : "Playground",
      "Conference Rooms":
        direction === "rtl" ? "قاعات اجتماعات" : "Conference Rooms",
      Cafeteria: direction === "rtl" ? "كافيتيريا" : "Cafeteria",
    };
    return amenityTranslations[amenity] || amenity;
  };

  const translateAssetType = (type) => {
    const typeTranslations = {
      equipment: direction === "rtl" ? "معدات" : "Equipment",
      vehicle: direction === "rtl" ? "مركبة" : "Vehicle",
      furniture: direction === "rtl" ? "أثاث" : "Furniture",
    };
    return typeTranslations[type] || type;
  };

  const translateAssetName = (name) => {
    const nameTranslations = {
      "Elevator System":
        direction === "rtl" ? "نظام المصاعد" : "Elevator System",
      "HVAC System": direction === "rtl" ? "نظام التكييف" : "HVAC System",
      "Security Cameras":
        direction === "rtl" ? "كاميرات المراقبة" : "Security Cameras",
      "Maintenance Van":
        direction === "rtl" ? "شاحنة الصيانة" : "Maintenance Van",
      "Office Furniture":
        direction === "rtl" ? "أثاث المكاتب" : "Office Furniture",
      "Fire Safety System":
        direction === "rtl" ? "نظام الإطفاء" : "Fire Safety System",
      Generator: direction === "rtl" ? "مولد كهربائي" : "Generator",
    };
    return nameTranslations[name] || name;
  };

  const getStatusColor = (status) => {
    if (status === "occupied")
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300";
    if (status === "vacant")
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300";
    if (status === "maintenance")
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300";
    return "bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300";
  };

  const filteredUnits =
    building?.units?.filter((unit) =>
      [unit.number, unit.tenant, unit.type].some(
        (field) =>
          field &&
          field.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) || [];

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {direction === "rtl" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {direction === "rtl" ? "المبنى غير موجود" : "Building Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {direction === "rtl"
              ? "المبنى المطلوب غير موجود أو تم حذفه"
              : "The requested building was not found or has been deleted"}
          </p>
          <Button onClick={() => navigate("/buildings")}>
            <ArrowLeft
              className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {direction === "rtl" ? "العودة للمباني" : "Back to Buildings"}
          </Button>
        </div>
      </div>
    );
  }

  const occupancyRate =
    building.totalUnits > 0
      ? Math.round((building.occupiedUnits / building.totalUnits) * 100)
      : 0;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              {building.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              {building.address}, {building.city}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button onClick={handleEdit} className="flex items-center">
            <Edit
              className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {direction === "rtl" ? "تعديل" : "Edit"}
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "إجمالي الوحدات" : "Total Units"}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {building.totalUnits}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "الوحدات المؤجرة" : "Occupied Units"}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {building.occupiedUnits}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "الوحدات الشاغرة" : "Vacant Units"}
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {building.vacantUnits}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <Home className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "معدل الإشغال" : "Occupancy Rate"}
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {occupancyRate}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Building Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos Gallery */}
          {building.photos && building.photos.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Camera
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-purple-600`}
                />
                {direction === "rtl" ? "معرض الصور" : "Photo Gallery"}
              </h3>
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={building.photos[currentPhotoIndex]}
                    alt={`${building.name} - Photo ${currentPhotoIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {building.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        direction === "rtl" ? "right-2" : "left-2"
                      } bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors`}
                    >
                      {direction === "rtl" ? (
                        <ChevronRight className="h-5 w-5" />
                      ) : (
                        <ChevronLeft className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={nextPhoto}
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        direction === "rtl" ? "left-2" : "right-2"
                      } bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors`}
                    >
                      {direction === "rtl" ? (
                        <ChevronLeft className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {building.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentPhotoIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {building.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentPhotoIndex
                        ? "border-blue-500"
                        : "border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Building2
                className={`h-5 w-5 ${
                  direction === "rtl" ? "ml-2" : "mr-2"
                } text-blue-600`}
              />
              {direction === "rtl" ? "معلومات المبنى" : "Building Information"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "النوع" : "Type"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {translateType(building.buildingType)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "سنة البناء" : "Year Built"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {building.yearBuilt}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "عدد الطوابق" : "Floors"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {building.floors}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "العمر" : "Age"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date().getFullYear() - building.yearBuilt}{" "}
                  {direction === "rtl" ? "سنة" : "years"}
                </p>
              </div>
            </div>
            {building.description && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "الوصف" : "Description"}
                </label>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {building.description}
                </p>
              </div>
            )}
          </Card>

          {/* Units List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Home
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-green-600`}
                />
                {direction === "rtl" ? "قائمة الوحدات" : "Units List"}
              </h3>
              <div className="relative max-w-sm">
                <Search
                  className={`absolute ${
                    direction === "rtl" ? "right-3" : "left-3"
                  } top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4`}
                />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    direction === "rtl"
                      ? "بحث في الوحدات..."
                      : "Search units..."
                  }
                  className={`${
                    direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                  }`}
                />
              </div>
            </div>
            <div className="space-y-3">
              {filteredUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {unit.number}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {unit.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {direction === "rtl" ? "المستأجر" : "Tenant"}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {unit.tenant ||
                          (direction === "rtl" ? "شاغر" : "Vacant")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`${
                        direction === "rtl" ? "text-left" : "text-right"
                      }`}
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {direction === "rtl" ? "الإيجار" : "Rent"}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${unit.rent.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
                        unit.status
                      )}`}
                    >
                      {translateStatus(unit.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MapPin
                className={`h-5 w-5 ${
                  direction === "rtl" ? "ml-2" : "mr-2"
                } text-red-600`}
              />
              {direction === "rtl" ? "الموقع" : "Location"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "العنوان" : "Address"}
                </label>
                <p className="text-gray-700 dark:text-gray-300">
                  {building.address}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "الإحداثيات" : "Coordinates"}
                </label>
                <p className="text-gray-700 dark:text-gray-300">
                  {building.lat}, {building.lng}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3609.9532218342447!2d${building.lng}!3d${building.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDEyJzE3LjMiTiA1NcKwMTYnMTQuOSJF!5e0!3m2!1sen!2seg!4v1758662447590!5m2!1sen!2seg`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${building.name} Location Map`}
                ></iframe>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "خريطة جوجل" : "Google Maps"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${building.lat},${building.lng}`;
                    window.open(url, "_blank");
                  }}
                  className="text-xs"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {direction === "rtl"
                    ? "فتح في جوجل مابس"
                    : "Open in Google Maps"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Owners */}
          {building.owners && building.owners.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-purple-600`}
                />
                {direction === "rtl" ? "الملاك" : "Owners"}
              </h3>
              <div className="space-y-4">
                {building.owners.map((owner) => (
                  <div
                    key={owner.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={owner.avatar}
                        alt={owner.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {owner.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {owner.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {owner.phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {owner.ownershipPercentage}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {direction === "rtl" ? "نسبة الملكية" : "Ownership"}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total Ownership Summary */}
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
                      {direction === "rtl"
                        ? "إجمالي نسبة الملكية"
                        : "Total Ownership"}
                    </span>
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {building.owners.reduce(
                        (sum, owner) => sum + (owner.ownershipPercentage || 0),
                        0
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Amenities */}
          {building.amenities && building.amenities.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Star
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-amber-600`}
                />
                {direction === "rtl" ? "المرافق" : "Amenities"}
              </h3>
              <div className="space-y-2">
                {building.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-2 h-2 bg-amber-500 rounded-full ${
                        direction === "rtl" ? "ml-3" : "mr-3"
                      }`}
                    ></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {translateAmenity(amenity)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Assets */}
          {building.assets && building.assets.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Wrench
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-gray-600`}
                />
                {direction === "rtl" ? "الأصول" : "Assets"}
              </h3>
              <div className="space-y-3">
                {building.assets.slice(0, 3).map((asset) => (
                  <div
                    key={asset.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {translateAssetName(asset.name)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {translateAssetType(asset.type)}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {asset.value}
                    </p>
                  </div>
                ))}
                {building.assets.length > 3 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    +{building.assets.length - 3}{" "}
                    {direction === "rtl" ? "أخرى" : "more"}
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Forms */}
      {showForm && (
        <BuildingForm
          building={building}
          onSave={handleSaveBuilding}
          onCancel={handleCloseForm}
          isEdit={true}
        />
      )}
    </div>
  );
};

export default BuildingDetail;
