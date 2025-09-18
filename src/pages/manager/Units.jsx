import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../stores/languageStore";
import { Search, Plus, Filter, Eye, Edit, Trash2, Wrench, CheckCircle } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Link } from "react-router-dom";

const Units = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const units = [
    {
      id: 1,
      number: "A-101",
      type: "apartment",
      status: "occupied",
      rent: 1200,
      tenant: "John Smith",
      image:
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
    },
    {
      id: 2,
      number: "A-102",
      type: "apartment",
      status: "available",
      rent: 1150,
      tenant: null,
      image:
        "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
    },
    {
      id: 3,
      number: "B-201",
      type: "villa",
      status: "occupied",
      rent: 2500,
      tenant: "Sarah Johnson",
      image:
        "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
    },
    {
      id: 4,
      number: "C-301",
      type: "office",
      status: "maintenance",
      rent: 1800,
      tenant: null,
      image:
        "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
    },
    {
      id: 5,
      number: "D-101",
      type: "shop",
      status: "available",
      rent: 2200,
      tenant: null,
      image:
        "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
    },
    {
      id: 6,
      number: "A-103",
      type: "apartment",
      status: "occupied",
      rent: 1300,
      tenant: "Mike Davis",
      image:
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
    },
  ];

  const statusColors = {
    available:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    occupied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    maintenance:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  const filteredUnits = units.filter((unit) => {
    const matchesSearch =
      unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.tenant &&
        unit.tenant.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {t("units.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            {t("units.manageUnits")}
          </p>
        </div>
        <Button className="mt-6 sm:mt-0 shadow-sm hover:shadow-md transition-shadow">
          <Plus
            className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
          />
          {t("units.addUnit")}
        </Button>
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
              <option value="all">{t("units.allStatus")}</option>
              <option value="available">{t("units.available")}</option>
              <option value="occupied">{t("units.occupied")}</option>
              <option value="maintenance">{t("units.maintenance")}</option>
            </select>
          </div>
        </Card>
      </motion.div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map((unit, index) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Card className="overflow-hidden p-0 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 group">
              <div className="relative overflow-hidden">
                <img
                  src={unit.image}
                  alt={unit.number}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div
                  className={`absolute top-4 ${
                    direction === "rtl" ? "left-4" : "right-4"
                  }`}
                >
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                      statusColors[unit.status]
                    }`}
                  >
                    {t(`units.${unit.status}`)}
                  </span>
                </div>
                <div
                  className={`absolute bottom-4 ${
                    direction === "rtl" ? "right-4" : "left-4"
                  }`}
                >
                  <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t(`units.${unit.type}`)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {unit.number}
                  </h3>
                  <div
                    className={`${
                      direction === "rtl" ? "text-left" : "text-right"
                    }`}
                  >
                    <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      ${unit.rent}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t("units.perMonth")}
                    </div>
                  </div>
                </div>

                {unit.tenant && unit.status === "occupied" && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("units.currentTenant")}:
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {unit.tenant}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {unit.status === "available" && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                          {direction === "rtl" ? "متاحة للإيجار" : "Available for Rent"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {unit.status === "maintenance" && (
                  <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Wrench className="w-4 h-4 text-amber-500" />
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                          {direction === "rtl" ? "تحت الصيانة" : "Under Maintenance"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Link to={`/units/${unit.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    >
                      <Eye
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {t("units.view")}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={t("units.edit")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                    title={t("units.delete")}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredUnits.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mb-4">
            <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {t("units.noUnitsFound")}
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            {t("units.tryDifferentSearch")}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Units;
