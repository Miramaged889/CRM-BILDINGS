import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../stores/languageStore";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTenants } from "../../../store/slices/tenantsSlice";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Building,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Avatar from "../../../components/ui/Avatar";
import { TenantForm } from "../../../components/manger form";

const TenantList = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rentalTypeFilter, setRentalTypeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  const dispatch = useDispatch();
  const { tenants: tenantsFromStore, isLoading } = useSelector(
    (state) => state.tenants
  );

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      const params = searchTerm ? { search: searchTerm } : {};
      dispatch(fetchTenants(params));
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [dispatch, searchTerm]);

  const tenants = useMemo(() => {
    const placeholderAvatar =
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150";
    return (tenantsFromStore || []).map((item) => {
      const rentInfo = item.rent_info || {};
      const totalAmount =
        typeof rentInfo.total_amount === "string"
          ? parseFloat(rentInfo.total_amount)
          : rentInfo.total_amount || 0;
      return {
        id: item.id,
        name: item.full_name || item.name || "",
        email: item.email ?? "",
        phone: item.phone ?? "",
        unit: rentInfo.unit_name || "",
        leaseStart: rentInfo.rent_start || new Date().toISOString(),
        leaseEnd: rentInfo.rent_end || new Date().toISOString(),
        status: rentInfo.status || item.status || "active",
        rentalType: "daily",
        rent: Number.isFinite(totalAmount) ? totalAmount : 0,
        avatar: item.avatar || placeholderAvatar,
      };
    });
  }, [tenantsFromStore]);

  const statusColors = {
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    inactive:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    completed:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  };

  const rentalTypeColors = {
    monthly:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
    daily:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  };

  const getStatusColor = (status) => {
    return statusColors[status] || statusColors.inactive;
  };

  const getRentalTypeColor = (rentalType) => {
    return rentalTypeColors[rentalType] || rentalTypeColors.daily;
  };

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || tenant.status === statusFilter;
    const matchesRentalType =
      rentalTypeFilter === "all" || tenant.rentalType === rentalTypeFilter;
    return matchesSearch && matchesStatus && matchesRentalType;
  });

  const handleAddNew = () => {
    setEditingTenant(null);
    setShowForm(true);
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setShowForm(true);
  };

  const handleSaveTenant = (tenantData) => {
    // In a real app, this would save to the backend
    console.log("Saving tenant:", tenantData);
    setShowForm(false);
    setEditingTenant(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTenant(null);
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
                {t("tenants.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("tenants.manageTenants")}
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
                {t("tenants.addTenant")}
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
                <option value="all">{t("tenants.allStatus")}</option>
                <option value="active">{t("tenants.active")}</option>
                <option value="inactive">{t("tenants.inactive")}</option>
                <option value="pending">{t("tenants.pending")}</option>
                <option value="completed">{t("tenants.completed")}</option>
              </select>
              <select
                value={rentalTypeFilter}
                onChange={(e) => setRentalTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
              >
                <option value="all">{t("tenants.allRentalTypes")}</option>
                <option value="monthly">{t("tenants.monthly")}</option>
                <option value="daily">{t("tenants.daily")}</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Tenants List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant, index) => (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="relative">
                      <Avatar
                        src={tenant.avatar}
                        alt={tenant.name}
                        size="lg"
                        className="ring-2 ring-primary-200 dark:ring-primary-800"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tenant.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("tenants.unit")}: {tenant.unit}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getRentalTypeColor(
                      tenant.rentalType
                    )}`}
                  >
                    {t(`tenants.${tenant.rentalType}`)}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {tenant.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {tenant.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("tenants.leaseStart")}:{" "}
                      {new Date(tenant.leaseStart).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("tenants.rentAmount")}: ${tenant.rent}/day
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t("tenants.leaseEnd")}:{" "}
                    {new Date(tenant.leaseEnd).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Link to={`/tenants/${tenant.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        title={t("tenants.view")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      title={t("tenants.edit")}
                      onClick={() => handleEdit(tenant)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      title={t("tenants.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTenants.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mb-4">
              <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              {t("tenants.noTenantsFound")}
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              {t("tenants.tryDifferentSearch")}
            </p>
          </motion.div>
        )}

        {/* Tenant Form Modal */}
        {showForm && (
          <TenantForm
            tenant={editingTenant}
            onSave={handleSaveTenant}
            onCancel={handleCloseForm}
            isEdit={!!editingTenant}
          />
        )}
      </div>
    </div>
  );
};

export default TenantList;
