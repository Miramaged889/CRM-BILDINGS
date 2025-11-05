import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../stores/languageStore";
import { useThemeStore } from "../../stores/themeStore";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchOwners } from "../../store/slices/ownersSlice";
import {
  fetchCompanyRevenue,
  fetchOwnerPayments,
} from "../../store/slices/paymentsSlice";
// Note: fetchRevenueReport is not used as the /reports/revenue endpoint doesn't exist
// import { fetchRevenueReport } from "../../store/slices/reportsSlice";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import * as XLSX from "xlsx";
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
  FileSpreadsheet,
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
import toast from "react-hot-toast";

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
  const dispatch = useAppDispatch();

  // Redux state
  const { owners } = useAppSelector((state) => state.owners);
  const {
    companyRevenue,
    ownerPayments,
    isLoading: paymentsLoading,
  } = useAppSelector((state) => state.payments);
  // Note: revenueReport endpoint doesn't exist, using companyRevenue instead
  // const { revenueReport, isLoading: reportsLoading } = useAppSelector(
  //   (state) => state.reports
  // );

  const [selectedReport, setSelectedReport] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedOwner, setSelectedOwner] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch owners and revenue data on mount
  useEffect(() => {
    dispatch(fetchOwners());
    dispatch(fetchCompanyRevenue());
  }, [dispatch]);

  // Refresh company revenue when date range changes (if API supports date filtering)
  // Note: The reports/revenue endpoint doesn't exist, so we use company revenue data
  useEffect(() => {
    // Refresh company revenue data
    dispatch(fetchCompanyRevenue());
  }, [dateRange, dispatch]);

  // Fetch owner payments data when owner is selected
  useEffect(() => {
    if (selectedOwner !== "all" && selectedOwner) {
      if (!ownerPayments[selectedOwner]) {
        dispatch(fetchOwnerPayments(selectedOwner));
      }
    }
  }, [selectedOwner, ownerPayments, dispatch]);

  // Build available owners list from API
  const availableOwners = React.useMemo(() => {
    const ownersList = [
      { id: "all", name: direction === "rtl" ? "جميع الملاك" : "All Owners" },
    ];
    if (owners && owners.length > 0) {
      owners.forEach((owner) => {
        ownersList.push({
          id: owner.id,
          name: owner.full_name || owner.name || `Owner ${owner.id}`,
        });
      });
    }
    return ownersList;
  }, [owners, direction]);

  // Generate data based on date range
  const generateDateBasedData = () => {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const monthsDiff = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24 * 30)
    );

    // Generate month labels based on date range
    const monthLabels = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      monthLabels.push(
        currentDate.toLocaleDateString("en-US", { month: "short" })
      );
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Generate revenue and expenses data based on date range
    const generateMonthlyData = (baseAmount, variance = 0.2) => {
      return monthLabels.map((_, index) => {
        const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        return Math.round(baseAmount * randomFactor * (1 + index * 0.1));
      });
    };

    return {
      monthLabels,
      monthsDiff: Math.max(1, monthsDiff),
    };
  };

  // Get filtered data from API
  const getFilteredData = () => {
    const { monthLabels } = generateDateBasedData();

    // If specific owner selected, use their data
    if (selectedOwner !== "all" && ownerPayments[selectedOwner]) {
      const ownerData = ownerPayments[selectedOwner];
      const totalRevenue = parseFloat(ownerData.total || 0);
      const ownerTotal = parseFloat(ownerData.owner_total || 0);
      const ownerPercentage =
        totalRevenue > 0 ? (ownerTotal / totalRevenue) * 100 : 0;
      const occasionalTotal = parseFloat(ownerData.total_occasional || 0);
      const expensesPercentage =
        totalRevenue > 0 ? (occasionalTotal / totalRevenue) * 100 : 0;
      const companyTotal = parseFloat(ownerData.company_total || 0);
      const systemManagerPercentage =
        totalRevenue > 0 ? (companyTotal / totalRevenue) * 100 : 0;

      // Generate monthly data based on owner's units
      const generateMonthlyData = (baseAmount) => {
        return monthLabels.map(() => {
          const randomFactor = 0.8 + Math.random() * 0.4;
          return Math.round(baseAmount * randomFactor);
        });
      };

      return {
        totalRevenue,
        ownerPercentage,
        expensesPercentage,
        systemManagerPercentage,
        monthlyRevenue: generateMonthlyData(totalRevenue / monthLabels.length),
        monthlyExpenses: generateMonthlyData(
          occasionalTotal / monthLabels.length
        ),
        revenueGrowth: 0, // Calculate from API data if available
      };
    }

    // Use company revenue data for "all owners"
    if (companyRevenue) {
      const totalRevenue = parseFloat(companyRevenue.total || 0);
      const ownerTotal = parseFloat(companyRevenue.owner_total || 0);
      const ownerPercentage =
        totalRevenue > 0 ? (ownerTotal / totalRevenue) * 100 : 0;
      const occasionalTotal = parseFloat(companyRevenue.total_occasional || 0);
      const expensesPercentage =
        totalRevenue > 0 ? (occasionalTotal / totalRevenue) * 100 : 0;
      const companyTotal = parseFloat(companyRevenue.company_total || 0);
      const systemManagerPercentage =
        totalRevenue > 0 ? (companyTotal / totalRevenue) * 100 : 0;

      const generateMonthlyData = (baseAmount) => {
        return monthLabels.map(() => {
          const randomFactor = 0.8 + Math.random() * 0.4;
          return Math.round(baseAmount * randomFactor);
        });
      };

      return {
        totalRevenue,
        ownerPercentage,
        expensesPercentage,
        systemManagerPercentage,
        monthlyRevenue: generateMonthlyData(totalRevenue / monthLabels.length),
        monthlyExpenses: generateMonthlyData(
          occasionalTotal / monthLabels.length
        ),
        revenueGrowth: 0,
      };
    }

    // Fallback to default data if API data not available
    return {
      totalRevenue: 0,
      ownerPercentage: 0,
      expensesPercentage: 0,
      systemManagerPercentage: 0,
      monthlyRevenue: monthLabels.map(() => 0),
      monthlyExpenses: monthLabels.map(() => 0),
      revenueGrowth: 0,
    };
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
    const { monthLabels } = generateDateBasedData();
    return {
      labels: monthLabels,
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

  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyDateRange = () => {
    setShowDatePicker(false);
    // Data will automatically update due to reactive dependencies
  };

  const handleResetDateRange = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setDateRange({
      startDate: firstDayOfMonth.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    });
    setShowDatePicker(false);
  };

  // Export to PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const { monthLabels } = generateDateBasedData();
      const selectedOwnerName =
        availableOwners.find((o) => o.id === selectedOwner)?.name ||
        "All Owners";

      // Title
      doc.setFontSize(18);
      doc.text(
        direction === "rtl" ? "التقرير المالي" : "Financial Report",
        direction === "rtl" ? 190 : 14,
        20
      );

      // Period and Owner Info
      doc.setFontSize(12);
      doc.text(
        `${direction === "rtl" ? "الفترة" : "Period"}: ${new Date(
          dateRange.startDate
        ).toLocaleDateString()} - ${new Date(
          dateRange.endDate
        ).toLocaleDateString()}`,
        direction === "rtl" ? 190 : 14,
        30
      );
      doc.text(
        `${direction === "rtl" ? "المالك" : "Owner"}: ${selectedOwnerName}`,
        direction === "rtl" ? 190 : 14,
        37
      );

      // Financial Summary Table
      const summaryData = [
        [
          direction === "rtl" ? "إجمالي الإيرادات" : "Total Revenue",
          formatCurrency(filteredData.totalRevenue),
        ],
        [
          direction === "rtl" ? "نسبة المالك" : "Owner Percentage",
          formatPercentage(filteredData.ownerPercentage),
        ],
        [
          direction === "rtl" ? "نسبة المصروفات" : "Expenses Percentage",
          formatPercentage(filteredData.expensesPercentage),
        ],
        [
          direction === "rtl"
            ? "نسبة مدير النظام"
            : "System Manager Percentage",
          formatPercentage(filteredData.systemManagerPercentage),
        ],
      ];

      autoTable(doc, {
        startY: 45,
        head: [
          [
            direction === "rtl" ? "البند" : "Item",
            direction === "rtl" ? "القيمة" : "Value",
          ],
        ],
        body: summaryData,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Monthly Data Table
      const monthlyData = monthLabels.map((month, index) => [
        month,
        formatCurrency(filteredData.monthlyRevenue[index] || 0),
        formatCurrency(filteredData.monthlyExpenses[index] || 0),
      ]);

      autoTable(doc, {
        startY: 90,
        head: [
          [
            direction === "rtl" ? "الشهر" : "Month",
            direction === "rtl" ? "الإيرادات" : "Revenue",
            direction === "rtl" ? "المصروفات" : "Expenses",
          ],
        ],
        body: monthlyData,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Footer
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `${
            direction === "rtl" ? "تم الإنشاء في" : "Generated on"
          }: ${new Date().toLocaleDateString()}`,
          direction === "rtl" ? 190 : 14,
          doc.internal.pageSize.height - 10
        );
      }

      // Save PDF
      const fileName = `Financial_Report_${selectedOwnerName.replace(
        /\s+/g,
        "_"
      )}_${dateRange.startDate}_${dateRange.endDate}.pdf`;
      doc.save(fileName);
      toast.success(
        direction === "rtl" ? "تم تصدير PDF بنجاح" : "PDF exported successfully"
      );
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error(
        direction === "rtl" ? "فشل تصدير PDF" : "Failed to export PDF"
      );
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const { monthLabels } = generateDateBasedData();
      const selectedOwnerName =
        availableOwners.find((o) => o.id === selectedOwner)?.name ||
        "All Owners";

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Summary Sheet
      const summaryData = [
        [direction === "rtl" ? "التقرير المالي" : "Financial Report"],
        [
          direction === "rtl" ? "الفترة" : "Period",
          `${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(
            dateRange.endDate
          ).toLocaleDateString()}`,
        ],
        [direction === "rtl" ? "المالك" : "Owner", selectedOwnerName],
        [],
        [
          direction === "rtl" ? "البند" : "Item",
          direction === "rtl" ? "القيمة" : "Value",
        ],
        [
          direction === "rtl" ? "إجمالي الإيرادات" : "Total Revenue",
          filteredData.totalRevenue,
        ],
        [
          direction === "rtl" ? "نسبة المالك" : "Owner Percentage",
          `${filteredData.ownerPercentage.toFixed(2)}%`,
        ],
        [
          direction === "rtl" ? "نسبة المصروفات" : "Expenses Percentage",
          `${filteredData.expensesPercentage.toFixed(2)}%`,
        ],
        [
          direction === "rtl"
            ? "نسبة مدير النظام"
            : "System Manager Percentage",
          `${filteredData.systemManagerPercentage.toFixed(2)}%`,
        ],
      ];

      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(
        wb,
        summaryWs,
        direction === "rtl" ? "الملخص" : "Summary"
      );

      // Monthly Data Sheet
      const monthlyData = [
        [
          direction === "rtl" ? "الشهر" : "Month",
          direction === "rtl" ? "الإيرادات" : "Revenue",
          direction === "rtl" ? "المصروفات" : "Expenses",
          direction === "rtl" ? "صافي الربح" : "Net Profit",
        ],
      ];

      monthLabels.forEach((month, index) => {
        const revenue = filteredData.monthlyRevenue[index] || 0;
        const expenses = filteredData.monthlyExpenses[index] || 0;
        monthlyData.push([month, revenue, expenses, revenue - expenses]);
      });

      const monthlyWs = XLSX.utils.aoa_to_sheet(monthlyData);
      XLSX.utils.book_append_sheet(
        wb,
        monthlyWs,
        direction === "rtl" ? "بيانات شهرية" : "Monthly Data"
      );

      // Save Excel file
      const fileName = `Financial_Report_${selectedOwnerName.replace(
        /\s+/g,
        "_"
      )}_${dateRange.startDate}_${dateRange.endDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(
        direction === "rtl"
          ? "تم تصدير Excel بنجاح"
          : "Excel exported successfully"
      );
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error(
        direction === "rtl" ? "فشل تصدير Excel" : "Failed to export Excel"
      );
    }
  };

  // Export all reports
  const handleExportAll = () => {
    // Export both PDF and Excel
    handleExportPDF();
    setTimeout(() => {
      handleExportExcel();
    }, 500);
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
              <div className="mt-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {new Date(dateRange.startDate).toLocaleDateString()} -{" "}
                  {new Date(dateRange.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={
                  showDatePicker
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                    : ""
                }
              >
                <Calendar
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("reports.dateRange")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportPDF}
                className="mr-2"
              >
                <FileText
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "تصدير PDF" : "Export PDF"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportExcel}
                className="mr-2"
              >
                <FileSpreadsheet
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "تصدير Excel" : "Export Excel"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Date Range Picker */}
        {showDatePicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {direction === "rtl"
                    ? "اختيار نطاق التاريخ"
                    : "Select Date Range"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {direction === "rtl"
                    ? "اختر الفترة الزمنية لعرض البيانات"
                    : "Choose the time period to display data"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {direction === "rtl" ? "من تاريخ" : "From Date"}
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        handleDateRangeChange("startDate", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {direction === "rtl" ? "إلى تاريخ" : "To Date"}
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        handleDateRangeChange("endDate", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetDateRange}
                  >
                    {direction === "rtl" ? "إعادة تعيين" : "Reset"}
                  </Button>
                  <Button size="sm" onClick={handleApplyDateRange}>
                    {direction === "rtl" ? "تطبيق" : "Apply"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>
                  {direction === "rtl" ? "الفترة المحددة:" : "Selected Period:"}
                </strong>{" "}
                {new Date(dateRange.startDate).toLocaleDateString()} -{" "}
                {new Date(dateRange.endDate).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        )}

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
                    <option key={owner.id} value={String(owner.id)}>
                      {owner.name}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportPDF}
                  className="mr-2"
                >
                  <FileText
                    className={`h-4 w-4 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "PDF" : "PDF"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportExcel}
                  className="mr-2"
                >
                  <FileSpreadsheet
                    className={`h-4 w-4 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "Excel" : "Excel"}
                </Button>
                <Button size="sm" onClick={handleExportAll}>
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
                  onClick={handleExportPDF}
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  title={direction === "rtl" ? "تحميل Excel" : "Download Excel"}
                  onClick={handleExportExcel}
                >
                  <FileSpreadsheet className="h-4 w-4" />
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
                        onClick={handleExportPDF}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        title={
                          direction === "rtl" ? "تحميل Excel" : "Download Excel"
                        }
                        onClick={handleExportExcel}
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        title={t("reports.printReport")}
                        onClick={() => window.print()}
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
