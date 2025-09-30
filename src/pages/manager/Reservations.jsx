import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../stores/languageStore";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import { ReservationForm } from "../../components/manger form";

const Reservations = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  const reservations = [
    {
      id: 1,
      tenantName: "Ahmed Hassan",
      tenantEmail: "ahmed.hassan@email.com",
      tenantPhone: "+201234567890",
      unit: "A-101",
      building: "Sunset Tower",
      startDate: "2024-02-01",
      endDate: "2024-02-15",
      purpose: "Family Visit",
      status: "confirmed",
      guests: 4,
      specialRequests: "Extra towels and pillows",
      totalCost: 500,
      deposit: 200,
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    },
    {
      id: 2,
      tenantName: "Mona Ali",
      tenantEmail: "mona.ali@email.com",
      tenantPhone: "+201112223334",
      unit: "B-201",
      building: "Palm Residency",
      startDate: "2024-02-10",
      endDate: "2024-02-20",
      purpose: "Business Trip",
      status: "pending",
      guests: 2,
      specialRequests: "Quiet environment",
      totalCost: 800,
      deposit: 300,
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    },
    {
      id: 3,
      tenantName: "Omar Khalil",
      tenantEmail: "omar.khalil@email.com",
      tenantPhone: "+201998887766",
      unit: "C-301",
      building: "Nile Heights",
      startDate: "2024-01-25",
      endDate: "2024-01-30",
      purpose: "Weekend Getaway",
      status: "completed",
      guests: 3,
      specialRequests: "Late checkout",
      totalCost: 600,
      deposit: 250,
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    },
    {
      id: 4,
      tenantName: "Sarah Mohamed",
      tenantEmail: "sarah.mohamed@email.com",
      tenantPhone: "+201555666777",
      unit: "A-102",
      building: "Sunset Tower",
      startDate: "2024-03-01",
      endDate: "2024-03-10",
      purpose: "Holiday",
      status: "cancelled",
      guests: 2,
      specialRequests: "Pet-friendly",
      totalCost: 900,
      deposit: 400,
      avatar:
        "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    },
  ];

  const statusColors = {
    confirmed:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    completed:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    cancelled:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  };

  const getStatusColor = (status) => {
    return statusColors[status] || statusColors.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.tenantEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddNew = () => {
    setEditingReservation(null);
    setShowForm(true);
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setShowForm(true);
  };

  const handleSaveReservation = (reservationData) => {
    console.log("Saving reservation:", reservationData);
    setShowForm(false);
    setEditingReservation(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReservation(null);
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {t("reservations.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("reservations.manageReservations")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="sm"
                className="shadow-sm hover:shadow-md transition-shadow"
                onClick={handleAddNew}
              >
                <Plus
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("reservations.addReservation")}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row gap-4">
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
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
              >
                <option value="all">{t("reservations.allStatus")}</option>
                <option value="confirmed">{t("reservations.confirmed")}</option>
                <option value="pending">{t("reservations.pending")}</option>
                <option value="completed">{t("reservations.completed")}</option>
                <option value="cancelled">{t("reservations.cancelled")}</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Reservations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReservations.map((reservation, index) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="relative">
                      <Avatar
                        src={reservation.avatar}
                        alt={reservation.tenantName}
                        size="lg"
                        className="ring-2 ring-primary-200 dark:ring-primary-800"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {reservation.tenantName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("reservations.unit")}: {reservation.unit}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      reservation.status
                    )}`}
                  >
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      {getStatusIcon(reservation.status)}
                      <span>{t(`reservations.${reservation.status}`)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("reservations.dates")}:{" "}
                      {new Date(reservation.startDate).toLocaleDateString()} -{" "}
                      {new Date(reservation.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("reservations.guests")}: {reservation.guests}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("reservations.purpose")}: {reservation.purpose}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {reservation.tenantPhone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t("reservations.totalCost")}: ${reservation.totalCost}
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Link to={`/reservations/${reservation.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        title={t("reservations.view")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      title={t("reservations.edit")}
                      onClick={() => handleEdit(reservation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      title={t("reservations.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredReservations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mb-4">
              <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              {t("reservations.noReservationsFound")}
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              {t("reservations.tryDifferentSearch")}
            </p>
          </motion.div>
        )}

        {/* Reservation Form Modal */}
        {showForm && (
          <ReservationForm
            reservation={editingReservation}
            onSave={handleSaveReservation}
            onCancel={handleCloseForm}
            isEdit={!!editingReservation}
          />
        )}
      </div>
    </div>
  );
};

export default Reservations;
