import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../stores/languageStore";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Phone,
  Mail,
  User,
  Building2,
  Star,
  Edit,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { OwnerForm } from "../../../components/manger form";

const Owners = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [editingOwner, setEditingOwner] = useState(null);

  const owners = [
    {
      id: 1,
      name: "Ahmed Ali",
      email: "ahmed@example.com",
      phone: "+201234567890",
      address: "123 Main Street, Cairo, Egypt",
      dateJoined: "2020-01-15",
      buildings: 3,
      units: 28,
      rating: 4.6,
      totalRevenue: 125000,
      monthlyRevenue: 8500,
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      contracts: [
        {
          id: 1,
          contractNumber: "CON-001",
          status: "active",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
        },
        {
          id: 2,
          contractNumber: "CON-002",
          status: "active",
          startDate: "2024-02-15",
          endDate: "2025-02-14",
        },
        {
          id: 3,
          contractNumber: "CON-003",
          status: "expired",
          startDate: "2023-06-01",
          endDate: "2024-05-31",
        },
      ],
    },
    {
      id: 2,
      name: "Mona Hassan",
      email: "mona@example.com",
      phone: "+201112223334",
      address: "456 Garden City, Cairo, Egypt",
      dateJoined: "2021-03-20",
      buildings: 1,
      units: 12,
      rating: 4.2,
      totalRevenue: 45000,
      monthlyRevenue: 3200,
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      contracts: [
        {
          id: 4,
          contractNumber: "CON-004",
          status: "active",
          startDate: "2024-03-01",
          endDate: "2025-02-28",
        },
        {
          id: 5,
          contractNumber: "CON-005",
          status: "expired",
          startDate: "2023-09-15",
          endDate: "2024-09-14",
        },
      ],
    },
    {
      id: 3,
      name: "Omar Khalil",
      email: "omar@example.com",
      phone: "+201998887766",
      address: "789 New Cairo, Egypt",
      dateJoined: "2022-06-10",
      buildings: 2,
      units: 16,
      rating: 4.8,
      totalRevenue: 75000,
      monthlyRevenue: 5200,
      avatar:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      contracts: [
        {
          id: 6,
          contractNumber: "CON-006",
          status: "active",
          startDate: "2024-01-15",
          endDate: "2025-01-14",
        },
        {
          id: 7,
          contractNumber: "CON-007",
          status: "active",
          startDate: "2024-05-01",
          endDate: "2025-04-30",
        },
        {
          id: 8,
          contractNumber: "CON-008",
          status: "expired",
          startDate: "2023-08-01",
          endDate: "2024-07-31",
        },
      ],
    },
  ];

  // Get unique ratings for filter options
  const ratings = [
    ...new Set(owners.map((owner) => Math.floor(owner.rating))),
  ].sort((a, b) => b - a);

  const filtered = owners.filter((o) => {
    const matchesSearch = [o.name, o.email, o.phone, o.address].some((v) =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRating =
      ratingFilter === "all" || Math.floor(o.rating) === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  const handleView = (owner) => {
    setSelectedOwner(owner);
    setShowViewModal(true);
  };

  const handleEdit = (owner, event) => {
    event.stopPropagation();
    setEditingOwner(owner);
    setShowForm(true);
  };

  const handleDelete = (owner, event) => {
    event.stopPropagation();
    if (
      window.confirm(
        direction === "rtl"
          ? "هل أنت متأكد من حذف هذا المالك؟"
          : "Are you sure you want to delete this owner?"
      )
    ) {
      console.log("Delete owner:", owner);
      // In real app, this would call API to delete
    }
  };

  const handleCardClick = (owner) => {
    navigate(`/owners/${owner.id}`);
  };

  const handleViewDetails = (owner, event) => {
    event.stopPropagation();
    navigate(`/owners/${owner.id}`);
  };

  const handleAddNew = () => {
    setEditingOwner(null);
    setShowForm(true);
  };

  const handleSaveOwner = (ownerData) => {
    console.log("Saving owner:", ownerData);
    setShowForm(false);
    setEditingOwner(null);
    // In real app, this would call API to save
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOwner(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedOwner(null);
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
                  <img
                    src={o.avatar}
                    alt={o.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {o.name}
                    </h3>
                    <div className="flex items-center text-amber-500 text-sm">
                      <Star className="h-4 w-4" />
                      <span
                        className={`${direction === "rtl" ? "mr-1" : "ml-1"}`}
                      >
                        {o.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                  <Building2
                    className={`h-3 w-3 ${
                      direction === "rtl" ? "ml-1" : "mr-1"
                    } inline`}
                  />
                  {o.buildings} {direction === "rtl" ? "مباني" : "buildings"}
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
                    {o.units} {direction === "rtl" ? "وحدات" : "units"}
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

      {filtered.length === 0 && (
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
