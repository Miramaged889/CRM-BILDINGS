import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../stores/languageStore";
import {
  Plus,
  Search,
  Filter,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Download,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/ui/Icon";

const Payments = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data
  const payments = [
    {
      id: 1,
      tenant: "John Smith",
      unit: "A-101",
      amount: 1200,
      date: "2024-01-15",
      method: "Bank Transfer",
      status: "paid",
      dueDate: "2024-01-01",
    },
    {
      id: 2,
      tenant: "Sarah Johnson",
      unit: "B-205",
      amount: 1500,
      date: "2024-01-14",
      method: "Cash",
      status: "paid",
      dueDate: "2024-01-01",
    },
    {
      id: 3,
      tenant: "Mike Davis",
      unit: "C-301",
      amount: 1000,
      date: null,
      method: "Credit Card",
      status: "overdue",
      dueDate: "2024-01-01",
    },
    {
      id: 4,
      tenant: "Emily Brown",
      unit: "D-102",
      amount: 1300,
      date: null,
      method: "Bank Transfer",
      status: "pending",
      dueDate: "2024-02-01",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700";
    }
  };


  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {t("payments.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg">
           {t("payments.managePayments")}
          </p>
        </div>

        <div className="mt-6 sm:mt-0 flex flex-row justify-end gap-3">
          <Button
            size="lg"
            className="shadow-sm hover:shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3"
          >
            <Plus className={`h-5 w-5 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
            {t("payments.recordPayment")}
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("payments.totalCollected")}
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">$45,200</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("payments.pending")}
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">$3,800</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("payments.overdue")}
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">$1,000</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("payments.collectionRate")}
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">94%</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder={t("payments.searchPayments")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all">{t("payments.allStatus")}</option>
            <option value="paid">{t("payments.paid")}</option>
            <option value="pending">{t("payments.pending")}</option>
            <option value="overdue">{t("payments.overdue")}</option>
          </select>
        </div>
      </motion.div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("payments.recentPayments")}
              </h3>
              <Button
                variant="outline"
                size="sm"
                className={`mt-4 sm:mt-0 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
              >
                <Download className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
                {t("common.export")}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("payments.tenant")}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("payments.amount")}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("payments.method")}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("payments.date")}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("payments.status")}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {payment.tenant}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Unit {payment.unit}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {payment.amount.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600 dark:text-gray-400">
                          {payment.method}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="text-gray-900 dark:text-white">
                            {payment.date ? new Date(payment.date).toLocaleDateString() : "Not paid"}
                          </div>
                          {!payment.date && (
                            <div className="text-gray-500 dark:text-gray-400">
                              Due: {new Date(payment.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {t(`payments.${payment.status}`)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            title="View Payment"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            title="Edit Payment"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {payment.status !== "paid" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                              title="Mark as Paid"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  No payments found
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Payments;
