import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchHomeMetrics,
  fetchStockMetrics,
  clearError,
} from "../../store/slices/dashboardSlice";
import { fetchNotifications } from "../../store/slices/notificationsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useThemeStore } from "../../stores/themeStore";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { homeMetrics, stockMetrics, isLoading, error } = useAppSelector(
    (state) => state.dashboard
  );
  const { notifications, isLoading: notificationsLoading } = useAppSelector(
    (state) => state.notifications
  );
  const { isDark } = useThemeStore();

  // Fetch metrics on mount
  useEffect(() => {
    dispatch(fetchHomeMetrics());
    dispatch(fetchStockMetrics());
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate occupancy rate
  const occupancyRate = homeMetrics?.total_units
    ? Math.round(
        (homeMetrics.total_units_occupied / homeMetrics.total_units) * 100
      )
    : 0;

  const stats = [
    {
      title: t("dashboard.totalUnits"),
      value: homeMetrics?.total_units?.toString() || "0",
      change: occupancyRate + "% " + t("dashboard.occupancyRate"),
      changeType: "positive",
      icon: "Building",
      color: "primary",
    },
    {
      title: t("dashboard.occupiedUnits"),
      value: homeMetrics?.total_units_occupied?.toString() || "0",
      change: `${
        homeMetrics?.total_units
          ? Math.round(
              (homeMetrics.total_units_occupied / homeMetrics.total_units) * 100
            )
          : 0
      }% ${t("dashboard.occupancyRate")}`,
      changeType: "positive",
      icon: "Users",
      color: "green",
    },
    {
      title: t("dashboard.totalRevenue"),
      value: homeMetrics?.total_revenue
        ? formatCurrency(homeMetrics.total_revenue)
        : "$0",
      change: t("dashboard.fromLastMonth"),
      changeType: "positive",
      icon: "DollarSign",
      color: "blue",
    },
    {
      title: t("dashboard.pendingPayments"),
      value: homeMetrics?.pending_payments
        ? formatCurrency(homeMetrics.pending_payments)
        : "$0",
      change: t("dashboard.dueThisWeek"),
      changeType: "neutral",
      icon: "Clock",
      color: "yellow",
    },
    {
      title: t("dashboard.stockItems"),
      value: stockMetrics?.total_items?.toString() || "0",
      change: `${stockMetrics?.in_stock_items || 0} ${t("dashboard.inStock")}`,
      changeType:
        stockMetrics?.out_of_stock_items > 0 ? "negative" : "positive",
      icon: "Package",
      color: "purple",
    },
    {
      title: t("dashboard.newTenants"),
      value: homeMetrics?.new_tenants?.toString() || "0",
      change: t("dashboard.thisMonth"),
      changeType: "positive",
      icon: "UserPlus",
      color: "purple",
    },
  ];

  // Chart data from API metrics
  const chartData = useMemo(() => {
    // Handle various API response structures for monthly revenue and occupancy
    const monthlyRevenue =
      homeMetrics?.monthly_revenue || homeMetrics?.revenue_by_month || [];
    const monthlyOccupancy =
      homeMetrics?.monthly_occupancy || homeMetrics?.occupancy_by_month || [];

    // If we have API data, use it
    if (Array.isArray(monthlyRevenue) && monthlyRevenue.length > 0) {
      // Combine revenue and occupancy data
      const revenueMap = new Map();
      monthlyRevenue.forEach((item) => {
        const month =
          item.month || item.date || item.period || t("dashboard.unknown");
        revenueMap.set(month, {
          month: month,
          revenue: parseFloat(item.revenue || item.amount || item.value || 0),
        });
      });

      monthlyOccupancy.forEach((item) => {
        const month =
          item.month || item.date || item.period || t("dashboard.unknown");
        const existing = revenueMap.get(month) || { month: month, revenue: 0 };
        revenueMap.set(month, {
          ...existing,
          units: parseFloat(item.units || item.occupied || item.value || 0),
        });
      });

      // Convert to array and sort by month
      return Array.from(revenueMap.values())
        .map((item) => ({
          month: item.month,
          revenue: item.revenue || 0,
          units: item.units || 0,
        }))
        .sort((a, b) => {
          // Simple month sorting
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const aIndex = months.indexOf(a.month.substring(0, 3));
          const bIndex = months.indexOf(b.month.substring(0, 3));
          return aIndex - bIndex;
        });
    }

    // Fallback to default data if no API data
    return [
      { month: "Jan", revenue: 45000, units: 180 },
      { month: "Feb", revenue: 52000, units: 185 },
      { month: "Mar", revenue: 48000, units: 178 },
      { month: "Apr", revenue: 61000, units: 195 },
      { month: "May", revenue: 55000, units: 188 },
      { month: "Jun", revenue: 67000, units: 205 },
    ];
  }, [homeMetrics]);

  // Enhanced theme-aware colors for better visibility
  const colors = {
    primary: isDark ? "#60A5FA" : "#2563EB",
    secondary: isDark ? "#34D399" : "#059669",
    grid: isDark ? "rgba(107, 114, 128, 0.15)" : "rgba(156, 163, 175, 0.2)",
    text: isDark ? "#E5E7EB" : "#374151",
    axisText: isDark ? "#D1D5DB" : "#4B5563",
    background: isDark ? "#1F2937" : "#FFFFFF",
    border: isDark ? "#374151" : "#E5E7EB",
    tooltipBg: isDark ? "#374151" : "#F9FAFB",
    tooltipBorder: isDark ? "#4B5563" : "#D1D5DB",
  };

  // Enhanced chart configuration with better visibility
  const chartConfig = {
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
    grid: {
      strokeDasharray: "2 2",
      stroke: colors.grid,
      strokeWidth: 1,
    },
    axis: {
      stroke: colors.axisText,
      fontSize: 12,
      fontWeight: 500,
      tickLine: true,
      axisLine: true,
      fill: colors.axisText,
    },
    tooltip: {
      backgroundColor: colors.tooltipBg,
      border: `1px solid ${colors.tooltipBorder}`,
      borderRadius: "8px",
      color: colors.text,
      boxShadow: isDark
        ? "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)"
        : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      fontSize: "13px",
      fontWeight: 500,
    },
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffMinutes < 60) {
        return `${diffMinutes} ${t("dashboard.minutesAgo")}`;
      } else if (diffHours < 24) {
        return `${diffHours} ${t("dashboard.hoursAgo")}`;
      } else {
        return `${diffDays} ${t("dashboard.daysAgo")}`;
      }
    } catch (e) {
      return dateString;
    }
  };

  // Map notifications to recent activity format
  const recentActivity = useMemo(() => {
    // Ensure notifications is always an array
    const notificationsArray = Array.isArray(notifications)
      ? notifications
      : [];
    if (notificationsArray.length === 0) return [];

    return notificationsArray
      .slice(0, 10) // Get latest 10 notifications
      .map((notification) => {
        const message =
          notification.message || notification.title || notification.text || "";
        const createdAt =
          notification.created_at ||
          notification.createdAt ||
          notification.date ||
          "";

        return {
          id: notification.id,
          action: message,
          tenant: notification.tenant_name || notification.tenant || "",
          unit: notification.unit_name || notification.unit || "",
          amount: notification.amount || "",
          time: formatTimeAgo(createdAt),
          type: notification.type || notification.category || "",
          read: notification.read || notification.is_read || false,
        };
      });
  }, [notifications, t]);

  // Early return after all hooks are called
  if (isLoading && !homeMetrics && !stockMetrics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

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
            {t("dashboard.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            {t("dashboard.welcome")},{" "}
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              {user?.name ||
                user?.full_name ||
                user?.email ||
                t("dashboard.manager")}
            </span>
          </p>
        </div>

        <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="sm"
            className="shadow-sm hover:shadow-md transition-shadow"
            onClick={() => navigate("/units")}
          >
            {t("dashboard.addUnit")}
          </Button>
          <Button
            size="sm"
            className="shadow-sm hover:shadow-md transition-shadow"
            onClick={() => navigate("/tenants")}
          >
            {t("dashboard.addTenant")}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} index={index} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("dashboard.monthlyRevenue")}
                </h3>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t("dashboard.period6Months")}
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="relative bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={chartConfig.margin}>
                  <CartesianGrid
                    strokeDasharray={chartConfig.grid.strokeDasharray}
                    stroke={chartConfig.grid.stroke}
                    strokeWidth={chartConfig.grid.strokeWidth}
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={chartConfig.axis.stroke}
                    fontSize={chartConfig.axis.fontSize}
                    fontWeight={chartConfig.axis.fontWeight}
                    tickLine={chartConfig.axis.tickLine}
                    axisLine={chartConfig.axis.axisLine}
                    fill={chartConfig.axis.fill}
                    tick={{
                      fill: colors.axisText,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                    dy={10}
                  />
                  <YAxis
                    stroke={chartConfig.axis.stroke}
                    fontSize={chartConfig.axis.fontSize}
                    fontWeight={chartConfig.axis.fontWeight}
                    tickLine={chartConfig.axis.tickLine}
                    axisLine={chartConfig.axis.axisLine}
                    fill={chartConfig.axis.fill}
                    tick={{
                      fill: colors.axisText,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      ...chartConfig.tooltip,
                      padding: "12px 16px",
                    }}
                    labelStyle={{
                      color: colors.text,
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      t("dashboard.monthlyRevenue"),
                    ]}
                    cursor={{
                      fill: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill={colors.primary}
                    radius={[6, 6, 0, 0]}
                    strokeWidth={0}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Occupancy Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("dashboard.unitOccupancyTrend")}
                </h3>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t("dashboard.period6Months")}
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="relative bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={chartConfig.margin}>
                  <CartesianGrid
                    strokeDasharray={chartConfig.grid.strokeDasharray}
                    stroke={chartConfig.grid.stroke}
                    strokeWidth={chartConfig.grid.strokeWidth}
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={chartConfig.axis.stroke}
                    fontSize={chartConfig.axis.fontSize}
                    fontWeight={chartConfig.axis.fontWeight}
                    tickLine={chartConfig.axis.tickLine}
                    axisLine={chartConfig.axis.axisLine}
                    fill={chartConfig.axis.fill}
                    tick={{
                      fill: colors.axisText,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                    dy={10}
                  />
                  <YAxis
                    stroke={chartConfig.axis.stroke}
                    fontSize={chartConfig.axis.fontSize}
                    fontWeight={chartConfig.axis.fontWeight}
                    tickLine={chartConfig.axis.tickLine}
                    axisLine={chartConfig.axis.axisLine}
                    fill={chartConfig.axis.fill}
                    tick={{
                      fill: colors.axisText,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      ...chartConfig.tooltip,
                      padding: "12px 16px",
                    }}
                    labelStyle={{
                      color: colors.text,
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                    formatter={(value) => [
                      `${value} ${t("dashboard.units")}`,
                      t("dashboard.unitOccupancyTrend"),
                    ]}
                    cursor={{
                      stroke: colors.secondary,
                      strokeWidth: 1,
                      strokeDasharray: "3 3",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="units"
                    stroke={colors.secondary}
                    strokeWidth={3}
                    dot={{
                      fill: colors.secondary,
                      strokeWidth: 2,
                      r: 4,
                      stroke: colors.background,
                    }}
                    activeDot={{
                      r: 6,
                      stroke: colors.secondary,
                      strokeWidth: 2,
                      fill: colors.background,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("dashboard.recentActivity")}
              </h3>
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
            <div className="space-y-4">
              {notificationsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    {t("common.loading")}
                  </p>
                </div>
              ) : recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className={`flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-shadow duration-200 ${
                      activity.read
                        ? "bg-gray-50 dark:bg-gray-700/50"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600"
                    }`}
                  >
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.read
                            ? "bg-gray-400 dark:bg-gray-500"
                            : "bg-primary-500"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.tenant && `${activity.tenant} • `}
                          {activity.unit && `${activity.unit} • `}
                          {activity.amount && `${activity.amount} • `}
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    {t("dashboard.noActivity")}
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t("dashboard.noActivityDescription")}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("dashboard.quickActions")}
              </h3>
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-primary-50 dark:hover:bg-primary-900/20"
                size="sm"
                onClick={() => navigate("/units")}
              >
                {t("dashboard.addUnit")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-primary-50 dark:hover:bg-primary-900/20"
                size="sm"
                onClick={() => navigate("/tenants")}
              >
                {t("dashboard.addTenant")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-primary-50 dark:hover:bg-primary-900/20"
                size="sm"
                onClick={() => navigate("/payments")}
              >
                {t("dashboard.recordPayment")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-primary-50 dark:hover:bg-primary-900/20"
                size="sm"
                onClick={() => navigate("/reports")}
              >
                {t("dashboard.generateReport")}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
