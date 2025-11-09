import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../stores/languageStore";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchUnits,
  createUnit,
  updateUnit,
  deleteUnit,
  clearError,
  fetchUnitById,
} from "../../../store/slices/unitsSlice";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Wrench,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { UnitForm } from "../../../components/manger form";

const Units = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const dispatch = useAppDispatch();
  const { units, isLoading, error } = useAppSelector((state) => state.units);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isFetchingUnit, setIsFetchingUnit] = useState(false);
  // Fetch units on mount
  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = async (unitId) => {
    if (
      window.confirm(
        direction === "rtl"
          ? "هل أنت متأكد من حذف هذه الوحدة؟"
          : "Are you sure you want to delete this unit?"
      )
    ) {
      try {
        await dispatch(deleteUnit(unitId)).unwrap();
        toast.success(t("units.deleteSuccess") || "Unit deleted successfully");
      } catch (err) {
        toast.error(err || "Failed to delete unit");
      }
    }
  };

  // Get unique cities, districts, and types from API data
  const cities = [
    ...new Set(
      units.map((unit) => unit.city_name || unit.city || "").filter(Boolean)
    ),
  ];
  const districts = [
    ...new Set(
      units
        .map((unit) => unit.district_name || unit.district || "")
        .filter(Boolean)
    ),
  ];
  const types = [
    ...new Set(
      units.map((unit) => (unit.type || "").toLowerCase()).filter(Boolean)
    ),
  ];

  const handleEditUnit = async (unit) => {
    if (!unit?.id) return;

    setEditingUnit(unit);
    setShowEditForm(true);
    setIsFetchingUnit(true);

    try {
      const detailedUnit = await dispatch(fetchUnitById(unit.id)).unwrap();
      if (detailedUnit) {
        setEditingUnit(detailedUnit);
      }
    } catch (err) {
      console.error("Failed to fetch unit details:", err);
      toast.error(
        direction === "rtl"
          ? "تعذر تحميل بيانات الوحدة"
          : "Unable to load unit details"
      );
    } finally {
      setIsFetchingUnit(false);
    }
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditingUnit(null);
    setIsFetchingUnit(false);
  };

  const handleSaveUnit = async (unitData) => {
    try {
      await dispatch(updateUnit(unitData)).unwrap();
      toast.success(
        direction === "rtl"
          ? "تم تحديث الوحدة بنجاح"
          : "Unit updated successfully"
      );
      setShowEditForm(false);
      setEditingUnit(null);
      await dispatch(fetchUnits());
    } catch (err) {
      console.error("Failed to update unit:", err);
      toast.error(
        direction === "rtl" ? "تعذر تحديث الوحدة" : "Unable to update unit"
      );
    }
  };
  const filteredUnits = units.filter((unit) => {
    const unitName = unit.name || "";
    const locationText = unit.location_text || "";
    const tenantName = unit.current_tenant_name || "";
    const cityName = unit.city_name || unit.city || "";
    const districtName = unit.district_name || unit.district || "";
    const unitType = (unit.type || "").toLowerCase();
    const unitStatus = (unit.status || "").toLowerCase();

    const matchesSearch =
      unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locationText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenantName &&
        tenantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      districtName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      unitStatus === statusFilter.toLowerCase() ||
      (statusFilter === "maintenance" && unitStatus === "in_maintenance");

    const matchesType =
      typeFilter === "all" || unitType === typeFilter.toLowerCase();
    const matchesCity = cityFilter === "all" || cityName === cityFilter;
    const matchesDistrict =
      districtFilter === "all" || districtName === districtFilter;

    // Date filtering logic
    let matchesDate = true;
    if (fromDate || toDate) {
      const leaseStart = unit.lease_start;
      if (leaseStart) {
        const unitDate = new Date(leaseStart);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from && to) {
          matchesDate = unitDate >= from && unitDate <= to;
        } else if (from) {
          matchesDate = unitDate >= from;
        } else if (to) {
          matchesDate = unitDate <= to;
        }
      }
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesCity &&
      matchesDistrict &&
      matchesDate
    );
  });

  if (isLoading && units.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  const statusColors = {
    available:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    occupied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    in_maintenance:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    maintenance:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      available: direction === "rtl" ? "متاح" : "Available",
      occupied: direction === "rtl" ? "مؤجر" : "Occupied",
      in_maintenance: direction === "rtl" ? "صيانة" : "Maintenance",
      maintenance: direction === "rtl" ? "صيانة" : "Maintenance",
    };
    return statusMap[status?.toLowerCase()] || status;
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {t("units.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            {t("units.manageUnits")}
          </p>
        </div>
        <Button
          className="mt-6 sm:mt-0 shadow-sm hover:shadow-md transition-shadow"
          onClick={() => {
            setEditingUnit(null);
            setShowForm(true);
          }}
        >
          <Plus
            className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
          />
          {t("units.addUnit")}
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search
                className={`absolute ${
                  direction === "rtl" ? "right-3" : "left-3"
                } top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`}
              />
              <input
                type="text"
                placeholder={t("common.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${
                  direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                } py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200`}
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {direction === "rtl" ? "الحالة" : "Status"}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                >
                  <option value="all">
                    {direction === "rtl" ? "جميع الحالات" : "All Status"}
                  </option>
                  <option value="available">
                    {direction === "rtl" ? "متاح" : "Available"}
                  </option>
                  <option value="occupied">
                    {direction === "rtl" ? "مؤجر" : "Occupied"}
                  </option>
                  <option value="maintenance">
                    {direction === "rtl" ? "صيانة" : "Maintenance"}
                  </option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {direction === "rtl" ? "نوع الوحدة" : "Unit Type"}
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                >
                  <option value="all">
                    {direction === "rtl" ? "جميع الأنواع" : "All Types"}
                  </option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {direction === "rtl"
                        ? type === "apartment"
                          ? "شقة"
                          : type === "villa"
                          ? "فيلا"
                          : type === "office"
                          ? "مكتب"
                          : type === "shop"
                          ? "محل"
                          : type === "studio"
                          ? "استوديو"
                          : type === "penthouse"
                          ? "بنتهاوس"
                          : type === "warehouse"
                          ? "مستودع"
                          : type === "retail"
                          ? "تجاري"
                          : type
                        : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

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
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setCityFilter("all");
                    setDistrictFilter("all");
                    setFromDate("");
                    setToDate("");
                  }}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {direction === "rtl" ? "مسح الفلاتر" : "Clear Filters"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map((unit, index) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Card className="overflow-hidden p-0 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 group">
              <div className="relative overflow-hidden">
                <img
                  src={
                    unit.cover_image ||
                    unit.images?.[0] ||
                    "https://via.placeholder.com/300x200"
                  }
                  alt={unit.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div
                  className={`absolute top-4 ${
                    direction === "rtl" ? "left-4" : "right-4"
                  }`}
                >
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                      statusColors[unit.status?.toLowerCase()] ||
                      statusColors.available
                    }`}
                  >
                    {getStatusLabel(unit.status)}
                  </span>
                </div>
                <div
                  className={`absolute bottom-4 ${
                    direction === "rtl" ? "right-4" : "left-4"
                  }`}
                >
                  <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
                    {direction === "rtl"
                      ? (unit.type || "").toLowerCase() === "apartment"
                        ? "شقة"
                        : (unit.type || "").toLowerCase() === "villa"
                        ? "فيلا"
                        : (unit.type || "").toLowerCase() === "office"
                        ? "مكتب"
                        : (unit.type || "").toLowerCase() === "shop"
                        ? "محل"
                        : (unit.type || "").toLowerCase() === "studio"
                        ? "استوديو"
                        : (unit.type || "").toLowerCase() === "penthouse"
                        ? "بنتهاوس"
                        : (unit.type || "").toLowerCase() === "warehouse"
                        ? "مستودع"
                        : (unit.type || "").toLowerCase() === "retail"
                        ? "تجاري"
                        : unit.type
                      : (unit.type || "").charAt(0).toUpperCase() +
                        (unit.type || "").slice(1).toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {unit.name}
                  </h3>
                  {unit.price_per_day && (
                    <div
                      className={`${
                        direction === "rtl" ? "text-left" : "text-right"
                      }`}
                    >
                      <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        ${parseFloat(unit.price_per_day).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t("units.perDay") || "/day"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Location Info */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {direction === "rtl" ? "الموقع" : "Location"}:
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {unit.district_name || unit.district},{" "}
                      {unit.city_name || unit.city}
                    </div>
                  </div>
                  {unit.location_text && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {unit.location_text}
                    </div>
                  )}
                </div>

                {unit.current_tenant_name &&
                  (unit.status?.toLowerCase() === "occupied" ||
                    unit.status?.toLowerCase() === "in_maintenance") && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t("units.currentTenant") || "Current Tenant"}:
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {unit.current_tenant_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                {unit.status?.toLowerCase() === "available" && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                          {direction === "rtl"
                            ? "متاحة للإيجار"
                            : "Available for Rent"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {unit.status?.toLowerCase() === "occupied" && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <UserCheck className="w-4 h-4 text-blue-500" />
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                          {direction === "rtl" ? "مؤجرة" : "Occupied"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {(unit.status?.toLowerCase() === "maintenance" ||
                  unit.status?.toLowerCase() === "in_maintenance") && (
                  <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Wrench className="w-4 h-4 text-amber-500" />
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                          {direction === "rtl"
                            ? "تحت الصيانة"
                            : "Under Maintenance"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Link to={`/units/${unit.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    >
                      <Eye
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {t("units.view") || "View"}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={t("units.edit") || "Edit"}
                    onClick={() => handleEditUnit(unit)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                    title={t("units.delete") || "Delete"}
                    onClick={() => handleDelete(unit.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredUnits.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mb-4">
            <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {direction === "rtl" ? "لا توجد وحدات" : "No Units Found"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mb-4">
            {direction === "rtl"
              ? "لم يتم العثور على وحدات تطابق معايير البحث المحددة"
              : "No units match the specified search criteria"}
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
      {/* Unit Edit Form */}
      {showEditForm && editingUnit && (
        <UnitForm
          unit={editingUnit}
          onSave={handleSaveUnit}
          onCancel={handleCloseEditForm}
          isEdit={true}
        />
      )}
    </div>
  );
};

export default Units;
