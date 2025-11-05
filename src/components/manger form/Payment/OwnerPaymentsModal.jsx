import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../store/hooks";
import { fetchOwnerPayments } from "../../../store/slices/paymentsSlice";
import {
  User,
  DollarSign,
  Calendar,
  Building,
  X,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";

const OwnerPaymentsModal = ({
  owner,
  ownerData,
  onClose,
  onPay,
  isLoading = false,
}) => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (owner?.id && !ownerData) {
      dispatch(fetchOwnerPayments(owner.id));
    }
  }, [owner?.id, ownerData, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return direction === "rtl" ? "غير متاح" : "Not available";
    try {
      return new Date(dateString).toLocaleDateString(
        direction === "rtl" ? "ar-EG" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          calendar: "gregory",
        }
      );
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount || 0));
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {direction === "rtl" ? "جاري التحميل..." : "Loading..."}
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  const data = ownerData || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.owner_name ||
                      owner?.full_name ||
                      owner?.name ||
                      "Owner"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {direction === "rtl"
                      ? "تفاصيل المدفوعات والإحصائيات"
                      : "Payment Details & Statistics"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "إجمالي المستحق" : "Total Due"}
                    </p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(data.owner_total)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </Card>

              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "مستحق هذا الشهر" : "This Month"}
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(data.owner_total_this_month)}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </Card>

              <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "المدفوع" : "Paid"}
                    </p>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {formatCurrency(data.paid_to_owner_total)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </Card>

              <Card className="p-4 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {direction === "rtl" ? "المتبقي" : "Remaining"}
                    </p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(data.still_need_to_pay)}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </Card>
            </div>

            {/* Units Information */}
            {data.units && data.units.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Building
                    className={`h-5 w-5 text-blue-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "الوحدات" : "Units"}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {direction === "rtl" ? "الوحدة" : "Unit"}
                        </th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {direction === "rtl" ? "نسبة المالك" : "Owner %"}
                        </th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {direction === "rtl" ? "المستحق" : "Due"}
                        </th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {direction === "rtl" ? "هذا الشهر" : "This Month"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.units.map((unit) => (
                        <tr
                          key={unit.unit_id}
                          className="border-b border-gray-100 dark:border-gray-700"
                        >
                          <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">
                            {unit.unit_name}
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-400">
                            {(parseFloat(unit.owner_percentage) * 100).toFixed(
                              1
                            )}
                            %
                          </td>
                          <td className="py-2 px-3 text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(unit.owner_total)}
                          </td>
                          <td className="py-2 px-3 text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(unit.owner_total_this_month)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Payment History */}
            {data.payments_history && data.payments_history.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar
                    className={`h-5 w-5 text-purple-600 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "تاريخ المدفوعات" : "Payment History"}
                </h3>
                <div className="space-y-3">
                  {data.payments_history.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(payment.date)}
                          </p>
                        </div>
                      </div>
                      {payment.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {payment.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {(!data.payments_history || data.payments_history.length === 0) && (
              <Card className="p-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {direction === "rtl"
                      ? "لا توجد مدفوعات سابقة"
                      : "No payment history"}
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div
              className={`flex items-center gap-4 ${
                direction === "rtl" ? "justify-start" : "justify-end"
              }`}
            >
              <Button variant="outline" onClick={onClose} className="px-6 py-2">
                <X
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {direction === "rtl" ? "إغلاق" : "Close"}
              </Button>
              {parseFloat(data.still_need_to_pay || 0) > 0 && (
                <Button onClick={onPay} className="px-6 py-2">
                  <Plus
                    className={`h-4 w-4 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  />
                  {direction === "rtl" ? "دفع للمالك" : "Pay Owner"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default OwnerPaymentsModal;
