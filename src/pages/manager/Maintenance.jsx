import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  Wrench,
  CheckCircle,
  User,
  Eye,
  Edit,
  Download,
  Calendar,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/ui/Icon";
import { MaintenanceForm } from "../../components/forms/manger form";

const Maintenance = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [completedRequests, setCompletedRequests] = useState(new Set());

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  // Mock data
  const requests = [
    {
      id: 1,
      title: "Leaky Faucet in Kitchen",
      unit: "A-101",
      tenant: "John Smith",
      date: "2024-01-15",
      description: "Kitchen faucet has been dripping for 3 days",
    },
    {
      id: 2,
      title: "Broken Air Conditioning",
      unit: "B-205",
      tenant: "Sarah Johnson",
      date: "2024-01-14",
      description: "AC unit not cooling properly, temperature rising",
    },
    {
      id: 3,
      title: "Door Lock Replacement",
      unit: "C-301",
      tenant: "Mike Davis",
      date: "2024-01-13",
      description: "Front door lock needs to be replaced",
    },
    {
      id: 4,
      title: "Bathroom Heater Issue",
      unit: "D-402",
      tenant: "Emma Wilson",
      date: "2024-01-12",
      description: "Bathroom heater not working during winter",
    },
  ];

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.unit.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleAddNew = () => {
    setEditingMaintenance(null);
    setShowForm(true);
  };

  const handleEdit = (maintenance) => {
    setEditingMaintenance(maintenance);
    setShowForm(true);
  };

  const handleSaveMaintenance = (maintenanceData) => {
    // In a real app, this would save to the backend
    console.log("Saving maintenance:", maintenanceData);
    setShowForm(false);
    setEditingMaintenance(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMaintenance(null);
  };

  const handleComplete = (requestId) => {
    // In a real app, this would update the backend
    console.log("Completing maintenance request:", requestId);
    setCompletedRequests(prev => new Set([...prev, requestId]));
    alert(
      direction === "rtl"
        ? "تم إكمال طلب الصيانة بنجاح"
        : "Maintenance request completed successfully"
    );
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

        <div
          className={`mt-4 sm:mt-0 flex space-x-3 ${
            direction === "rtl" ? "flex-row" : ""
          }`}
        >
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
            onClick={handleAddNew}
          >
            <Plus
              className={`h-5 w-5 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {t("maintenance.newRequest")}
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <div className="relative">
            <Search
              className={`absolute ${
                direction === "rtl" ? "right-3" : "left-3"
              } top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500`}
            />
            <Input
              placeholder={t("maintenance.searchRequests")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${
                direction === "rtl" ? "pr-10" : "pl-10"
              } bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            />
          </div>
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
                {t("maintenance.maintenanceRequests")} (
                {filteredRequests.length})
              </h3>
              <div
                className={`mt-4 sm:mt-0 flex space-x-2 ${
                  direction === "rtl" ? "space-x-reverse" : ""
                }`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Download
                    className={`h-4 w-4 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
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
                  className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group ${
                    completedRequests.has(request.id) ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className={`text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                        completedRequests.has(request.id) ? 'line-through text-gray-500 dark:text-gray-400' : ''
                      }`}>
                        {request.title}
                      </h4>
                      <div
                        className={`flex items-center space-x-3 ${
                          direction === "rtl" ? "space-x-reverse" : ""
                        } mb-3`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.tenant}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block">
                            {request.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      completedRequests.has(request.id) 
                        ? 'bg-green-400' 
                        : 'bg-yellow-400 animate-pulse'
                    }`}></div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                    {request.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className={`flex items-center space-x-2 ${direction === "rtl" ? "space-x-reverse" : ""}`}>
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(request.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      className={`flex space-x-2 ${
                        direction === "rtl" ? "space-x-reverse" : ""
                      }`}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                        title={
                          direction === "rtl" ? "عرض التفاصيل" : "View Details"
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200"
                        onClick={() => handleEdit(request)}
                        title={
                          direction === "rtl" ? "تعديل الطلب" : "Edit Request"
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-700/20 hover:border-green-400 dark:hover:border-green-500 transition-all duration-200 hover:scale-105 ${
                          completedRequests.has(request.id) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => handleComplete(request.id)}
                        disabled={completedRequests.has(request.id)}
                        title={
                          direction === "rtl"
                            ? completedRequests.has(request.id) ? "مكتمل" : "إكمال الطلب"
                            : completedRequests.has(request.id) ? "Completed" : "Complete Request"
                        }
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

      {/* Maintenance Form Modal */}
      {showForm && (
        <MaintenanceForm
          maintenance={editingMaintenance}
          onSave={handleSaveMaintenance}
          onCancel={handleCloseForm}
          isEdit={!!editingMaintenance}
        />
      )}
    </div>
  );
};

export default Maintenance;
