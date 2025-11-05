import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../stores/languageStore";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchStock, createStock, updateStock, deleteStock } from "../../store/slices/stockSlice";
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
import toast from "react-hot-toast";

const Stock = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const dispatch = useAppDispatch();
  const { stock, isLoading, error } = useAppSelector((state) => state.stock);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingStock, setEditingStock] = useState(null);

  // Categories from API
  const categories = [
    { value: "all", label: t("stock.allCategories") },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Electrical", label: "Electrical" },
    { value: "Plumbing", label: "Plumbing" },
    { value: "Security", label: "Security" },
    { value: "Cleaning", label: "Cleaning" },
    { value: "Furniture", label: "Furniture" },
  ];

  const statuses = [
    { value: "all", label: t("stock.allStatuses") || "All Statuses" },
    { value: "In Stock", label: "In Stock" },
    { value: "Low Stock", label: "Low Stock" },
    { value: "Out of Stock", label: "Out of Stock" },
  ];

  // Fetch stock data on mount and when filters change
  useEffect(() => {
    const params = {};
    if (categoryFilter !== "all") params.category = categoryFilter;
    if (statusFilter !== "all") params.status = statusFilter;
    if (searchTerm.trim()) params.search = searchTerm.trim();

    dispatch(fetchStock(params));
  }, [dispatch, categoryFilter, statusFilter, searchTerm]);

  const statusColors = {
    "In Stock":
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    "Low Stock":
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    "Out of Stock":
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  };

  const getStatusColor = (status) => {
    return statusColors[status] || statusColors["In Stock"];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "In Stock":
        return <CheckCircle className="h-4 w-4" />;
      case "Low Stock":
        return <AlertTriangle className="h-4 w-4" />;
      case "Out of Stock":
        return <XCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const handleAddNew = () => {
    setEditingStock(null);
    setShowForm(true);
  };

  const handleEdit = (stockItem) => {
    setEditingStock(stockItem);
    setShowForm(true);
  };

  const handleSaveStock = async (stockData) => {
    try {
      if (editingStock) {
        // Update existing stock
        const updateData = {
          quantity: stockData.quantity,
          unit_price: stockData.unitPrice || stockData.unit_price,
        };
        await dispatch(updateStock({ id: editingStock.id, data: updateData })).unwrap();
        toast.success(t("stock.updateSuccess") || "Stock item updated successfully");
      } else {
        // Create new stock
        await dispatch(createStock(stockData)).unwrap();
        toast.success(t("stock.createSuccess") || "Stock item created successfully");
      }
      setShowForm(false);
      setEditingStock(null);
      // Refresh stock list
      const params = {};
      if (categoryFilter !== "all") params.category = categoryFilter;
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();
      dispatch(fetchStock(params));
    } catch (err) {
      toast.error(err || (editingStock ? "Failed to update" : "Failed to create"));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("stock.confirmDelete") || "Are you sure you want to delete this item?")) {
      try {
        await dispatch(deleteStock(id)).unwrap();
        toast.success(t("stock.deleteSuccess") || "Stock item deleted successfully");
        // Refresh stock list
        const params = {};
        if (categoryFilter !== "all") params.category = categoryFilter;
        if (statusFilter !== "all") params.status = statusFilter;
        if (searchTerm.trim()) params.search = searchTerm.trim();
        dispatch(fetchStock(params));
      } catch (err) {
        toast.error(err || "Failed to delete stock item");
      }
    }
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

  // Calculate statistics
  const totalItems = stock?.length || 0;
  const inStockCount = stock?.filter((item) => item.status === "In Stock").length || 0;
  const lowStockCount = stock?.filter((item) => item.status === "Low Stock").length || 0;
  const outOfStockCount = stock?.filter((item) => item.status === "Out of Stock").length || 0;

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
                    {totalItems}
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
                    {inStockCount}
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
                    {lowStockCount}
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
                    {outOfStockCount}
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
                  placeholder={t("common.search") || "Search by name, category, supplier, status..."}
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
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Stock Items List */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stock?.map((item, index) => (
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
                          {item.category}
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
                        <span>{item.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t("stock.quantity")}:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.quantity} {item.unit_of_measure || "Pieces"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t("stock.unitPrice")}:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(parseFloat(item.unit_price || 0))}
                      </span>
                    </div>
                    {item.total_value && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Total Value:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(parseFloat(item.total_value))}
                        </span>
                      </div>
                    )}
                    {item.supplier_name && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("stock.supplier")}:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.supplier_name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.created_at && new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
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
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !error && stock?.length === 0 && (
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
