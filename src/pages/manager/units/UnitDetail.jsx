import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../stores/languageStore";
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
  Car,
  Building,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const UnitDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Mock data - in real app, fetch by ID
  const unit = {
    id: 1,
    number: "A-101",
    type: "apartment",
    status: "occupied",
    rent: 1200,
    tenant: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 234 567 8900",
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      area: "850 sq ft",
      floor: "1st Floor",
      balcony: true,
      parking: true,
      furnished: "Semi-furnished",
    },
    images: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
    ],
    paymentHistory: [
      { date: "2024-03-01", amount: 1200, status: "paid" },
      { date: "2024-02-01", amount: 1200, status: "paid" },
      { date: "2024-01-01", amount: 1200, status: "pending" },
    ],
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 md:p-6 space-y-6">
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
                  {t("units.unitDetails")} {unit.number}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      statusColors[unit.status]
                    }`}
                  >
                    {t(`units.${unit.status}`)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 capitalize flex items-center">
                    <Building
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-1" : "mr-1"
                      }`}
                    />
                    {getLocalizedUnitType(unit.type)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 flex items-center">
                    <DollarSign
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-1" : "mr-1"
                      }`}
                    />
                    ${unit.rent} {t("units.perMonth")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md flex-1 sm:flex-none">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-0 overflow-hidden">
                <div className="relative">
                  <img
                    src={unit.images[selectedImageIndex]}
                    alt={`Unit ${unit.number}`}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Camera className="h-4 w-4 mr-1" />
                    {selectedImageIndex + 1} / {unit.images.length}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    {unit.images.map((image, index) => (
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

            {/* Map Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="p-0 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <MapPin
                      className={`h-5 w-5 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      } text-red-600`}
                    />
                    {t("units.location")}
                  </h3>
                </div>
                <div className="h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                  {/* Placeholder for real map implementation */}
                  {direction === "rtl"
                    ? "خريطة الموقع (لاحقاً)"
                    : "Map location (to integrate)"}
                </div>
              </Card>
            </motion.div>

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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Building className="h-5 w-5 text-purple-600" />
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm block">
                        {t("units.type")}
                      </span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {getLocalizedUnitType(unit.type)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Bed className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm block">
                        {t("units.bedrooms")}
                      </span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {unit.details.bedrooms}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Bath className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm block">
                        {t("units.bathrooms")}
                      </span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {unit.details.bathrooms}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Square className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm block">
                        {t("units.area")}
                      </span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {unit.details.area}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm block">
                        {t("units.floor")}
                      </span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {unit.details.floor}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {t("units.furnished")}:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {unit.details.furnished}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {unit.details.balcony && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 text-sm rounded-full border border-emerald-200 dark:border-emerald-800">
                        {t("units.balcony")}
                      </span>
                    )}
                    {unit.details.parking && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-800 flex items-center">
                        <Car className="h-3 w-3 mr-1" />
                        {t("units.parking")}
                      </span>
                    )}
                  </div>
                </div>
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
                      </tr>
                    </thead>
                    <tbody>
                      {unit.paymentHistory.map((payment, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-gray-900 dark:text-white font-semibold">
                            ${payment.amount.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                paymentStatusColors[payment.status]
                              } flex items-center w-fit`}
                            >
                              {payment.status === "paid" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Clock className="h-3 w-3 mr-1" />
                              )}
                              {t(`units.${payment.status}`)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rent Info */}
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
                        ${unit.rent.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {t("units.perMonth")}
                      </span>
                    </div>
                  </h3>
                </div>
              </Card>
            </motion.div>

            {/* Current Tenant */}
            {unit.tenant && (
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
                          {unit.tenant.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 text-sm block">
                          {t("units.email")}
                        </span>
                        <p className="text-gray-900 dark:text-white text-sm">
                          {unit.tenant.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 text-sm block">
                          {t("units.phone")}
                        </span>
                        <p className="text-gray-900 dark:text-white text-sm">
                          {unit.tenant.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Lease Information */}
            {unit.tenant && (
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
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <span className="text-gray-600 dark:text-gray-400 text-sm block">
                        {t("units.startDate")}
                      </span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(unit.tenant.leaseStart).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <span className="text-gray-600 dark:text-gray-400 text-sm block">
                        {t("units.endDate")}
                      </span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(unit.tenant.leaseEnd).toLocaleDateString()}
                      </p>
                    </div>
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
    </div>
  );
};

export default UnitDetail;
