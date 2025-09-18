import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  Filter,
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Eye,
  Edit,
  Download,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/ui/Icon";

const Maintenance = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  // Mock data
  const requests = [
    {
      id: 1,
      title: "Leaky Faucet in Kitchen",
      unit: "A-101",
      tenant: "John Smith",
      date: "2024-01-15",
      priority: "medium",
      status: "pending",
      description: "Kitchen faucet has been dripping for 3 days",
    },
    {
      id: 2,
      title: "Broken Air Conditioning",
      unit: "B-205",
      tenant: "Sarah Johnson",
      date: "2024-01-14",
      priority: "high",
      status: "in-progress",
      description: "AC unit not cooling properly, temperature rising",
    },
    {
      id: 3,
      title: "Door Lock Replacement",
      unit: "C-301",
      tenant: "Mike Davis",
      date: "2024-01-13",
      priority: "low",
      status: "completed",
      description: "Front door lock needs to be replaced",
    },
    {
      id: 4,
      title: "Bathroom Heater Issue",
      unit: "D-402",
      tenant: "Emma Wilson",
      date: "2024-01-12",
      priority: "high",
      status: "pending",
      description: "Bathroom heater not working during winter",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.unit.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    inProgress: requests.filter(r => r.status === "in-progress").length,
    completed: requests.filter(r => r.status === "completed").length,
  };

  return (
    <div className="p-6 space-y-6" dir={direction}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("nav.maintenance")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("maintenance.manageRequests")}
          </p>
        </div>

        <div className={`mt-4 sm:mt-0 flex space-x-3 ${direction === "rtl" ? "flex-row" : ""}`}>
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
            {t("maintenance.newRequest")}
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("maintenance.totalRequests")}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                  {t("maintenance.pending")}
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.pending}
                </p>
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
                  {t("maintenance.inProgress")}
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.inProgress}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                  {t("maintenance.completed")}
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.completed}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
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
            <Search className={`absolute ${direction === "rtl" ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500`} />
            <Input
              placeholder={t("maintenance.searchRequests")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${direction === "rtl" ? "pr-10" : "pl-10"} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            />
          </div>
        </div>
        
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all"> {t("payments.allStatus")}</option>
            <option value="pending">{t("maintenance.pending")}</option>
            <option value="in-progress">{t("maintenance.inProgress")}</option>
            <option value="completed">{t("maintenance.completed")}</option>
          </select>
        </div>

        <div className="sm:w-48">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="all"> {t("maintenance.priority")}</option>
            <option value="high">{t("maintenance.high")}</option>
            <option value="medium">{t("maintenance.medium")}</option>
            <option value="low">{t("maintenance.low")}</option>
          </select>
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("maintenance.maintenanceRequests")} ({filteredRequests.length})
              </h3>
              <div className={`mt-4 sm:mt-0 flex space-x-2 ${direction === "rtl" ? "space-x-reverse" : ""}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Download className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
                  {t("common.export")}
                </Button>
              </div>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                        {request.title}
                      </h4>
                      <div className={`flex items-center space-x-2 ${direction === "rtl" ? "space-x-reverse" : ""} mb-2`}>
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {request.tenant} • {request.unit}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium text-center ${getPriorityColor(
                          request.priority
                        )}`}
                      >
                        {request.priority}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium text-center ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {request.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(request.date).toLocaleDateString()}
                    </span>
                    <div className={`flex space-x-2 ${direction === "rtl" ? "space-x-reverse" : ""}`}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-700/20"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Wrench className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t("common.noData")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("maintenance.noMaintenanceRequests")}
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Maintenance;
