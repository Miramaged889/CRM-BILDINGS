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
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Building,
  Calendar,
  DollarSign,
  BarChart3,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { StockForm } from "../../components/manger form";

const Stock = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingStock, setEditingStock] = useState(null);

  const stockItems = [
    {
      id: 1,
      name: "Cleaning Supplies",
      category: "maintenance",
      quantity: 25,
      minQuantity: 10,
      unit: "boxes",
      unitPrice: 15.5,
      supplier: "CleanPro Supplies",
      lastRestocked: "2024-01-15",
      location: "Storage Room A",
      status: "in_stock",
      description: "General cleaning supplies for common areas",
    },
    {
      id: 2,
      name: "Light Bulbs",
      category: "electrical",
      quantity: 8,
      minQuantity: 15,
      unit: "pieces",
      unitPrice: 8.75,
      supplier: "ElectroMart",
      lastRestocked: "2024-01-10",
      location: "Electrical Storage",
      status: "low_stock",
      description: "LED light bulbs for all units",
    },
    {
      id: 3,
      name: "Paint",
      category: "maintenance",
      quantity: 0,
      minQuantity: 5,
      unit: "gallons",
      unitPrice: 45.0,
      supplier: "PaintPro",
      lastRestocked: "2024-01-05",
      location: "Storage Room B",
      status: "out_of_stock",
      description: "White paint for touch-ups",
    },
    {
      id: 4,
      name: "Door Locks",
      category: "security",
      quantity: 12,
      minQuantity: 8,
      unit: "sets",
      unitPrice: 125.0,
      supplier: "SecureLock Inc",
      lastRestocked: "2024-01-20",
      location: "Security Storage",
      status: "in_stock",
      description: "High-security door lock sets",
    },
    {
      id: 5,
      name: "Plumbing Parts",
      category: "plumbing",
      quantity: 3,
      minQuantity: 10,
      unit: "kits",
      unitPrice: 35.0,
      supplier: "PlumbTech",
      lastRestocked: "2024-01-12",
      location: "Plumbing Storage",
      status: "low_stock",
      description: "Basic plumbing repair kits",
    },
  ];

  const statusColors = {
    in_stock:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    low_stock:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    out_of_stock:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  };

  const getStatusColor = (status) => {
    return statusColors[status] || statusColors.in_stock;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "in_stock":
        return <CheckCircle className="h-4 w-4" />;
      case "low_stock":
        return <AlertTriangle className="h-4 w-4" />;
      case "out_of_stock":
        return <XCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStockTrend = (item) => {
    // Mock trend calculation - in real app, this would be based on historical data
    const trend = Math.random() > 0.5 ? 1 : -1;
    return trend;
  };

  const filteredStock = stockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddNew = () => {
    setEditingStock(null);
    setShowForm(true);
  };

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setShowForm(true);
  };

  const handleSaveStock = (stockData) => {
    console.log("Saving stock:", stockData);
    setShowForm(false);
    setEditingStock(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStock(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
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
                {t("stock.title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("stock.manageInventory")}
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
                {t("stock.addItem")}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("stock.totalItems")}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stockItems.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                    {t("stock.inStock")}
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {
                      stockItems.filter((item) => item.status === "in_stock")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
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
                    {t("stock.lowStock")}
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {
                      stockItems.filter((item) => item.status === "low_stock")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
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
                    {t("stock.outOfStock")}
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {
                      stockItems.filter(
                        (item) => item.status === "out_of_stock"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
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
                  placeholder={t("common.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full ${
                    direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                  } py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200`}
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
              >
                <option value="all">{t("stock.allCategories")}</option>
                <option value="maintenance">{t("stock.maintenance")}</option>
                <option value="electrical">{t("stock.electrical")}</option>
                <option value="plumbing">{t("stock.plumbing")}</option>
                <option value="security">{t("stock.security")}</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Stock Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStock.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(`stock.${item.category}`)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      item.status
                    )}`}
                  >
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      {getStatusIcon(item.status)}
                      <span>{t(`stock.${item.status}`)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("stock.quantity")}:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("stock.unitPrice")}:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.unitPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("stock.supplier")}:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.supplier}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("stock.location")}:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {getStockTrend(item) > 0 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t("stock.lastRestocked")}:{" "}
                      {new Date(item.lastRestocked).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Link to={`/stock/${item.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        title={t("stock.view")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      title={t("stock.edit")}
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      title={t("stock.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredStock.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mb-4">
              <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              {t("stock.noItemsFound")}
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              {t("stock.tryDifferentSearch")}
            </p>
          </motion.div>
        )}

        {/* Stock Form Modal */}
        {showForm && (
          <StockForm
            stock={editingStock}
            onSave={handleSaveStock}
            onCancel={handleCloseForm}
            isEdit={!!editingStock}
          />
        )}
      </div>
    </div>
  );
};

export default Stock;
