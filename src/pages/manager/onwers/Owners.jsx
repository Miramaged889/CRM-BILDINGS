import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../stores/languageStore";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchOwners, createOwner, updateOwner, deleteOwner } from "../../../store/slices/ownersSlice";
import {
  Search,
  Plus,
  Phone,
  Mail,
  User,
  Building2,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { OwnerForm } from "../../../components/manger form";
import toast from "react-hot-toast";

const Owners = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { owners, isLoading, error } = useAppSelector((state) => state.owners);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);

  // Fetch owners on mount
  useEffect(() => {
    dispatch(fetchOwners());
  }, [dispatch]);

  const filtered =
    owners?.filter((o) => {
      const fullName = o.full_name || o.name || "";
      const email = o.email || "";
      const phone = o.phone || "";
      const address = o.address || "";

      return [fullName, email, phone, address].some((v) =>
        v.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

  const handleViewDetails = (owner, event) => {
    event.stopPropagation();
    navigate(`/owners/${owner.id}`);
  };

  const handleEdit = (owner, event) => {
    event.stopPropagation();
    setEditingOwner(owner);
    setShowForm(true);
  };

  const handleDelete = async (owner, event) => {
    event.stopPropagation();
    if (
      window.confirm(
        direction === "rtl"
          ? "هل أنت متأكد من حذف هذا المالك؟"
          : "Are you sure you want to delete this owner?"
      )
    ) {
      try {
        await dispatch(deleteOwner(owner.id)).unwrap();
        toast.success(t("owners.deleteSuccess") || "Owner deleted successfully");
        dispatch(fetchOwners()); // Refresh list
      } catch (err) {
        toast.error(err || "Failed to delete owner");
      }
    }
  };

  const handleCardClick = (owner) => {
    navigate(`/owners/${owner.id}`);
  };

  const handleAddNew = () => {
    setEditingOwner(null);
    setShowForm(true);
  };

  const handleSaveOwner = async (ownerData) => {
    try {
      if (editingOwner) {
        // Update owner - map form data to API format
        const updateData = {
          full_name: ownerData.name,
          email: ownerData.email,
          phone: ownerData.phone,
          address: ownerData.address || "",
        };
        await dispatch(updateOwner({ id: editingOwner.id, data: updateData })).unwrap();
        toast.success(t("owners.updateSuccess") || "Owner updated successfully");
      } else {
        // Create owner - map form data to API format
        const createData = {
          full_name: ownerData.name,
          email: ownerData.email,
          phone: ownerData.phone,
          address: ownerData.address || "",
        };
        await dispatch(createOwner(createData)).unwrap();
        toast.success(t("owners.createSuccess") || "Owner created successfully");
      }
      setShowForm(false);
      setEditingOwner(null);
      dispatch(fetchOwners()); // Refresh list
    } catch (err) {
      toast.error(err || (editingOwner ? "Failed to update" : "Failed to create"));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOwner(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {direction === "rtl" ? "المالكون" : "Owners"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            {direction === "rtl"
              ? "إدارة ملاك العقارات"
              : "Manage property owners"}
          </p>
        </div>
        <Button
          className="mt-6 sm:mt-0 shadow-sm hover:shadow-md transition-shadow"
          onClick={handleAddNew}
        >
          <Plus
            className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
          />
          {direction === "rtl" ? "إضافة مالك" : "Add Owner"}
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
              placeholder={
                direction === "rtl" ? "بحث في الملاك..." : "Search owners..."
              }
              className={`${direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"}`}
            />
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Owners Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((o, index) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 + 0.1 }}
            >
              <Card
                className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 cursor-pointer hover:scale-105"
                onClick={() => handleCardClick(o)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex items-center ${
                      direction === "rtl" ? "space-x-reverse" : ""
                    } space-x-3`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {(o.full_name || o.name || '').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {o.full_name || o.name}
                      </h3>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                    <Building2
                      className={`h-3 w-3 ${
                        direction === "rtl" ? "ml-1" : "mr-1"
                      } inline`}
                    />
                    {o.units_count || o.units || 0} {direction === "rtl" ? "وحدات" : "units"}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className={`${direction === "rtl" ? "mr-2" : "ml-2"}`}>
                      {o.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className={`${direction === "rtl" ? "mr-2" : "ml-2"}`}>
                      {o.phone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className={`${direction === "rtl" ? "mr-2" : "ml-2"}`}>
                      {o.units_count || o.units || 0} {direction === "rtl" ? "وحدات" : "units"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleViewDetails(o, e)}
                    className="flex-1"
                  >
                    <Eye
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {direction === "rtl" ? "عرض" : "View"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleEdit(o, e)}
                  >
                    <Edit
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {direction === "rtl" ? "تعديل" : "Edit"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleDelete(o, e)}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2
                      className={`h-4 w-4 text-red-500 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {direction === "rtl" ? "حذف" : "Delete"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mb-4">
            <User className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {direction === "rtl" ? "لا يوجد ملاك" : "No Owners Found"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            {direction === "rtl"
              ? "جرب البحث بكلمات مختلفة"
              : "Try searching with different keywords"}
          </p>
        </motion.div>
      )}

      {/* Forms */}
      {showForm && (
        <OwnerForm
          owner={editingOwner}
          onSave={handleSaveOwner}
          onCancel={handleCloseForm}
          isEdit={!!editingOwner}
        />
      )}
    </div>
  );
};

export default Owners;
