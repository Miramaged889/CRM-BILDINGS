import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useLanguageStore } from "../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  Calendar as CalendarIcon,
  MapPin,
  Home,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Card from "../../components/ui/Card";
import { getRents } from "../../services/api";
import api from "../../services/api";
import API_ENDPOINTS from "../../services/apiEndpoints";
import toast from "react-hot-toast";

// Helpers
const toISODate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const addDays = (date, days) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const endOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

const Calendar = () => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");
  const [periods, setPeriods] = useState([]);
  const [loadingRents, setLoadingRents] = useState(false);

  // Function to fetch rents
  const fetchRents = useCallback(async () => {
    setLoadingRents(true);
    try {
      const response = await getRents({});
      // Handle paginated response with results array
      const rentsData = response?.results || response?.data || response || [];
      const rentsArray = Array.isArray(rentsData) ? rentsData : [];

        // Get unique unit IDs
        const unitIds = new Set();
        rentsArray.forEach((rent) => {
          if (rent.unit) {
            const unitId =
              typeof rent.unit === "object" ? rent.unit.id : rent.unit;
            if (unitId) unitIds.add(unitId);
          }
        });

        // Fetch all units in parallel
        const unitPromises = Array.from(unitIds).map((unitId) =>
          api
            .get(API_ENDPOINTS.UNITS.DETAIL(unitId))
            .then((data) => ({ id: unitId, data }))
            .catch((error) => {
              console.error(`Error fetching unit ${unitId}:`, error);
              return { id: unitId, data: null };
            })
        );

        const unitsData = await Promise.all(unitPromises);
        const unitsMap = new Map();
        unitsData.forEach(({ id, data }) => {
          if (data) unitsMap.set(id, data);
        });

        // Convert rents to periods format
        const periodsArray = rentsArray
          .filter((rent) => rent.rent_start && rent.rent_end)
          .map((rent) => {
            const unitId =
              typeof rent.unit === "object" ? rent.unit.id : rent.unit;
            const unitData = unitsMap.get(unitId);

            // Get unit information
            let unitName = `Unit #${unitId || "-"}`;
            let buildingName = "-";

            if (unitData) {
              unitName = unitData.name || unitName;
              buildingName =
                unitData.building_name ||
                unitData.building ||
                (unitData.city_name || unitData.city || "") +
                  (unitData.district_name || unitData.district
                    ? ` - ${unitData.district_name || unitData.district}`
                    : "");
            }

            // Map payment_status to calendar status
            let status = "occupied"; // default
            if (rent.payment_status === "paid") {
              status = "occupied";
            } else if (rent.payment_status === "pending") {
              status = "maintenance";
            } else if (rent.payment_status === "overdue") {
              status = "inspection";
            }

            return {
              id: `rent-${rent.id}`,
              kind: "unit",
              entity: unitName,
              status: status,
              start: rent.rent_start,
              end: rent.rent_end,
              where: buildingName,
              rentId: rent.id,
            };
          });

        setPeriods(periodsArray);
      } catch (error) {
        console.error("Error fetching rents:", error);
        toast.error(
          direction === "rtl" ? "فشل تحميل الإيجارات" : "Failed to load rents"
        );
        setPeriods([]);
      } finally {
        setLoadingRents(false);
      }
  }, [direction]);

  // Fetch rents on mount and when direction changes
  useEffect(() => {
    fetchRents();
  }, [fetchRents]);

  // Listen for rent creation/update events to refresh calendar
  useEffect(() => {
    const handleRentUpdate = () => {
      fetchRents();
    };

    window.addEventListener("rent-created", handleRentUpdate);
    window.addEventListener("rent-updated", handleRentUpdate);
    window.addEventListener("rent-deleted", handleRentUpdate);

    return () => {
      window.removeEventListener("rent-created", handleRentUpdate);
      window.removeEventListener("rent-updated", handleRentUpdate);
      window.removeEventListener("rent-deleted", handleRentUpdate);
    };
  }, [fetchRents]);

  const monthLabel = useMemo(() => {
    return currentDate.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  const weekdays = useMemo(() => {
    const en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const ar = ["أحد", "إثن", "ثلث", "أرب", "خمس", "جمع", "سبت"];
    return direction === "rtl" ? ar : en;
  }, [direction]);

  const monthGrid = useMemo(() => {
    const first = startOfMonth(currentDate);
    const startWeekday = first.getDay();
    const gridStart = addDays(first, -startWeekday);
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = addDays(gridStart, i);
      days.push({
        date: day,
        iso: toISODate(day),
        inCurrentMonth: day.getMonth() === currentDate.getMonth(),
      });
    }
    return days;
  }, [currentDate]);

  const filteredPeriods = useMemo(() => {
    let result = periods;
    if (filter !== "all") {
      result = result.filter((p) => p.kind === filter);
    }
    if (unitFilter !== "all") {
      result = result.filter((p) =>
        p.kind === "unit" ? p.entity === unitFilter : true
      );
    }
    return result;
  }, [filter, unitFilter, periods]);

  const unitOptions = useMemo(() => {
    const set = new Set();
    for (const p of periods) if (p.kind === "unit") set.add(p.entity);
    return Array.from(set).sort();
  }, [periods]);

  const busyByDate = useMemo(() => {
    const m = {};
    for (const p of filteredPeriods) {
      for (let d = new Date(p.start); d <= new Date(p.end); d = addDays(d, 1)) {
        const iso = toISODate(d);
        (m[iso] = m[iso] || []).push(p);
      }
    }
    return m;
  }, [filteredPeriods]);

  const chipFor = (status) => {
    if (status === "occupied")
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
    if (status === "maintenance")
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
    if (status === "inspection")
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
    return "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300";
  };
  const translateStatus = (status) => {
    if (status === "occupied")
      return direction === "rtl" ? "مشغول" : "Occupied";
    if (status === "maintenance")
      return direction === "rtl" ? "صيانة" : "Maintenance";
    if (status === "inspection")
      return direction === "rtl" ? "تفتيش" : "Inspection";
    return status;
  };

  const isToday = (d) => {
    const n = new Date();
    return (
      d.getFullYear() === n.getFullYear() &&
      d.getMonth() === n.getMonth() &&
      d.getDate() === n.getDate()
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {direction === "rtl" ? "التقويم" : "Calendar"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {direction === "rtl" ? "أحداث الإيجارات" : "Rents Events"}
            </p>
            {loadingRents && (
              <div className="text-sm text-primary-600 dark:text-primary-400 mt-2">
                {direction === "rtl" ? "جاري التحميل..." : "Loading..."}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="hidden sm:block px-2.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
            >
              <option value="all">
                {direction === "rtl" ? "الكل" : "All"}
              </option>
              <option value="unit">
                {direction === "rtl" ? "الوحدات" : "Units"}
              </option>
            </select>
            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="hidden md:block px-2.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
            >
              <option value="all">
                {direction === "rtl" ? "كل الوحدات" : "All Units"}
              </option>
              {unitOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                    1
                  )
                )
              }
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
              type="button"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>
            <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">
              {monthLabel}
            </div>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    1
                  )
                )
              }
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
              type="button"
            >
              <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="ml-2 px-3 py-2 rounded-lg border border-primary-200 text-primary-700 dark:border-primary-800 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm"
            >
              {direction === "rtl" ? "اليوم" : "Today"}
            </button>
          </div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {weekdays.map((w, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {monthGrid.map((d, i) => {
            const items = busyByDate[d.iso] || [];
            const muted = !d.inCurrentMonth;
            const today = isToday(d.date);
            const isBusy = items.length > 0;
            return (
              <div
                key={i}
                className={`min-h-[120px] relative p-2 flex flex-col bg-white dark:bg-gray-800 ${
                  today ? "ring-2 ring-primary-500" : ""
                }`}
              >
                {isBusy ? (
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-blue-500 opacity-60" />
                ) : (
                  <div className="absolute inset-x-0 top-0 h-1 bg-gray-100 dark:bg-gray-700/50" />
                )}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      muted
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {d.date.getDate()}
                  </span>
                  {today && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                      {direction === "rtl" ? "اليوم" : "Today"}
                    </span>
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  {items.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className={`text-[11px] px-2 py-1 rounded border ${chipFor(
                        p.status
                      )} flex items-center gap-1`}
                    >
                      <span className="truncate">
                        {p.kind === "unit"
                          ? direction === "rtl"
                            ? "وحدة"
                            : "Unit"
                          : direction === "rtl"
                          ? "مبنى"
                          : "Building"}{" "}
                        • {p.entity} — {translateStatus(p.status)}
                      </span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="text-[11px] text-gray-500">
                      +{items.length - 3}{" "}
                      {direction === "rtl" ? "أخرى" : "more"}
                    </div>
                  )}
                  {!isBusy && (
                    <div className="text-[11px] px-2 py-1 rounded bg-gray-50 dark:bg-gray-700/40 text-gray-500">
                      {direction === "rtl" ? "متاح" : "Free"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
          {direction === "rtl"
            ? "الفترات الجارية والقادمة"
            : "Current & Upcoming Periods"}
        </div>
        <div className="space-y-2">
          {filteredPeriods
            .slice()
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {p.kind === "unit"
                      ? direction === "rtl"
                        ? "وحدة"
                        : "Unit"
                      : direction === "rtl"
                      ? "مبنى"
                      : "Building"}{" "}
                    • {p.entity}
                  </span>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full border ${chipFor(
                    p.status
                  )}`}
                >
                  {translateStatus(p.status)}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarIcon className="h-4 w-4" />
                  <span className={`${direction === "rtl" ? "mr-1" : "ml-1"}`}>
                    {new Date(p.start).toLocaleDateString()}
                  </span>
                  <span className={`${direction === "rtl" ? "mx-1" : "mx-1"}`}>
                    →
                  </span>
                  <span>{new Date(p.end).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default Calendar;
