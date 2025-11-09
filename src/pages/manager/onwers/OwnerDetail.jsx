import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchOwnerById,
  updateOwner,
  deleteOwner,
} from "../../../store/slices/ownersSlice";
import { fetchUnitById } from "../../../store/slices/unitsSlice";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Home,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  Search,
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { OwnerForm } from "../../../components/manger form";
import toast from "react-hot-toast";

const OwnerDetail = () => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentOwner, isLoading, error } = useAppSelector(
    (state) => state.owners
  );

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [unitsDetails, setUnitsDetails] = useState({});
  const [loadingUnits, setLoadingUnits] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchOwnerById(id));
    }
  }, [dispatch, id]);

  // Fetch unit details for each unit in the owner's units list
  useEffect(() => {
    const fetchUnitsDetails = async () => {
      if (currentOwner?.units && currentOwner.units.length > 0) {
        setLoadingUnits(true);
        try {
          const unitPromises = currentOwner.units.map(async (unit) => {
            try {
              const result = await dispatch(
                fetchUnitById(unit.id || unit.unit_id)
              ).unwrap();
              return { id: unit.id || unit.unit_id, data: result };
            } catch (error) {
              console.error(`Failed to fetch unit ${unit.id}:`, error);
              return { id: unit.id || unit.unit_id, data: unit }; // Fallback to original data
            }
          });
          const results = await Promise.all(unitPromises);
          const unitsMap = {};
          results.forEach(({ id, data }) => {
            unitsMap[id] = data;
          });
          setUnitsDetails(unitsMap);
        } catch (error) {
          console.error("Error fetching units details:", error);
        } finally {
          setLoadingUnits(false);
        }
      }
    };

    if (currentOwner?.units) {
      fetchUnitsDetails();
    }
  }, [currentOwner?.units, dispatch]);

  const handleEdit = () => {
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        direction === "rtl"
          ? "هل أنت متأكد من حذف هذا المالك؟"
          : "Are you sure you want to delete this owner?"
      )
    ) {
      try {
        await dispatch(deleteOwner(id)).unwrap();
        toast.success(
          t("owners.deleteSuccess") || "Owner deleted successfully"
        );
        navigate("/owners");
      } catch (err) {
        toast.error(err || "Failed to delete owner");
      }
    }
  };

  const handleSaveOwner = async (ownerData) => {
    try {
      const updateData = {
        full_name: ownerData.name,
        email: ownerData.email,
        phone: ownerData.phone,
        address: ownerData.address || "",
      };
      await dispatch(
        updateOwner({ id: currentOwner.id, data: updateData })
      ).unwrap();
      toast.success(t("owners.updateSuccess") || "Owner updated successfully");
      setShowForm(false);
      // Refresh owner data
      dispatch(fetchOwnerById(id));
    } catch (err) {
      toast.error(err || "Failed to update owner");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Filter units based on search - use detailed unit data if available
  const filteredUnits = React.useMemo(() => {
    if (!currentOwner?.units) return [];

    return currentOwner.units
      .map((unit) => {
        const unitId = unit.id || unit.unit_id;
        const detailedUnit = unitsDetails[unitId] || unit;
        return { ...unit, ...detailedUnit };
      })
      .filter((unit) => {
        const searchFields = [
          unit.name,
          unit.unit_name,
          unit.address,
          unit.city_name,
          unit.district_name,
          unit.city?.name,
          unit.district?.name,
        ];
        return searchFields.some((v) =>
          v?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  }, [currentOwner?.units, unitsDetails, searchTerm]);

  if (isLoading) {
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

  if (error || !currentOwner) {
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

  const owner = currentOwner;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/owners")}
            className="flex items-center"
          >
            <ArrowLeft
              className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {direction === "rtl" ? "رجوع" : "Back"}
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              {owner.full_name || owner.name}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "إجمالي الوحدات" : "Total Units"}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {owner.units_count || owner.units || 0}
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
                {direction === "rtl" ? "إجمالي الإيرادات" : "Total Revenue"}
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                $
                {parseFloat(
                  owner.total_revenue || owner.totalRevenue || 0
                ).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "الإيراد الشهري" : "Monthly Revenue"}
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                $
                {parseFloat(
                  owner.monthly_revenue || owner.monthlyRevenue || 0
                ).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                  {owner.full_name || owner.name}
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
                  {owner.date_joined || owner.dateJoined
                    ? new Date(
                        owner.date_joined || owner.dateJoined
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
            {owner.address && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "العنوان" : "Address"}
                </label>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {owner.address}
                </p>
              </div>
            )}
          </Card>

          {/* Units List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Building2
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-green-600`}
                />
                {direction === "rtl" ? "قائمة الوحدات" : "Units List"} (
                {filteredUnits.length})
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
              {loadingUnits && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {direction === "rtl"
                      ? "جاري تحميل الوحدات..."
                      : "Loading units..."}
                  </p>
                </div>
              )}
              {!loadingUnits &&
                filteredUnits.map((unit) => {
                  const unitId = unit.id || unit.unit_id;
                  const unitName =
                    unit.name || unit.unit_name || `Unit ${unitId}`;
                  const unitAddress =
                    unit.address ||
                    (unit.city_name && unit.district_name
                      ? `${unit.city_name}, ${unit.district_name}`
                      : "") ||
                    (unit.city?.name && unit.district?.name
                      ? `${unit.city.name}, ${unit.district.name}`
                      : "") ||
                    "";
                  const unitPhoto =
                    unit.cover_photo || unit.cover_image || unit.image;
                  const unitStatus =
                    unit.status || unit.unit_status || "available";
                  const unitRentPrice =
                    unit.rent_price || unit.price || unit.rent;
                  const unitLocationUrl =
                    unit.location_url || unit.location || unit.map_url;

                  return (
                    <div
                      key={unitId}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                      onClick={() => navigate(`/units/${unitId}`)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                          {unitPhoto ? (
                            <img
                              src={unitPhoto}
                              alt={unitName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                const placeholder = e.target.nextElementSibling;
                                if (placeholder)
                                  placeholder.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full flex items-center justify-center ${
                              unitPhoto ? "hidden" : ""
                            }`}
                          >
                            <Building2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {unitName}
                          </h4>
                          {unitAddress && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {unitAddress}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                unitStatus === "available"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                              }`}
                            >
                              {unitStatus === "available"
                                ? direction === "rtl"
                                  ? "متاح"
                                  : "Available"
                                : direction === "rtl"
                                ? "مؤجر"
                                : "Rented"}
                            </span>
                            {unitRentPrice && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                ${parseFloat(unitRentPrice).toLocaleString()}
                                {direction === "rtl" ? "/شهر" : "/month"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {unitLocationUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(unitLocationUrl, "_blank");
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}

              {filteredUnits.length === 0 && (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {direction === "rtl"
                      ? "لا توجد وحدات مطابقة للبحث"
                      : "No units match your search"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Summary */}
          <Card className="p-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                {(owner.full_name || owner.name || "").charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {owner.full_name || owner.name}
              </h3>
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
                  $
                  {parseFloat(
                    owner.monthly_revenue || owner.monthlyRevenue || 0
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {direction === "rtl" ? "إجمالي الإيرادات" : "Total Revenue"}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  $
                  {parseFloat(
                    owner.total_revenue || owner.totalRevenue || 0
                  ).toLocaleString()}
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
