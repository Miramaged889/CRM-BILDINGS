import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../stores/languageStore";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchCities,
  fetchDistricts,
  createCity,
  updateCity,
  deleteCity,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  clearError,
  clearDistricts,
} from "../../store/slices/citiesSlice";
import { Search, Plus, Edit, Trash2, MapPin, Map } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";
import { CitiesAndDistrictsForm } from "../../components/manger form";

const CitiesAndDistricts = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const dispatch = useAppDispatch();
  const { cities, districts, isLoading, error } = useAppSelector(
    (state) => state.cities
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("cities"); // "cities" or "districts"
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Fetch all districts when switching to districts tab
  useEffect(() => {
    if (activeTab === "districts" && districts.length === 0) {
      dispatch(fetchDistricts());
    }
  }, [activeTab, dispatch, districts.length]);

  const handleDelete = async (item, type) => {
    if (
      window.confirm(
        direction === "rtl"
          ? `هل أنت متأكد من حذف ${type === "city" ? "المدينة" : "الحي"}؟`
          : `Are you sure you want to delete this ${type}?`
      )
    ) {
      try {
        if (type === "city") {
          await dispatch(deleteCity(item.id)).unwrap();
          toast.success(
            direction === "rtl"
              ? "تم حذف المدينة بنجاح"
              : "City deleted successfully"
          );
        } else {
          await dispatch(deleteDistrict(item.id)).unwrap();
          toast.success(
            direction === "rtl"
              ? "تم حذف الحي بنجاح"
              : "District deleted successfully"
          );
        }
      } catch (err) {
        toast.error(err || "Failed to delete");
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSave = async (data, type) => {
    try {
      if (editingItem) {
        if (type === "city") {
          await dispatch(updateCity({ id: editingItem.id, data })).unwrap();
          toast.success(
            direction === "rtl"
              ? "تم تحديث المدينة بنجاح"
              : "City updated successfully"
          );
        } else {
          await dispatch(updateDistrict({ id: editingItem.id, data })).unwrap();
          toast.success(
            direction === "rtl"
              ? "تم تحديث الحي بنجاح"
              : "District updated successfully"
          );
        }
      } else {
        if (type === "city") {
          await dispatch(createCity(data)).unwrap();
          toast.success(
            direction === "rtl"
              ? "تم إضافة المدينة بنجاح"
              : "City added successfully"
          );
        } else {
          await dispatch(createDistrict(data)).unwrap();
          toast.success(
            direction === "rtl"
              ? "تم إضافة الحي بنجاح"
              : "District added successfully"
          );
        }
      }
      setShowForm(false);
      setEditingItem(null);

      // Refresh lists
      dispatch(fetchCities());
      if (activeTab === "districts") {
        dispatch(fetchDistricts());
      }
    } catch (err) {
      toast.error(err || "Failed to save");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // Filter data based on search term
  const filteredItems =
    activeTab === "cities"
      ? cities.filter((item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : districts.filter(
          (item) =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.city_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

  if (isLoading && cities.length === 0 && districts.length === 0) {
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
            {direction === "rtl" ? "المدن والأحياء" : "Cities & Districts"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            {direction === "rtl"
              ? "إدارة المدن والأحياء"
              : "Manage cities and districts"}
          </p>
        </div>
        <Button
          className="mt-6 sm:mt-0 shadow-sm hover:shadow-md transition-shadow"
          onClick={handleAdd}
        >
          <Plus
            className={`h-5 w-5 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
          />
          {direction === "rtl"
            ? activeTab === "cities"
              ? "إضافة مدينة"
              : "إضافة حي"
            : activeTab === "cities"
            ? "Add City"
            : "Add District"}
        </Button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              setActiveTab("cities");
              setSearchTerm("");
              setShowForm(false);
              setEditingItem(null);
            }}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === "cities"
                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-b-2 border-primary-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{direction === "rtl" ? "المدن" : "Cities"}</span>
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {cities.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab("districts");
              setSearchTerm("");
              setShowForm(false);
              setEditingItem(null);
            }}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === "districts"
                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-b-2 border-primary-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Map className="h-5 w-5" />
              <span>{direction === "rtl" ? "الأحياء" : "Districts"}</span>
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {districts.length}
              </span>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={direction === "rtl" ? "ابحث..." : "Search..."}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                {activeTab === "cities" ? (
                  <MapPin className="h-8 w-8 text-gray-400" />
                ) : (
                  <Map className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {direction === "rtl"
                  ? activeTab === "cities"
                    ? "لا توجد مدن"
                    : "لا توجد أحياء"
                  : activeTab === "cities"
                  ? "No cities found"
                  : "No districts found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                        {activeTab === "cities" ? (
                          <MapPin className="h-4 w-4 text-white" />
                        ) : (
                          <Map className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        {activeTab === "districts" && item.city_name && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.city_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={direction === "rtl" ? "تعديل" : "Edit"}
                      >
                        <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(item, activeTab)}
                        className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title={direction === "rtl" ? "حذف" : "Delete"}
                      >
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Form Modal */}
      {showForm && (
        <CitiesAndDistrictsForm
          type={activeTab === "cities" ? "city" : "district"}
          item={editingItem}
          cities={cities}
          onSave={(data) =>
            handleSave(data, activeTab === "cities" ? "city" : "district")
          }
          onCancel={handleCloseForm}
          isEdit={!!editingItem}
        />
      )}
    </div>
  );
};

export default CitiesAndDistricts;
