import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../stores/languageStore";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchUnitById,
  fetchUnitPayments,
  clearError,
  clearCurrentUnit,
} from "../../../store/slices/unitsSlice";
import {
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Home,
  Camera,
  Phone,
  Mail,
  Bed,
  Bath,
  Square,
  Building,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import ReservationForm from "../../../components/manger form/ReservationForm";
import toast from "react-hot-toast";
import { UnitForm } from "../../../components/manger form";

const UnitDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUnit, unitPayments, isLoading, error } = useAppSelector(
    (state) => state.units
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Fetch unit data on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchUnitById(id));
      dispatch(fetchUnitPayments(id));
    }

    // Clear unit data when leaving
    return () => {
      dispatch(clearCurrentUnit());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleEditUnit = () => {
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const handleSaveUnit = async (unitData) => {
    try {
      setShowEditForm(false);
      // Refresh unit data
      dispatch(fetchUnitById(id));
    } catch (err) {
      // Error handled by UnitForm
    }
  };

  // Function to get localized unit type
  const getLocalizedUnitType = (type) => {
    if (direction === "rtl") {
      const typeMap = {
        apartment: "شقة",
        villa: "فيلا",
        office: "مكتب",
        shop: "محل",
        studio: "استوديو",
        penthouse: "بنتهاوس",
        warehouse: "مستودع",
        retail: "تجاري",
      };
      return typeMap[type] || type;
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const statusColors = {
    available:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    occupied:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    maintenance:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
  };

  const paymentStatusColors = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300",
  };

  const handleReservationClick = () => {
    setShowReservationForm(true);
  };

  const handleCloseReservationForm = () => {
    setShowReservationForm(false);
  };

  const handleSaveReservation = async (reservationData) => {
    try {
      if (reservationData?.deleted) {
        // Rent was deleted
        toast.success(
          direction === "rtl"
            ? "تم حذف الإيجار بنجاح"
            : "Rent deleted successfully"
        );
      } else if (reservationData) {
        // Rent was created/updated successfully
        toast.success(
          direction === "rtl"
            ? "تم إنشاء الإيجار بنجاح"
            : "Rent created successfully"
        );
        // Refresh unit data to get updated rent_payment_history
        if (id) {
          await dispatch(fetchUnitById(id));
          await dispatch(fetchUnitPayments(id));
        }
      }
      setShowReservationForm(false);
    } catch (err) {
      console.error("Error handling reservation save:", err);
    }
  };

  // Get payments from both sources: unitPayments (Redux) and rent_payment_history (from unit data)
  const unitPaymentsList = Array.isArray(unitPayments)
    ? unitPayments
    : unitPayments?.results || unitPayments?.data || [];

  const rentPaymentHistory = currentUnit?.rent_payment_history || [];

  // Combine both payment sources and format them consistently
  const payments = React.useMemo(() => {
    const allPayments = [];

    // Add rent_payment_history payments
    if (rentPaymentHistory && Array.isArray(rentPaymentHistory)) {
      rentPaymentHistory.forEach((payment, index) => {
        allPayments.push({
          id: payment.id || `rent_${payment.date}_${payment.amount}_${index}`,
          amount: parseFloat(payment.amount || 0),
          date: payment.date,
          status: payment.status || "pending",
          type: "rent",
        });
      });
    }

    // Add unitPayments (occasional payments)
    if (unitPaymentsList && Array.isArray(unitPaymentsList)) {
      unitPaymentsList.forEach((payment, index) => {
        allPayments.push({
          id:
            payment.id ||
            `occasional_${payment.id || index}_${
              payment.payment_date || payment.date || ""
            }`,
          amount: parseFloat(payment.amount || 0),
          date: payment.payment_date || payment.date,
          status: payment.status || "paid",
          type: "occasional",
          category: payment.category,
          payment_method: payment.payment_method || payment.method,
        });
      });
    }

    // Remove duplicates based on unique id
    const uniquePayments = [];
    const seenIds = new Set();
    allPayments.forEach((payment) => {
      if (!seenIds.has(payment.id)) {
        seenIds.add(payment.id);
        uniquePayments.push(payment);
      }
    });

    // Sort by date (newest first)
    return uniquePayments.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB - dateA;
    });
  }, [rentPaymentHistory, unitPaymentsList]);

  // Loading state
  if (isLoading && !currentUnit) {
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

  // Error state
  if (!currentUnit) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {t("units.unitNotFound")}
          </p>
          <Button onClick={() => navigate("/units")}>
            {t("units.backToUnits")}
          </Button>
        </div>
      </div>
    );
  }

  const unit = currentUnit;
  const images = unit.images || [];

  // Extract data from details object or use direct properties
  const unitType = unit.details?.type || unit.type || "";
  const unitBedrooms = unit.details?.bedrooms || unit.bedrooms;
  const unitBathrooms = unit.details?.bathrooms || unit.bathrooms;
  const unitArea = unit.details?.area || unit.area;

  // Get city and district names (they might be IDs, so we'll display them as is for now)
  // If API provides city_name and district_name, use those, otherwise use the IDs
  const cityName =
    unit.city_name ||
    (typeof unit.city === "object" ? unit.city?.name : unit.city) ||
    "";
  const districtName =
    unit.district_name ||
    (typeof unit.district === "object" ? unit.district?.name : unit.district) ||
    "";

  // Get payment summaries
  const paymentsSummary = unit.payments_summary || {};
  const unitPaymentSummary = unit.unit_payment_summary || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 md:p-6 space-y-6">
        {/* Back button */}
        <Link to="/units">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft
              className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {t("units.backToUnits")}
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {t("units.unitDetails")} {unit.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      statusColors[unit.status?.toLowerCase()] ||
                      statusColors.available
                    }`}
                  >
                    {t(`units.${unit.status?.toLowerCase()}`) || unit.status}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 capitalize flex items-center">
                    <Building
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-1" : "mr-1"
                      }`}
                    />
                    {getLocalizedUnitType(unitType)}
                  </span>
                  {unit.price_per_day && (
                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                      <DollarSign
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      ${unit.price_per_day} {t("units.perDay")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleReservationClick}
                className="bg-green-600 hover:bg-green-700 text-white shadow-md flex-1 sm:flex-none"
              >
                <Calendar
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("units.newReservation")}
              </Button>
              <Button
                onClick={handleEditUnit}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md flex-1 sm:flex-none"
              >
                <Edit
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("units.editUnit")}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Image Gallery */}
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-0 overflow-hidden">
                  <div className="relative">
                    <img
                      src={images[selectedImageIndex]}
                      alt={`Unit ${unit.name}`}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                      <Camera className="h-4 w-4 mr-1" />
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-16 h-16 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Map Location */}
            {unit.location_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="p-0 overflow-hidden">
                  <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <MapPin
                        className={`h-5 w-5 ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        } text-red-600`}
                      />
                      {t("units.location")}
                    </h3>
                    <div className="space-y-3">
                      {unit.location_text && (
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 font-medium">
                            {unit.location_text}
                          </p>
                        </div>
                      )}
                      {(districtName || cityName) && (
                        <div className="flex flex-wrap gap-2">
                          {cityName && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-medium">
                              🌍 {cityName}
                            </span>
                          )}
                          {districtName && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm font-medium">
                              📍 {districtName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
                    <a
                      href={unit.location_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                      <MapPin
                        className={`h-5 w-5 ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        }`}
                      />
                      {t("units.viewOnMap")}
                    </a>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Unit Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Home
                    className={`h-5 w-5 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    } text-blue-600`}
                  />
                  {t("units.unitDetails")}
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Building className="h-5 w-5 text-purple-600" />
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm block">
                        {t("units.type")}
                      </span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {getLocalizedUnitType(unitType)}
                      </p>
                    </div>
                  </div>
                  {unitBedrooms && (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Bed className="h-5 w-5 text-blue-600" />
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 text-sm block">
                          {t("units.bedrooms")}
                        </span>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {unitBedrooms}
                        </p>
                      </div>
                    </div>
                  )}
                  {unitBathrooms && (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Bath className="h-5 w-5 text-blue-600" />
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 text-sm block">
                          {t("units.bathrooms")}
                        </span>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {unitBathrooms}
                        </p>
                      </div>
                    </div>
                  )}
                  {unitArea && (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Square className="h-5 w-5 text-blue-600" />
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 text-sm block">
                          {t("units.area")}
                        </span>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {unitArea} {direction === "rtl" ? "م²" : "m²"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {(cityName || districtName) && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-3">
                      {cityName && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            {t("units.city")}:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {cityName}
                          </span>
                        </div>
                      )}
                      {districtName && (
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            {t("units.district")}:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {districtName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Payment History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <DollarSign
                    className={`h-5 w-5 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    } text-green-600`}
                  />
                  {t("units.paymentHistory")}
                </h3>
                {payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table
                      className={`w-full ${
                        direction === "rtl" ? "flex-start" : ""
                      }`}
                    >
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr className="border-b border-gray-200 dark:border-gray-700 ">
                          <th
                            className={`${
                              direction === "rtl" ? "text-left" : "text-left"
                            } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                          >
                            {t("units.date")}
                          </th>
                          <th
                            className={`${
                              direction === "rtl" ? "text-left" : "text-left"
                            } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                          >
                            {t("units.amount")}
                          </th>
                          <th
                            className={`${
                              direction === "rtl" ? "text-left" : "text-left"
                            } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                          >
                            {t("units.status")}
                          </th>
                          <th
                            className={`${
                              direction === "rtl" ? "text-left" : "text-left"
                            } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                          >
                            {direction === "rtl" ? "النوع" : "Type"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment, index) => (
                          <tr
                            key={payment.id || index}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">
                              {payment.date
                                ? new Date(payment.date).toLocaleDateString(
                                    direction === "rtl" ? "ar-EG" : "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "-"}
                            </td>
                            <td className="py-4 px-4 text-gray-900 dark:text-white font-semibold">
                              $
                              {payment.amount
                                ? payment.amount.toLocaleString("en-US")
                                : "0"}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                  paymentStatusColors[payment.status] ||
                                  paymentStatusColors.paid
                                } flex items-center w-fit`}
                              >
                                {payment.status === "paid" ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <Clock className="h-3 w-3 mr-1" />
                                )}
                                {payment.status === "paid"
                                  ? direction === "rtl"
                                    ? "مدفوع"
                                    : "Paid"
                                  : payment.status === "pending"
                                  ? direction === "rtl"
                                    ? "معلق"
                                    : "Pending"
                                  : payment.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  payment.type === "rent"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                                }`}
                              >
                                {payment.type === "rent"
                                  ? direction === "rtl"
                                    ? "إيجار"
                                    : "Rent"
                                  : payment.category
                                  ? payment.category.charAt(0).toUpperCase() +
                                    payment.category.slice(1)
                                  : direction === "rtl"
                                  ? "عرضي"
                                  : "Occasional"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                      <DollarSign className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("common.noData")}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rent Info */}
            {unit.price_per_day && (
              <motion.div
                initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                  <div className="mb-4">
                    <h3
                      className={`text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between ${
                        direction === "rtl" ? "flex-row" : ""
                      }`}
                    >
                      <span className="flex items-center">
                        <DollarSign
                          className={`h-4 w-4 ${
                            direction === "rtl" ? "ml-2" : "mr-2"
                          } text-green-600`}
                        />
                        {t("units.rentalInformation")}
                      </span>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          ${parseFloat(unit.price_per_day).toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {t("units.perDay")}
                        </span>
                      </div>
                    </h3>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Current Tenant */}
            {unit.current_tenant_name && (
              <motion.div
                initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <User
                      className={`h-5 w-5 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      } text-purple-600`}
                    />
                    {t("units.currentTenant")}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 text-sm block">
                          {t("units.name")}
                        </span>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {unit.current_tenant_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Lease Information */}
            {(unit.lease_start || unit.lease_end) && (
              <motion.div
                initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar
                      className={`h-5 w-5 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      } text-orange-600`}
                    />
                    {t("units.leaseInformation")}
                  </h3>
                  <div className="space-y-4">
                    {unit.lease_start && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <span className="text-gray-600 dark:text-gray-400 text-sm block">
                          {t("units.startDate")}
                        </span>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(unit.lease_start).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {unit.lease_end && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <span className="text-gray-600 dark:text-gray-400 text-sm block">
                          {t("units.endDate")}
                        </span>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {new Date(unit.lease_end).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t("units.quickActions")}
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
                    size="sm"
                  >
                    <DollarSign
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("units.recordPayment")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    size="sm"
                  >
                    <Calendar
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("units.scheduleMaintenance")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
                    size="sm"
                  >
                    <Mail
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("units.sendNotice")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-colors"
                    size="sm"
                  >
                    <Eye
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("units.generateReport")}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reservation Form */}
      {showReservationForm && currentUnit && (
        <ReservationForm
          reservation={null}
          unit={currentUnit.id}
          onSave={handleSaveReservation}
          onCancel={handleCloseReservationForm}
          isEdit={false}
        />
      )}

      {/* Unit Edit Form */}
      {showEditForm && currentUnit && (
        <UnitForm
          unit={currentUnit}
          onSave={handleSaveUnit}
          onCancel={handleCloseEditForm}
          isEdit={true}
        />
      )}
    </div>
  );
};

export default UnitDetail;
