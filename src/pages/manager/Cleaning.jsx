import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  Sparkles,
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
import { CleaningForm, CleaningViewModal } from "../../components/manger form";

const Cleaning = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCleaning, setEditingCleaning] = useState(null);
  const [viewingCleaning, setViewingCleaning] = useState(null);

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  // Mock data
  const requests = [
    {
      id: 1,
      title: "Deep Kitchen Cleaning",
      unit: "A-101",
      tenant: "John Smith",
      date: "2024-01-15",
      description:
        "Complete kitchen deep cleaning including appliances and cabinets",
      completedBy: "Fatima Ahmed",
      amount: 120.0,
      photos: [
        {
          id: 1,
          name: "before_cleaning.jpg",
          url: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400",
          uploadedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          name: "after_cleaning.jpg",
          url: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400",
          uploadedAt: "2024-01-15T14:30:00Z",
        },
      ],
    },
    {
      id: 2,
      title: "Bathroom Sanitization",
      unit: "B-205",
      tenant: "Sarah Johnson",
      date: "2024-01-14",
      description: "Complete bathroom sanitization and deep cleaning",
      completedBy: "Aisha Mohamed",
      amount: 80.0,
      photos: [
        {
          id: 3,
          name: "bathroom_cleaning.jpg",
          url: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400",
          uploadedAt: "2024-01-14T09:15:00Z",
        },
      ],
    },
    {
      id: 3,
      title: "Living Room Deep Clean",
      unit: "C-301",
      tenant: "Mike Davis",
      date: "2024-01-13",
      description:
        "Complete living room cleaning including furniture and carpets",
      completedBy: "Mariam Hassan",
      amount: 150.0,
      photos: [
        {
          id: 4,
          name: "living_room_before.jpg",
          url: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400",
          uploadedAt: "2024-01-13T11:00:00Z",
        },
        {
          id: 5,
          name: "living_room_after.jpg",
          url: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400",
          uploadedAt: "2024-01-13T15:30:00Z",
        },
      ],
    },
    {
      id: 4,
      title: "Window Cleaning Service",
      unit: "D-402",
      tenant: "Emma Wilson",
      date: "2024-01-12",
      description: "Professional window cleaning for all apartment windows",
      completedBy: "Nour Ali",
      amount: 100.0,
      photos: [
        {
          id: 6,
          name: "window_cleaning.jpg",
          url: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400",
          uploadedAt: "2024-01-12T13:45:00Z",
        },
      ],
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
    setEditingCleaning(null);
    setShowForm(true);
  };

  const handleEdit = (cleaning) => {
    setEditingCleaning(cleaning);
    setShowForm(true);
  };

  const handleSaveCleaning = (cleaningData) => {
    // In a real app, this would save to the backend
    console.log("Saving cleaning:", cleaningData);
    setShowForm(false);
    setEditingCleaning(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCleaning(null);
  };

  const handleView = (cleaning) => {
    setViewingCleaning(cleaning);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingCleaning(null);
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
            {t("nav.cleaning")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("cleaning.manageRequests")}
          </p>
        </div>

        <div
          className={`mt-4 sm:mt-0 flex space-x-3 ${
            direction === "rtl" ? "flex-row" : ""
          }`}
        >
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
            onClick={handleAddNew}
          >
            <Plus
              className={`h-5 w-5 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {t("cleaning.newRequest")}
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
              placeholder={t("cleaning.searchRequests")}
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
                {t("cleaning.cleaningRequests")} ({filteredRequests.length})
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
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {request.title}
                      </h4>
                      <div
                        className={`flex items-center space-x-3 ${
                          direction === "rtl" ? "space-x-reverse" : ""
                        } mb-3`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
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
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                    {request.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div
                      className={`flex items-center space-x-2 ${
                        direction === "rtl" ? "space-x-reverse" : ""
                      }`}
                    >
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
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200"
                        onClick={() => handleView(request)}
                        title={
                          direction === "rtl"
                            ? "عرض تفاصيل التنظيف"
                            : "View Cleaning Details"
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
                          direction === "rtl"
                            ? "تعديل طلب التنظيف"
                            : "Edit Cleaning Request"
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t("common.noData")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("cleaning.noCleaningRequests")}
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Cleaning Form Modal */}
      {showForm && (
        <CleaningForm
          cleaning={editingCleaning}
          onSave={handleSaveCleaning}
          onCancel={handleCloseForm}
          isEdit={!!editingCleaning}
        />
      )}

      {/* Cleaning View Modal */}
      {showViewModal && viewingCleaning && (
        <CleaningViewModal
          cleaning={viewingCleaning}
          onClose={handleCloseViewModal}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default Cleaning;
