import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../stores/languageStore";
import { useThemeStore } from "../../stores/themeStore";
import {
  Download,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Eye,
  Printer,
  Share2,
  Wrench,
  Users,
  Building,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const { isDark } = useThemeStore();
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedOwner, setSelectedOwner] = useState("all");

  // Mock data for owners
  const availableOwners = [
    { id: "all", name: direction === "rtl" ? "جميع الملاك" : "All Owners" },
    { id: "ahmed-ali", name: "Ahmed Ali" },
    { id: "mona-hassan", name: "Mona Hassan" },
    { id: "omar-mahmoud", name: "Omar Mahmoud" },
    { id: "fatima-ahmed", name: "Fatima Ahmed" },
  ];

  // Filter-based data generation
  const getFilteredData = () => {
    const baseData = {
      all: {
        totalRevenue: 124500,
        ownerPercentage: 65.2,
        expensesPercentage: 36.6,
        systemManagerPercentage: 15.8,
        monthlyRevenue: [45000, 52000, 48000, 61000, 55000, 67000],
        monthlyExpenses: [18000, 19500, 17200, 20100, 18900, 21300],
        revenueGrowth: 12.5,
      },
      "ahmed-ali": {
        totalRevenue: 45000,
        ownerPercentage: 70.0,
        expensesPercentage: 25.0,
        systemManagerPercentage: 10.0,
        monthlyRevenue: [15000, 18000, 16000, 20000, 17000, 19000],
        monthlyExpenses: [8000, 9000, 7500, 10000, 8500, 9500],
        revenueGrowth: 8.5,
      },
      "mona-hassan": {
        totalRevenue: 35000,
        ownerPercentage: 60.0,
        expensesPercentage: 30.0,
        systemManagerPercentage: 15.0,
        monthlyRevenue: [12000, 14000, 13000, 16000, 14500, 15500],
        monthlyExpenses: [6000, 7000, 6500, 8000, 7200, 7800],
        revenueGrowth: 15.2,
      },
      "omar-mahmoud": {
        totalRevenue: 25000,
        ownerPercentage: 75.0,
        expensesPercentage: 20.0,
        systemManagerPercentage: 8.0,
        monthlyRevenue: [8000, 9000, 8500, 10000, 9200, 9800],
        monthlyExpenses: [3000, 3500, 3200, 4000, 3600, 3800],
        revenueGrowth: 5.8,
      },
      "fatima-ahmed": {
        totalRevenue: 19500,
        ownerPercentage: 55.0,
        expensesPercentage: 35.0,
        systemManagerPercentage: 12.0,
        monthlyRevenue: [6000, 7000, 6500, 8000, 7200, 7800],
        monthlyExpenses: [4000, 4500, 4200, 5000, 4600, 4800],
        revenueGrowth: 18.3,
      },
    };

    return baseData[selectedOwner] || baseData.all;
  };

  const filteredData = getFilteredData();

  // Chart data with theme-aware colors - Dynamic function
  const getColors = () => ({
    primary: "rgba(59, 130, 246, 0.8)",
    success: "rgba(16, 185, 129, 0.8)",
    warning: "rgba(245, 158, 11, 0.8)",
    danger: "rgba(239, 68, 68, 0.8)",
    purple: "rgba(139, 92, 246, 0.8)",
    text: isDark ? "rgba(243, 244, 246, 0.8)" : "rgba(17, 24, 39, 0.8)",
    grid: isDark ? "rgba(75, 85, 99, 0.1)" : "rgba(107, 114, 128, 0.1)",
  });

  const getRevenueData = () => {
    const colors = getColors();
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: t("reports.revenue"),
          data: filteredData.monthlyRevenue,
          backgroundColor: colors.primary,
          borderColor: colors.primary.replace("0.8", "1"),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: t("reports.expenses"),
          data: filteredData.monthlyExpenses,
          backgroundColor: colors.danger,
          borderColor: colors.danger.replace("0.8", "1"),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  };

  const getChartOptions = () => {
    const colors = getColors();
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
            color: isDark ? "#f9fafb" : "#374151",
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
        tooltip: {
          backgroundColor: isDark
            ? "rgba(17, 24, 39, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          titleColor: isDark ? "#f9fafb" : "#374151",
          bodyColor: isDark ? "#f9fafb" : "#374151",
          borderColor: isDark
            ? "rgba(75, 85, 99, 0.3)"
            : "rgba(209, 213, 219, 0.3)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          intersect: false,
          mode: "index",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: colors.grid,
            drawBorder: false,
          },
          ticks: {
            color: isDark ? "rgba(243, 244, 246, 0.8)" : colors.text,
            font: {
              size: 11,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: isDark ? "rgba(243, 244, 246, 0.8)" : colors.text,
            font: {
              size: 11,
            },
          },
        },
      },
    };
  };

  const reportTypes = [
    {
      id: "financial",
      title: direction === "rtl" ? "التقرير المالي" : "Financial Report",
      description:
        direction === "rtl"
          ? "عرض الإيرادات والمصروفات والنسب"
          : "View revenue, expenses, and percentages",
      icon: TrendingUp,
      color: "green",
      data: filteredData,
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      green:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      yellow:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300",
      purple:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
    };
    return colorMap[color] || colorMap.blue;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowUp className="h-4 w-4 text-emerald-500" />;
    if (trend < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return "text-emerald-600 dark:text-emerald-400";
    if (trend < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
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
                {t("nav.reports")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("reports.generateAndView")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log("Date range filter clicked")}
              >
                <Calendar
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("reports.dateRange")}
              </Button>
              <Button
                size="sm"
                onClick={() => console.log("Export all reports")}
              >
                <Download
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("reports.exportAll")}
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
                    {direction === "rtl" ? "إجمالي الإيرادات" : "Total Revenue"}
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(filteredData.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(filteredData.revenueGrowth)}
                    <span
                      className={`text-sm ml-1 ${getTrendColor(
                        filteredData.revenueGrowth
                      )}`}
                    >
                      {formatPercentage(filteredData.revenueGrowth)}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
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
                    {direction === "rtl" ? "نسبة المالك" : "Owner Percentage"}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPercentage(filteredData.ownerPercentage)}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {direction === "rtl"
                        ? "من إجمالي الإيرادات"
                        : "of total revenue"}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                    {direction === "rtl"
                      ? "نسبة المصروفات"
                      : "Expenses Percentage"}
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatPercentage(filteredData.expensesPercentage)}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {direction === "rtl"
                        ? "من إجمالي الإيرادات"
                        : "of total revenue"}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <DollarSign className="h-6 w-6 text-red-600 dark:text-red-400" />
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
                    {direction === "rtl"
                      ? "نسبة مدير النظام"
                      : "System Manager Percentage"}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatPercentage(filteredData.systemManagerPercentage)}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {direction === "rtl"
                        ? "من إجمالي الإيرادات"
                        : "of total revenue"}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Wrench className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {direction === "rtl" ? "تصفية التقارير" : "Filter Reports"}
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedOwner}
                  onChange={(e) => setSelectedOwner(e.target.value)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {availableOwners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="monthly">{t("reports.monthlyTrends")}</option>
                  <option value="quarterly">
                    {t("reports.quarterlyAnalysis")}
                  </option>
                  <option value="yearly">{t("reports.yearlyOverview")}</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log("Date range filter clicked")}
                >
                  <Calendar
                    className={`h-4 w-4 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {t("reports.dateRange")}
                </Button>
                <Button
                  size="sm"
                  onClick={() => console.log("Export all reports")}
                >
                  <Download
                    className={`h-4 w-4 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {t("reports.exportAll")}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Financial Report Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button
                  size="sm"
                  variant="outline"
                  title={direction === "rtl" ? "تحميل PDF" : "Download PDF"}
                  onClick={() => console.log("Download PDF")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {direction === "rtl" ? "التقرير المالي" : "Financial Report"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {direction === "rtl"
                ? "عرض الإيرادات والمصروفات والنسب"
                : "View revenue, expenses, and percentages"}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "الإيرادات" : "Revenue"}:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(filteredData.totalRevenue)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {direction === "rtl" ? "آخر تحديث" : "Last Updated"}: 2{" "}
                {direction === "rtl" ? "أيام" : "days ago"}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedReport("financial")}
              >
                {direction === "rtl" ? "عرض التقرير" : "View Report"}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Charts Section */}
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {selectedReport === "financial" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t("reports.monthlyFinancialReport")}
                    </h3>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button
                        size="sm"
                        variant="outline"
                        title={t("reports.downloadPDF")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        title={t("reports.printReport")}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="h-80">
                    <Bar data={getRevenueData()} options={getChartOptions()} />
                  </div>
                </Card>

                <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {direction === "rtl"
                        ? "توزيع النسب المالية"
                        : "Financial Distribution"}
                    </h3>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {direction === "rtl"
                            ? "نسبة المالك"
                            : "Owner Percentage"}
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPercentage(filteredData.ownerPercentage)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {direction === "rtl"
                            ? "نسبة المصروفات"
                            : "Expenses Percentage"}
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatPercentage(filteredData.expensesPercentage)}
                        </p>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {direction === "rtl"
                          ? "نسبة مدير النظام"
                          : "System Manager Percentage"}
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatPercentage(filteredData.systemManagerPercentage)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reports;
