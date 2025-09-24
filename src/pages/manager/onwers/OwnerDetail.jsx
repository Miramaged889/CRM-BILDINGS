import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Home,
  Star,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  Search,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import {
  OwnerForm,
} from "../../../components/forms/manger form";

const OwnerDetail = () => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  const mockOwners = [
    {
      id: 1,
      name: "Ahmed Ali",
      email: "ahmed@example.com",
      phone: "+201234567890",
      address: "123 Main Street, Cairo, Egypt",
      dateJoined: "2020-01-15",
      buildingsCount: 3,
      units: 28,
      rating: 4.6,
      totalRevenue: 125000,
      monthlyRevenue: 8500,
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      buildings: [
        {
          id: 1,
          name: "Sunset Tower",
          address: "Downtown, Cairo",
          units: 12,
          occupiedUnits: 10,
          monthlyRevenue: 4500,
        },
        {
          id: 2,
          name: "Palm Residency",
          address: "New Cairo",
          units: 8,
          occupiedUnits: 6,
          monthlyRevenue: 2500,
        },
        {
          id: 3,
          name: "Nile Heights",
          address: "Zamalek, Cairo",
          units: 8,
          occupiedUnits: 7,
          monthlyRevenue: 1500,
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
      buildingsCount: 1,
      units: 12,
      rating: 4.2,
      totalRevenue: 45000,
      monthlyRevenue: 3200,
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      buildings: [
        {
          id: 4,
          name: "Garden Plaza",
          address: "Garden City, Cairo",
          units: 12,
          occupiedUnits: 10,
          monthlyRevenue: 3200,
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchOwner = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundOwner = mockOwners.find((o) => o.id === parseInt(id));
      setOwner(foundOwner);
      setLoading(false);
    };

    fetchOwner();
  }, [id]);

  const handleEdit = () => {
    setShowForm(true);
  };


  const handleDelete = () => {
    if (
      window.confirm(
        direction === "rtl"
          ? "هل أنت متأكد من حذف هذا المالك؟"
          : "Are you sure you want to delete this owner?"
      )
    ) {
      console.log("Delete owner:", owner);
      navigate("/owners");
      // In real app, this would call API to delete
    }
  };

  const handleSaveOwner = (ownerData) => {
    console.log("Saving owner:", ownerData);
    setOwner(ownerData);
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };


  const filteredBuildings =
    owner?.buildings?.filter((building) =>
      [building.name, building.address].some((v) =>
        v.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (!owner) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {direction === "rtl" ? "المالك غير موجود" : "Owner Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {direction === "rtl"
              ? "المالك المطلوب غير موجود أو تم حذفه"
              : "The requested owner was not found or has been deleted"}
          </p>
          <Button onClick={() => navigate("/owners")}>
            <ArrowLeft
              className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {direction === "rtl" ? "العودة للملاك" : "Back to Owners"}
          </Button>
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
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              {owner.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              {direction === "rtl" ? "معلومات المالك" : "Owner Information"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="flex items-center"
          >
            <Trash2
              className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {direction === "rtl" ? "حذف" : "Delete"}
          </Button>
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
                {direction === "rtl" ? "إجمالي المباني" : "Total Buildings"}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {owner.buildingsCount}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "إجمالي الوحدات" : "Total Units"}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {owner.units}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Home className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "التقييم" : "Rating"}
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {owner.rating}
              </p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
              <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "الإيراد الشهري" : "Monthly Revenue"}
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${owner.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Owner Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Owner Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User
                className={`h-5 w-5 ${
                  direction === "rtl" ? "ml-2" : "mr-2"
                } text-blue-600`}
              />
              {direction === "rtl" ? "معلومات المالك" : "Owner Details"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "الاسم" : "Name"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {owner.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "البريد الإلكتروني" : "Email"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {owner.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "رقم الهاتف" : "Phone"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {owner.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "تاريخ الانضمام" : "Date Joined"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(owner.dateJoined).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {direction === "rtl" ? "العنوان" : "Address"}
              </label>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                {owner.address}
              </p>
            </div>
          </Card>

          {/* Buildings List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Building2
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-green-600`}
                />
                {direction === "rtl" ? "قائمة المباني" : "Buildings List"}
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
                      ? "بحث في المباني..."
                      : "Search buildings..."
                  }
                  className={`${
                    direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                  }`}
                />
              </div>
            </div>
            <div className="space-y-3">
              {filteredBuildings.map((building) => (
                <div
                  key={building.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {building.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {building.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {direction === "rtl" ? "الوحدات" : "Units"}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {building.occupiedUnits}/{building.units}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {direction === "rtl"
                        ? "الإيراد الشهري"
                        : "Monthly Revenue"}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${building.monthlyRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Avatar */}
          <Card className="p-6">
            <div className="text-center">
              <img
                src={owner.avatar}
                alt={owner.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {owner.name}
              </h3>
              <div className="flex items-center justify-center text-amber-500 mt-2">
                <Star className="h-4 w-4" />
                <span className="ml-1">{owner.rating}</span>
              </div>
            </div>
          </Card>

          {/* Revenue Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp
                className={`h-5 w-5 ${
                  direction === "rtl" ? "ml-2" : "mr-2"
                } text-purple-600`}
              />
              {direction === "rtl" ? "ملخص الإيرادات" : "Revenue Summary"}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {direction === "rtl" ? "الإيراد الشهري" : "Monthly Revenue"}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${owner.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {direction === "rtl" ? "إجمالي الإيرادات" : "Total Revenue"}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${owner.totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Forms */}
      {showForm && (
        <OwnerForm
          owner={owner}
          onSave={handleSaveOwner}
          onCancel={handleCloseForm}
          isEdit={true}
        />
      )}

    </div>
  );
};

export default OwnerDetail;
