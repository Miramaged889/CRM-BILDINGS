import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Search,
  Plus,
  Home,
  Building2,
  Edit,
  Trash2,
  Share,
  ExternalLink,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { BuildingForm } from "../../../components/manger form";

const Buildings = () => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [cityFilter, setCityFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const buildings = [
    {
      id: 1,
      name: "Sunset Tower",
      address: "Downtown, City",
      city: "Dubai",
      district: "Downtown",
      country: "UAE",
      locationLink: "https://www.google.com/maps/place/Downtown+Dubai",
      totalUnits: 24,
      occupiedUnits: 18,
      vacantUnits: 6,
      buildingType: "residential",
      yearBuilt: 2020,
      floors: 8,
      createdAt: "2025-10-15",
      constructionStart: "2025-10-01",
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
    },
    {
      id: 2,
      name: "Palm Residency",
      address: "Palm District",
      city: "Dubai",
      district: "Palm Jumeirah",
      country: "UAE",
      locationLink: "https://www.google.com/maps/place/Palm+Jumeirah",
      totalUnits: 16,
      occupiedUnits: 12,
      vacantUnits: 4,
      buildingType: "commercial",
      yearBuilt: 2018,
      floors: 6,
      createdAt: "2025-10-10",
      constructionStart: "2025-10-05",
      description: "Premium commercial building in the heart of Palm District.",
      owners: [
        {
          id: 3,
          name: "Omar Khalil",
          email: "omar@example.com",
          phone: "+201998887766",
          ownershipPercentage: 100,
          avatar:
            "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        },
      ],
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
    },
    {
      id: 3,
      name: "Nile Heights",
      address: "Zamalek, Cairo",
      city: "Cairo",
      district: "Zamalek",
      country: "Egypt",
      locationLink: "https://www.google.com/maps/place/Zamalek,+Cairo",
      totalUnits: 32,
      occupiedUnits: 28,
      vacantUnits: 4,
      buildingType: "mixed",
      yearBuilt: 2019,
      floors: 12,
      createdAt: "2025-10-20",
      constructionStart: "2025-10-15",
      description:
        "Mixed-use building with residential and commercial spaces overlooking the Nile.",
      owners: [
        {
          id: 1,
          name: "Ahmed Ali",
          email: "ahmed@example.com",
          phone: "+201234567890",
          ownershipPercentage: 50,
          avatar:
            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
        },
        {
          id: 2,
          name: "Mona Hassan",
          email: "mona@example.com",
          phone: "+201112223334",
          ownershipPercentage: 30,
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
    },
  ];

  const handleEdit = (building) => {
    setEditingBuilding(building);
    setShowForm(true);
  };

  const handleDelete = (building) => {
    if (
      window.confirm(
        direction === "rtl"
          ? "هل أنت متأكد من حذف هذا المبنى؟"
          : "Are you sure you want to delete this building?"
      )
    ) {
      console.log("Delete building:", building);
      // In real app, this would call API to delete
    }
  };

  const handleAddNew = () => {
    setEditingBuilding(null);
    setShowForm(true);
  };

  const handleShare = (building) => {
    if (navigator.share) {
      navigator.share({
        title: building.name,
        text: `${building.name} - ${building.address}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `${building.name} - ${building.address}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert(
          direction === "rtl" ? "تم نسخ الرابط" : "Link copied to clipboard"
        );
      });
    }
  };

  const handleLocationClick = (building) => {
    if (building.locationLink) {
      window.open(building.locationLink, "_blank");
    }
  };

  const handleSaveBuilding = (buildingData) => {
    console.log("Saving building:", buildingData);
    setShowForm(false);
    setEditingBuilding(null);
    // In real app, this would call API to save
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBuilding(null);
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

  // Get unique cities and districts for filter options
  const cities = [...new Set(buildings.map((building) => building.city))];
  const districts = [
    ...new Set(buildings.map((building) => building.district)),
  ];

  const filtered = buildings.filter((b) => {
    const matchesSearch = [b.name, b.address, b.city, b.buildingType].some(
      (v) => v.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesCity = cityFilter === "all" || b.city === cityFilter;
    const matchesDistrict =
      districtFilter === "all" || b.district === districtFilter;

    // Date filtering logic
    let matchesDate = true;
    if (fromDate || toDate) {
      const buildingDate = new Date(b.createdAt);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (from && to) {
        matchesDate = buildingDate >= from && buildingDate <= to;
      } else if (from) {
        matchesDate = buildingDate >= from;
      } else if (to) {
        matchesDate = buildingDate <= to;
      }
    }

    return matchesSearch && matchesCity && matchesDistrict && matchesDate;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            {direction === "rtl" ? "المباني" : "Buildings"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            {direction === "rtl"
              ? "إدارة المباني وعدد وحداتها"
              : "Manage buildings and unit counts"}
          </p>
        </div>
        <Button
          className="mt-6 sm:mt-0 shadow-sm hover:shadow-md transition-shadow"
          onClick={handleAddNew}
        >
          <Plus
            className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
          />
          {direction === "rtl" ? "إضافة مبنى" : "Add Building"}
        </Button>
      </motion.div>

      <Card className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search
              className={`absolute ${
                direction === "rtl" ? "right-3" : "left-3"
              } top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4`}
            />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={direction === "rtl" ? "بحث" : "Search"}
              className={`${direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"}`}
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "المدينة" : "City"}
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
              >
                <option value="all">
                  {direction === "rtl" ? "جميع المدن" : "All Cities"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "الحي" : "District"}
              </label>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
              >
                <option value="all">
                  {direction === "rtl" ? "جميع الأحياء" : "All Districts"}
                </option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* From Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "من تاريخ" : "From Date"}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
              />
            </div>

            {/* To Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "إلى تاريخ" : "To Date"}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
              />
            </div>

            {/* Clear Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {direction === "rtl" ? "الإجراءات" : "Actions"}
              </label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCityFilter("all");
                  setDistrictFilter("all");
                  setFromDate("");
                  setToDate("");
                }}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600 transition-all duration-200"
              >
                <Search className="h-4 w-4 mr-2" />
                {direction === "rtl" ? "مسح الفلاتر" : "Clear Filters"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((b, index) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 + 0.1 }}
          >
            <Card
              className="p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/buildings/${b.id}`)}
            >
              <div className="h-48 bg-gray-100 dark:bg-gray-700 relative">
                {b.photos && b.photos.length > 0 ? (
                  <img
                    src={b.photos[0]}
                    alt={b.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <MapPin className="h-6 w-6 mr-2" />{" "}
                    {direction === "rtl" ? "موقع" : "Location"}
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
                    {translateType(b.buildingType)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {b.name}
                    </h3>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocationClick(b);
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-1" /> {b.address}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {b.district}, {b.city}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {b.totalUnits}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {direction === "rtl" ? "إجمالي الوحدات" : "Total Units"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {b.occupiedUnits}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      {direction === "rtl" ? "مؤجرة" : "Occupied"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {b.vacantUnits}
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                      {direction === "rtl" ? "فارغة" : "Empty"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "مؤجرة" : "Occupied"}:{" "}
                      {b.occupiedUnits}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {direction === "rtl" ? "فارغة" : "Empty"}: {b.vacantUnits}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(b);
                      }}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      title={direction === "rtl" ? "مشاركة" : "Share"}
                    >
                      <Share className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(b);
                      }}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      title={direction === "rtl" ? "تعديل" : "Edit"}
                    >
                      <Edit className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(b);
                      }}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      title={direction === "rtl" ? "حذف" : "Delete"}
                    >
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mb-4">
            <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {direction === "rtl" ? "لا توجد مباني" : "No Buildings Found"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-4">
            {direction === "rtl"
              ? "لم يتم العثور على مباني تطابق معايير البحث المحددة"
              : "No buildings match the specified search criteria"}
          </p>
          {(fromDate || toDate) && (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {direction === "rtl"
                ? "جرب تغيير نطاق التاريخ أو مسح فلاتر التاريخ"
                : "Try adjusting the date range or clearing date filters"}
            </p>
          )}
        </motion.div>
      )}

      {/* Forms */}
      {showForm && (
        <BuildingForm
          building={editingBuilding}
          onSave={handleSaveBuilding}
          onCancel={handleCloseForm}
          isEdit={!!editingBuilding}
        />
      )}
    </div>
  );
};

export default Buildings;
