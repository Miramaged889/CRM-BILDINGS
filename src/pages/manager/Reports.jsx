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

  // Comprehensive Mock Data
  const mockData = {
    financial: {
      totalRevenue: 124500,
      totalExpenses: 45600,
      netProfit: 78900,
      monthlyRevenue: [45000, 52000, 48000, 61000, 55000, 67000],
      monthlyExpenses: [18000, 19500, 17200, 20100, 18900, 21300],
      revenueGrowth: 12.5,
      expenseGrowth: 8.2,
      profitMargin: 63.4,
    },
    occupancy: {
      totalUnits: 248,
      occupiedUnits: 186,
      vacantUnits: 62,
      occupancyRate: 75,
      monthlyOccupancy: [72, 75, 68, 78, 76, 82],
      unitTypes: {
        apartments: 120,
        villas: 80,
        offices: 35,
        shops: 13,
      },
      occupancyTrend: 5.2,
    },
    maintenance: {
      totalRequests: 156,
      completedRequests: 134,
      pendingRequests: 22,
      averageResponseTime: 2.4,
      monthlyRequests: [28, 32, 25, 35, 29, 31],
      monthlyCosts: [8200, 9500, 7800, 11200, 8900, 10100],
      costPerRequest: 65.4,
      satisfactionRate: 87.5,
      responseTimeTrend: -0.8,
    },
    tenant: {
      totalTenants: 186,
      activeTenants: 172,
      newTenants: 24,
      tenantSatisfaction: 4.2,
      leaseRenewals: 45,
      tenantRetention: 92.5,
      averageLeaseDuration: 18.5,
      monthlyNewTenants: [4, 6, 3, 8, 5, 7],
      satisfactionTrend: 0.3,
    },
  };

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
          data: mockData.financial.monthlyRevenue,
          backgroundColor: colors.primary,
          borderColor: colors.primary.replace("0.8", "1"),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: t("reports.expenses"),
          data: mockData.financial.monthlyExpenses,
          backgroundColor: colors.danger,
          borderColor: colors.danger.replace("0.8", "1"),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  };

  const getOccupancyData = () => {
    const colors = getColors();
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: t("reports.occupancyRate") + " (%)",
          data: mockData.occupancy.monthlyOccupancy,
          borderColor: colors.success.replace("0.8", "1"),
          backgroundColor: colors.success.replace("0.8", "0.1"),
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colors.success.replace("0.8", "1"),
          pointBorderColor: isDark ? "#1f2937" : "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  };

  const getMaintenanceData = () => {
    const colors = getColors();
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: t("reports.maintenanceRequests"),
          data: mockData.maintenance.monthlyRequests,
          backgroundColor: colors.warning,
          borderColor: colors.warning.replace("0.8", "1"),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  };

  const getUnitTypeData = () => {
    const colors = getColors();
    return {
      labels: [
        t("units.apartment"),
        t("units.villa"),
        t("units.office"),
        t("units.shop"),
      ],
      datasets: [
        {
          data: [
            mockData.occupancy.unitTypes.apartments,
            mockData.occupancy.unitTypes.villas,
            mockData.occupancy.unitTypes.offices,
            mockData.occupancy.unitTypes.shops,
          ],
          backgroundColor: [
            colors.primary,
            colors.success,
            colors.warning,
            colors.purple,
          ],
          borderColor: [
            colors.primary.replace("0.8", "1"),
            colors.success.replace("0.8", "1"),
            colors.warning.replace("0.8", "1"),
            colors.purple.replace("0.8", "1"),
          ],
          borderWidth: 2,
          hoverOffset: 4,
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
      title: t("reports.financialReport"),
      description: t("reports.financialDescription"),
      icon: TrendingUp,
      color: "green",
      data: mockData.financial,
    },
    {
      id: "occupancy",
      title: t("reports.occupancyReport"),
      description: t("reports.occupancyDescription"),
      icon: BarChart3,
      color: "blue",
      data: mockData.occupancy,
    },
    {
      id: "maintenance",
      title: t("reports.maintenanceReport"),
      description: t("reports.maintenanceDescription"),
      icon: Wrench,
      color: "yellow",
      data: mockData.maintenance,
    },
    {
      id: "tenant",
      title: t("reports.tenantReport"),
      description: t("reports.tenantDescription"),
      icon: Users,
      color: "purple",
      data: mockData.tenant,
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
                    {t("reports.totalRevenue")}
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(mockData.financial.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(mockData.financial.revenueGrowth)}
                    <span
                      className={`text-sm ml-1 ${getTrendColor(
                        mockData.financial.revenueGrowth
                      )}`}
                    >
                      {formatPercentage(mockData.financial.revenueGrowth)}
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
                    {t("reports.occupancyRate")}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPercentage(mockData.occupancy.occupancyRate)}
                  </p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(mockData.occupancy.occupancyTrend)}
                    <span
                      className={`text-sm ml-1 ${getTrendColor(
                        mockData.occupancy.occupancyTrend
                      )}`}
                    >
                      {formatPercentage(mockData.occupancy.occupancyTrend)}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                    {t("reports.maintenanceCosts")}
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatCurrency(
                      mockData.maintenance.monthlyCosts.reduce(
                        (a, b) => a + b,
                        0
                      )
                    )}
                  </p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(mockData.maintenance.responseTimeTrend)}
                    <span
                      className={`text-sm ml-1 ${getTrendColor(
                        mockData.maintenance.responseTimeTrend
                      )}`}
                    >
                      {formatPercentage(
                        Math.abs(mockData.maintenance.responseTimeTrend)
                      )}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                  <Wrench className="h-6 w-6 text-amber-600 dark:text-amber-400" />
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
                    {t("reports.totalUnits")}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {mockData.occupancy.totalUnits}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {mockData.occupancy.occupiedUnits} {t("reports.occupied")}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                {t("common.filter")} {t("reports.recentReports")}
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
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

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTypes.map((report, index) => {
            const IconComponent = report.icon;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border-0 bg-white dark:bg-gray-800 ${
                    selectedReport === report.id
                      ? "ring-2 ring-primary-500"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedReport(
                      selectedReport === report.id ? "" : report.id
                    )
                  }
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-full ${getColorClasses(
                        report.color
                      )}`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button
                        size="sm"
                        variant="outline"
                        title={t("reports.downloadPDF")}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Download PDF:", report.id);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {report.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {report.id === "financial" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {t("reports.revenue")}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(report.data.totalRevenue)}
                        </span>
                      </div>
                    )}
                    {report.id === "occupancy" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {t("reports.occupancyRate")}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatPercentage(report.data.occupancyRate)}
                        </span>
                      </div>
                    )}
                    {report.id === "maintenance" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {t("reports.completedRequests")}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {report.data.completedRequests}
                        </span>
                      </div>
                    )}
                    {report.id === "tenant" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {t("reports.totalTenants")}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {report.data.totalTenants}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t("reports.lastUpdated")}: 2 {t("reports.daysAgo")}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report.id);
                        console.log("Generate report:", report.id);
                      }}
                    >
                      {t("reports.generate")}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

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
                      {t("reports.profit")} {t("reports.monthlyTrends")}
                    </h3>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("reports.revenue")}
                        </p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(mockData.financial.totalRevenue)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("reports.expenses")}
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(mockData.financial.totalExpenses)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("reports.profit")}
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(mockData.financial.netProfit)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {selectedReport === "occupancy" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t("reports.occupancyAnalysis")}
                    </h3>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="h-80">
                    <Line
                      data={getOccupancyData()}
                      options={getChartOptions()}
                    />
                  </div>
                </Card>

                <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t("reports.unitTypes")}
                    </h3>
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-80 h-80">
                      <Doughnut
                        data={getUnitTypeData()}
                        options={{
                          ...getChartOptions(),
                          plugins: {
                            ...getChartOptions().plugins,
                            legend: {
                              ...getChartOptions().plugins.legend,
                              position: "bottom",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {selectedReport === "maintenance" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t("reports.maintenanceRequests")}
                    </h3>
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  </div>
                  <div className="h-80">
                    <Bar
                      data={getMaintenanceData()}
                      options={getChartOptions()}
                    />
                  </div>
                </Card>

                <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t("reports.maintenanceSummary")}
                    </h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("reports.completedRequests")}
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {mockData.maintenance.completedRequests}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("reports.pendingRequests")}
                        </p>
                        <p className="text-2xl font-bold text-amber-600">
                          {mockData.maintenance.pendingRequests}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("reports.averageResponseTime")}
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {mockData.maintenance.averageResponseTime} days
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Satisfaction Rate
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatPercentage(
                            mockData.maintenance.satisfactionRate
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {selectedReport === "tenant" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t("reports.tenantSatisfaction")}
                    </h3>
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {mockData.tenant.tenantSatisfaction}/5
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Average Rating
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("reports.totalTenants")}
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {mockData.tenant.totalTenants}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("reports.activeTenants")}
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {mockData.tenant.activeTenants}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t("reports.leaseRenewals")}
                    </h3>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("reports.leaseRenewals")}
                        </p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {mockData.tenant.leaseRenewals}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Retention Rate
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPercentage(mockData.tenant.tenantRetention)}
                        </p>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Average Lease Duration
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {mockData.tenant.averageLeaseDuration} months
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        )}

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t("reports.recentReports")}
              </h3>

              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    name: `${t(
                      "reports.monthlyFinancialReport"
                    )} - January 2024`,
                    date: "2024-01-31",
                    type: t("reports.financialReport"),
                    size: "2.4 MB",
                    status: "completed",
                  },
                  {
                    id: 2,
                    name: `${t("reports.occupancyAnalysis")} - Q4 2023`,
                    date: "2023-12-31",
                    type: t("reports.occupancyReport"),
                    size: "1.8 MB",
                    status: "completed",
                  },
                  {
                    id: 3,
                    name: `${t("reports.maintenanceSummary")} - December 2023`,
                    date: "2023-12-31",
                    type: t("reports.maintenanceReport"),
                    size: "3.2 MB",
                    status: "completed",
                  },
                  {
                    id: 4,
                    name: `${t("reports.tenantReport")} - November 2023`,
                    date: "2023-11-30",
                    type: t("reports.tenantReport"),
                    size: "1.5 MB",
                    status: "completed",
                  },
                ].map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {report.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {report.type} • {report.date} • {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {report.status}
                      </span>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Button
                          size="sm"
                          variant="outline"
                          title={t("reports.viewDetails")}
                          onClick={() => console.log("View report:", report.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          title={t("reports.downloadPDF")}
                          onClick={() =>
                            console.log("Download report:", report.id)
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          title={t("reports.shareReport")}
                          onClick={() =>
                            console.log("Share report:", report.id)
                          }
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
