import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../stores/languageStore";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  DollarSign,
  User,
  Eye,
  Edit,
  Trash2,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Building,
  Home,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/ui/Icon";

const Leases = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data
  const leases = [
    {
      id: 1,
      tenant: "John Smith",
      unit: "A-101",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      rent: 1200,
      deposit: 2400,
      status: "active",
      type: "apartment",
      tenantEmail: "john.smith@email.com",
      tenantPhone: "+1 234 567 8900",
      utilities: "Water, Electricity",
      petPolicy: "No pets allowed",
      parking: "1 space included",
    },
    {
      id: 2,
      tenant: "Sarah Johnson",
      unit: "B-205",
      startDate: "2024-02-15",
      endDate: "2025-02-14",
      rent: 1500,
      deposit: 3000,
      status: "active",
      type: "villa",
      tenantEmail: "sarah.johnson@email.com",
      tenantPhone: "+1 234 567 8901",
      utilities: "All utilities included",
      petPolicy: "Small pets allowed",
      parking: "2 spaces included",
    },
    {
      id: 3,
      tenant: "Mike Davis",
      unit: "C-301",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      rent: 1000,
      deposit: 2000,
      status: "expired",
      type: "apartment",
      tenantEmail: "mike.davis@email.com",
      tenantPhone: "+1 234 567 8902",
      utilities: "Water, Electricity",
      petPolicy: "No pets allowed",
      parking: "1 space included",
    },
    {
      id: 4,
      tenant: "Emily Brown",
      unit: "D-102",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      rent: 1800,
      deposit: 3600,
      status: "pending",
      type: "villa",
      tenantEmail: "emily.brown@email.com",
      tenantPhone: "+1 234 567 8903",
      utilities: "All utilities included",
      petPolicy: "Pets allowed with deposit",
      parking: "2 spaces included",
    },
    {
      id: 5,
      tenant: "David Wilson",
      unit: "A-203",
      startDate: "2024-04-15",
      endDate: "2025-04-14",
      rent: 1350,
      deposit: 2700,
      status: "active",
      type: "apartment",
      tenantEmail: "david.wilson@email.com",
      tenantPhone: "+1 234 567 8904",
      utilities: "Water, Electricity, Internet",
      petPolicy: "No pets allowed",
      parking: "1 space included",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
      case "expired":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const filteredLeases = leases.filter((lease) => {
    const matchesSearch =
      lease.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lease.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeLeases = leases.filter(
    (lease) => lease.status === "active"
  ).length;
  const pendingLeases = leases.filter(
    (lease) => lease.status === "pending"
  ).length;
  const expiredLeases = leases.filter(
    (lease) => lease.status === "expired"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {t("nav.leases")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("leases.manageLeases")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="sm"
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <Plus
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("leases.addLease")}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("leases.active")}
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {activeLeases}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("leases.pending")}
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {pendingLeases}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("leases.expired")}
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {expiredLeases}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("leases.totalLeases")}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {leases.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
                  placeholder={t("leases.searchLeases")}
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
                <option value="all">{t("leases.allStatus")}</option>
                <option value="active">{t("leases.active")}</option>
                <option value="pending">{t("leases.pending")}</option>
                <option value="expired">{t("leases.expired")}</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Leases Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="overflow-hidden shadow-lg border-0 bg-white dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.tenant")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.unit")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.leaseType")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.startDate")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.endDate")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.rent")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("leases.status")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLeases.map((lease, index) => (
                    <motion.tr
                      key={lease.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className={`${direction === "rtl" ? "mr-4" : "ml-4"}`}>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {lease.tenant}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {lease.tenantEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {lease.unit}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white capitalize">
                          {lease.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(lease.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(lease.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {lease.rent}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            /month
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            lease.status
                          )}`}
                        >
                          {t(`leases.${lease.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <Button
                            size="sm"
                            variant="outline"
                            title={t("leases.viewLease")}
                            onClick={() => console.log("View lease:", lease.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            title={t("leases.editLease")}
                            onClick={() => console.log("Edit lease:", lease.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            title={t("leases.sendReminder")}
                            onClick={() => console.log("Send reminder:", lease.id)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {filteredLeases.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mb-4">
              <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              {t("leases.noLeasesFound")}
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              {t("leases.tryDifferentSearch")}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leases;
