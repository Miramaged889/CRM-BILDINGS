import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../stores/languageStore";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchUnits, fetchUnitPayments } from "../../store/slices/unitsSlice";
import {
  fetchCompanyRevenue,
  createOccasionalPayment,
  updateOccasionalPayment,
  deleteOccasionalPayment,
  clearError,
} from "../../store/slices/paymentsSlice";
import {
  Plus,
  Search,
  Filter,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Download,
  Printer,
  Trash2,
  Building,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/ui/Icon";
import {
  PaymentForm,
  PaymentViewModal,
  OwnerPaymentForm,
  OwnerPaymentsModal,
} from "../../components/manger form";
import { fetchOwners } from "../../store/slices/ownersSlice";
import { fetchTenants } from "../../store/slices/tenantsSlice";
import { payOwner, fetchOwnerPayments } from "../../store/slices/paymentsSlice";
import { getRents, getOccasionalPayments } from "../../services/api";
import toast from "react-hot-toast";

const Payments = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const dispatch = useAppDispatch();

  // Redux state
  const { units, isLoading: unitsLoading } = useAppSelector(
    (state) => state.units
  );
  const {
    unitPayments,
    companyRevenue,
    ownerPayments,
    isLoading: paymentsLoading,
    error,
  } = useAppSelector((state) => state.payments);

  // Owners and Tenants state
  const { owners } = useAppSelector((state) => state.owners);
  const { tenants } = useAppSelector((state) => state.tenants);

  const [activeTab, setActiveTab] = useState("unit-payments"); // "unit-payments" or "owner-payments"
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Owner payments state
  const [showOwnerPaymentsModal, setShowOwnerPaymentsModal] = useState(false);
  const [showOwnerPaymentForm, setShowOwnerPaymentForm] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [ownerSearchTerm, setOwnerSearchTerm] = useState("");
  const [rents, setRents] = useState([]);
  const [loadingRents, setLoadingRents] = useState(false);
  const [occasionalPayments, setOccasionalPayments] = useState([]);
  const [loadingOccasional, setLoadingOccasional] = useState(false);
  const [occasionalError, setOccasionalError] = useState(null);
  const [occasionalPage, setOccasionalPage] = useState(1);
  const occasionalItemsPerPage = 10;

  // Fetch units, owners, tenants and payments on mount
  useEffect(() => {
    dispatch(fetchUnits());
    dispatch(fetchCompanyRevenue());
    dispatch(fetchOwners());
    dispatch(fetchTenants({}));
  }, [dispatch]);

  // Fetch all rents
  useEffect(() => {
    const fetchAllRents = async () => {
      setLoadingRents(true);
      try {
        const response = await getRents({});
        const rentsData = response?.results || response?.data || response || [];
        setRents(Array.isArray(rentsData) ? rentsData : []);
      } catch (error) {
        console.error("Error fetching rents:", error);
        setRents([]);
      } finally {
        setLoadingRents(false);
      }
    };

    fetchAllRents();
  }, []);

  const loadOccasionalPayments = React.useCallback(async () => {
    try {
      setLoadingOccasional(true);
      setOccasionalError(null);
      const response = await getOccasionalPayments();
      const rawList = Array.isArray(response?.results)
        ? response.results
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      const formatted = rawList.map((payment, index) => {
        const unitId =
          payment.unit_id ??
          (typeof payment.unit === "object" ? payment.unit?.id : payment.unit);
        const unitName =
          payment.unit_name ??
          (typeof payment.unit === "object"
            ? payment.unit?.name
            : payment.unit_name || (unitId ? `Unit ${unitId}` : "-"));
        return {
          ...payment,
          id: payment.id || `occ_${index}`,
          unit_id: unitId,
          unit_name: unitName,
          payment_type: "occasional",
        };
      });
      setOccasionalPayments(formatted);
    } catch (error) {
      const message =
        error?.message ||
        (direction === "rtl"
          ? "فشل تحميل الدفعات العرضية"
          : "Failed to load occasional payments");
      setOccasionalError(message);
      toast.error(message);
    } finally {
      setLoadingOccasional(false);
    }
  }, [direction]);

  useEffect(() => {
    loadOccasionalPayments();
  }, [loadOccasionalPayments]);

  useEffect(() => {
    if (
      activeTab === "occasional-payments" &&
      !loadingOccasional &&
      occasionalPayments.length === 0 &&
      !occasionalError
    ) {
      loadOccasionalPayments();
    }
  }, [
    activeTab,
    loadingOccasional,
    occasionalPayments.length,
    occasionalError,
    loadOccasionalPayments,
  ]);

  // Fetch payments for all units
  useEffect(() => {
    if (units && units.length > 0) {
      units.forEach((unit) => {
        if (unit.id && !unitPayments[unit.id]) {
          dispatch(fetchUnitPayments(unit.id));
        }
      });
    }
  }, [units, dispatch, unitPayments]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Combine all payments from all units and rents
  const allPayments = React.useMemo(() => {
    const payments = [];

    // Add occasional payments
    Object.keys(unitPayments).forEach((unitId) => {
      const unitPaymentList = Array.isArray(unitPayments[unitId])
        ? unitPayments[unitId]
        : [];
      unitPaymentList.forEach((payment) => {
        const unit = units.find((u) => u.id === parseInt(unitId));
        payments.push({
          ...payment,
          unit_id: parseInt(unitId),
          unit_name: unit?.name || `Unit ${unitId}`,
          unit: unit?.name || `Unit ${unitId}`,
          payment_type: "occasional",
        });
      });
    });

    // Add rents
    rents.forEach((rent) => {
      const unitId = typeof rent.unit === "object" ? rent.unit?.id : rent.unit;
      const unit = units.find((u) => u.id === parseInt(unitId));
      payments.push({
        id: rent.id,
        unit_id: parseInt(unitId),
        unit_name: unit?.name || `Unit ${unitId}`,
        unit: unit?.name || `Unit ${unitId}`,
        category: "rent",
        amount: parseFloat(rent.total_amount || 0),
        payment_method: rent.payment_method || "-",
        payment_date: rent.payment_date || rent.rent_start,
        payment_type: "rent",
        rent_start: rent.rent_start,
        rent_end: rent.rent_end,
        payment_status: rent.payment_status,
        tenant: rent.tenant,
        notes: rent.notes,
      });
    });

    return payments;
  }, [unitPayments, units, rents]);

  const translateCategory = (category) => {
    const categoryMap = {
      wifi: direction === "rtl" ? "واي فاي" : "WiFi",
      electricity: direction === "rtl" ? "كهرباء" : "Electricity",
      water: direction === "rtl" ? "مياه" : "Water",
      cleaning: direction === "rtl" ? "تنظيف" : "Cleaning",
      maintenance: direction === "rtl" ? "صيانة" : "Maintenance",
      repair: direction === "rtl" ? "إصلاح" : "Repair",
      other: direction === "rtl" ? "أخرى" : "Other",
      rent: direction === "rtl" ? "إيجار" : "Rent",
    };
    return categoryMap[category] || category;
  };

  const translatePaymentType = (type) => {
    const typeMap = {
      rent: direction === "rtl" ? "إيجار" : "Rent",
      occasional: direction === "rtl" ? "دفعة عرضية" : "Occasional",
    };
    return typeMap[type] || type;
  };

  const translateMethod = (method) => {
    const methodMap = {
      bank_transfer: direction === "rtl" ? "تحويل بنكي" : "Bank Transfer",
      cash: direction === "rtl" ? "نقداً" : "Cash",
      credit_card: direction === "rtl" ? "بطاقة ائتمان" : "Credit Card",
      online_payment: direction === "rtl" ? "دفع إلكتروني" : "Online Payment",
    };
    return methodMap[method] || method;
  };

  const filteredPayments = allPayments.filter((payment) => {
    const matchesSearch =
      (payment.unit_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (payment.category || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (payment.notes || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || payment.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOccasionalPayments = occasionalPayments.filter((payment) => {
    const matchesSearch =
      (payment.unit_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (payment.category || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (payment.notes || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || payment.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pagedPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const occasionalTotalPages = Math.max(
    1,
    Math.ceil(filteredOccasionalPayments.length / occasionalItemsPerPage)
  );
  const occasionalStartIndex = (occasionalPage - 1) * occasionalItemsPerPage;
  const pagedOccasionalPayments = filteredOccasionalPayments.slice(
    occasionalStartIndex,
    occasionalStartIndex + occasionalItemsPerPage
  );

  const totalOccasionalAmount = filteredOccasionalPayments.reduce(
    (sum, payment) => sum + parseFloat(payment.amount || 0),
    0
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setOccasionalPage(1);
  }, [searchTerm, categoryFilter, activeTab]);

  useEffect(() => {
    if (occasionalPage > occasionalTotalPages) {
      setOccasionalPage(occasionalTotalPages);
    }
  }, [occasionalTotalPages, occasionalPage]);

  // Handler functions
  const handleAddNew = () => {
    setEditingPayment(null);
    setSelectedUnitId(null);
    setShowForm(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setSelectedUnitId(payment.unit_id);
    setShowForm(true);
  };

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const handleSavePayment = async (paymentData) => {
    try {
      if (editingPayment) {
        // Update existing payment
        await dispatch(
          updateOccasionalPayment({
            unitId: editingPayment.unit_id,
            paymentId: editingPayment.id,
            paymentData,
          })
        ).unwrap();
        toast.success(
          direction === "rtl"
            ? "تم تحديث الدفعة بنجاح"
            : "Payment updated successfully"
        );
        // Refresh payments for this unit
        dispatch(fetchUnitPayments(editingPayment.unit_id));
      } else {
        // Create new payment
        const unitId = selectedUnitId || paymentData.unit_id;
        if (!unitId) {
          toast.error(
            direction === "rtl" ? "الرجاء تحديد الوحدة" : "Please select a unit"
          );
          return;
        }
        await dispatch(
          createOccasionalPayment({
            unitId,
            paymentData,
          })
        ).unwrap();
        toast.success(
          direction === "rtl"
            ? "تم إضافة الدفعة بنجاح"
            : "Payment added successfully"
        );
        // Refresh payments for this unit
        dispatch(fetchUnitPayments(unitId));
        // Refresh company revenue
        dispatch(fetchCompanyRevenue());
        loadOccasionalPayments();
      }
      setShowForm(false);
      setEditingPayment(null);
      setSelectedUnitId(null);
    } catch (err) {
      toast.error(
        err ||
          (direction === "rtl" ? "فشل حفظ الدفعة" : "Failed to save payment")
      );
    }
  };

  const handleDeletePayment = async (payment) => {
    if (
      !window.confirm(
        direction === "rtl"
          ? "هل أنت متأكد من حذف هذه الدفعة؟"
          : "Are you sure you want to delete this payment?"
      )
    ) {
      return;
    }

    try {
      await dispatch(
        deleteOccasionalPayment({
          unitId: payment.unit_id,
          paymentId: payment.id,
        })
      ).unwrap();
      toast.success(
        direction === "rtl"
          ? "تم حذف الدفعة بنجاح"
          : "Payment deleted successfully"
      );
      // Refresh payments for this unit
      dispatch(fetchUnitPayments(payment.unit_id));
      // Refresh company revenue
      dispatch(fetchCompanyRevenue());
      loadOccasionalPayments();
    } catch (err) {
      toast.error(
        err ||
          (direction === "rtl" ? "فشل حذف الدفعة" : "Failed to delete payment")
      );
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
    setSelectedUnitId(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedPayment(null);
  };

  // Owner payment handlers
  const handleViewOwnerPayments = (owner) => {
    setSelectedOwner(owner);
    setShowOwnerPaymentsModal(true);
    // Fetch owner payments if not already loaded
    if (!ownerPayments[owner.id]) {
      dispatch(fetchOwnerPayments(owner.id));
    }
  };

  const handlePayOwner = (owner) => {
    setSelectedOwner(owner);
    setShowOwnerPaymentForm(true);
  };

  const handleSaveOwnerPayment = async (paymentData) => {
    try {
      await dispatch(
        payOwner({
          ownerId: selectedOwner.id,
          amountPaid: paymentData.amount_paid,
          notes: paymentData.notes,
        })
      ).unwrap();
      toast.success(
        direction === "rtl" ? "تم دفع المالك بنجاح" : "Owner paid successfully"
      );
      // Refresh owner payments data
      dispatch(fetchOwnerPayments(selectedOwner.id));
      // Refresh company revenue
      dispatch(fetchCompanyRevenue());
      setShowOwnerPaymentForm(false);
      setSelectedOwner(null);
    } catch (err) {
      toast.error(
        err || (direction === "rtl" ? "فشل دفع المالك" : "Failed to pay owner")
      );
    }
  };

  const handleCloseOwnerPaymentsModal = () => {
    setShowOwnerPaymentsModal(false);
    setSelectedOwner(null);
  };

  const handleCloseOwnerPaymentForm = () => {
    setShowOwnerPaymentForm(false);
    setSelectedOwner(null);
  };

  // Filter owners
  const filteredOwners =
    owners?.filter((owner) => {
      const name = (owner.full_name || owner.name || "").toLowerCase();
      const email = (owner.email || "").toLowerCase();
      const phone = (owner.phone || "").toLowerCase();
      return (
        name.includes(ownerSearchTerm.toLowerCase()) ||
        email.includes(ownerSearchTerm.toLowerCase()) ||
        phone.includes(ownerSearchTerm.toLowerCase())
      );
    }) || [];

  // Helper function to get tenant name by ID
  const getTenantNameById = React.useCallback(
    (tenantId) => {
      if (!tenantId) return "-";
      const tenantIdValue =
        typeof tenantId === "object" ? tenantId?.id : tenantId;
      const foundTenant = tenants?.find(
        (t) => t.id === parseInt(tenantIdValue)
      );
      return (
        foundTenant?.full_name ||
        foundTenant?.name ||
        `Tenant #${tenantIdValue}`
      );
    },
    [tenants]
  );

  const handlePrint = (payment) => {
    // Determine payment type and extract correct data
    const isRent = payment.payment_type === "rent";
    const unitName =
      payment.unit_name || payment.unit || `Unit ${payment.unit_id || "-"}`;
    const tenantId = isRent ? payment.tenant : null;
    const tenantName = tenantId
      ? getTenantNameById(tenantId)
      : payment.tenant_name || "-";
    const paymentMethod = payment.payment_method || payment.method || "-";
    const paymentDate =
      payment.payment_date || payment.date || payment.rent_start || null;
    const amount = parseFloat(payment.amount || 0);
    const category = payment.category || "-";
    const notes = payment.notes || "";
    const paymentStatus = payment.payment_status || payment.status || "paid";
    const rentStart = payment.rent_start || null;
    const rentEnd = payment.rent_end || null;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${
            isRent
              ? direction === "rtl"
                ? "إيصال إيجار"
                : "Rent Receipt"
              : direction === "rtl"
              ? "إيصال دفع"
              : "Payment Receipt"
          } - ${unitName}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @media print {
              body { 
                margin: 0; 
                padding: 10px; 
                font-size: 12px;
                line-height: 1.3;
              }
              .no-print { display: none !important; }
              .receipt-container { 
                box-shadow: none; 
                margin: 0; 
                max-height: 100vh;
                overflow: hidden;
              }
              .print-btn { display: none !important; }
              .header { padding: 20px 15px; }
              .content { padding: 15px; }
              .section { 
                margin: 10px 0; 
                padding: 12px; 
                page-break-inside: avoid;
              }
              .receipt-title { font-size: 24px; }
              .receipt-subtitle { font-size: 14px; }
              .section-title { font-size: 16px; margin-bottom: 10px; }
              .amount-value { font-size: 28px; }
              .amount-display { padding: 15px; margin: 10px 0; }
              .info-grid { gap: 8px; }
              .info-item { padding: 8px; }
              .footer { padding: 15px; margin-top: 15px; }
              .financial-section { padding: 15px; margin: 15px 0; }
            }
            
            @page {
              size: A4;
              margin: 15mm;
            }
            
            body { 
              font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              direction: ${direction}; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #1a202c;
              line-height: 1.4;
              min-height: 100vh;
            }
            
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
              overflow: hidden;
              position: relative;
              max-height: calc(100vh - 40px);
            }
            
            .receipt-container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
            }
            
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 25px 20px;
              position: relative;
              overflow: hidden;
            }
            
            .header::after {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              animation: shimmer 3s ease-in-out infinite;
            }
            
            @keyframes shimmer {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(180deg); }
            }
            
            .receipt-title {
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 8px 0;
              text-shadow: 0 4px 8px rgba(0,0,0,0.3);
              letter-spacing: -0.5px;
              position: relative;
              z-index: 1;
            }
            
            .receipt-subtitle {
              font-size: 16px;
              opacity: 0.95;
              margin: 0;
              font-weight: 400;
              position: relative;
              z-index: 1;
            }
            
            .content {
              padding: 20px;
              background: #fafbfc;
            }
            
            .section {
              margin: 15px 0;
              padding: 15px;
              border-radius: 12px;
              background: white;
              border: 1px solid #e2e8f0;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .section:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #2d3748;
              margin: 0 0 12px 0;
              display: flex;
              align-items: center;
              gap: 8px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e2e8f0;
            }
            
            .section-icon {
              width: 30px;
              height: 30px;
              background: linear-gradient(135deg, #667eea, #764ba2);
              border-radius: 8px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              font-weight: 600;
              box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 12px;
              margin-top: 12px;
            }
            
            .info-item {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              padding: 12px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
              transition: all 0.2s ease;
            }
            
            .info-item:hover {
              border-color: #667eea;
              transform: translateY(-1px);
              box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
            }
            
            .label {
              font-weight: 600;
              color: #4a5568;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
              display: flex;
              align-items: center;
              gap: 4px;
            }
            
            .label::before {
              content: '';
              width: 2px;
              height: 2px;
              background: #667eea;
              border-radius: 50%;
            }
            
            .value {
              color: #1a202c;
              font-size: 14px;
              font-weight: 500;
              line-height: 1.3;
            }
            
            .financial-section {
              background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 50%, #fefcbf 100%);
              border: 2px solid #38b2ac;
              border-radius: 16px;
              padding: 20px;
              margin: 20px 0;
              position: relative;
              overflow: hidden;
            }
            
            .financial-section::before {
              content: '💰';
              position: absolute;
              top: -15px;
              ${direction === "rtl" ? "right" : "left"}: 20px;
              background: linear-gradient(135deg, #38b2ac, #319795);
              color: white;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              box-shadow: 0 2px 8px rgba(56, 178, 172, 0.4);
            }
            
            .amount-display {
              text-align: center;
              margin: 15px 0;
              padding: 20px;
              background: white;
              border-radius: 12px;
              border: 2px dashed #38b2ac;
              position: relative;
              overflow: hidden;
            }
            
            .amount-display::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(56, 178, 172, 0.1), transparent);
              animation: shine 2s infinite;
            }
            
            @keyframes shine {
              0% { left: -100%; }
              100% { left: 100%; }
            }
            
            .amount-label {
              color: #4a5568;
              font-size: 12px;
              margin-bottom: 6px;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .amount-value {
              font-size: 32px;
              font-weight: 700;
              color: #38b2ac;
              margin: 0;
              text-shadow: 0 2px 4px rgba(56, 178, 172, 0.2);
              position: relative;
              z-index: 1;
            }
            
            .status-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
              transition: all 0.2s ease;
            }
            
            .status-badge:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            .status-paid {
              background: linear-gradient(135deg, #d1fae5, #a7f3d0);
              color: #064e3b;
              border: 2px solid #10b981;
            }
            
            .status-pending {
              background: linear-gradient(135deg, #fef3c7, #fde68a);
              color: #78350f;
              border: 2px solid #f59e0b;
            }
            
            .status-overdue {
              background: linear-gradient(135deg, #fee2e2, #fecaca);
              color: #7f1d1d;
              border: 2px solid #ef4444;
            }
            
            .footer {
              text-align: center;
              margin-top: 20px;
              padding: 20px;
              background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
              border-radius: 12px;
              border-top: 3px solid #e2e8f0;
              position: relative;
            }
            
            .footer::before {
              content: '';
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 40px;
              height: 3px;
              background: linear-gradient(90deg, #667eea, #764ba2);
              border-radius: 0 0 3px 3px;
            }
            
            .footer-text {
              color: #4a5568;
              font-size: 13px;
              margin: 0;
              line-height: 1.4;
            }
            
            .print-date {
              font-weight: 600;
              color: #2d3748;
              background: linear-gradient(135deg, #667eea, #764ba2);
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            
            .print-btn {
              position: fixed;
              top: 20px;
              ${direction === "rtl" ? "left" : "right"}: 20px;
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 20px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              transition: all 0.2s ease;
              z-index: 1000;
            }
            
            .print-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }
            
            @media (max-width: 768px) {
              body { padding: 10px; }
              .content { padding: 15px; }
              .info-grid { grid-template-columns: 1fr; gap: 10px; }
              .amount-value { font-size: 24px; }
              .receipt-title { font-size: 22px; }
              .section { padding: 12px; margin: 10px 0; }
              .print-btn { position: relative; top: auto; right: auto; left: auto; margin: 15px auto; display: block; }
            }
          </style>
        </head>
        <body>
          <button class="print-btn no-print" onclick="window.print()">
            🖨️ ${direction === "rtl" ? "طباعة الإيصال" : "Print Receipt"}
          </button>
          
          <div class="receipt-container">
            <div class="header">
              <h1 class="receipt-title">${
                isRent
                  ? direction === "rtl"
                    ? "إيصال إيجار"
                    : "Rent Receipt"
                  : direction === "rtl"
                  ? "إيصال دفع عرضي"
                  : "Occasional Payment Receipt"
              }</h1>
              <p class="receipt-subtitle">${
                direction === "rtl"
                  ? "إيصال رسمي معتمد"
                  : "Official Payment Receipt"
              }</p>
            </div>

            <div class="content">
              <div class="section">
                <h2 class="section-title">
                  <span class="section-icon">👤</span>
                  ${
                    direction === "rtl"
                      ? "معلومات المستأجر"
                      : "Tenant Information"
                  }
                </h2>
                <div class="info-grid">
                  ${
                    isRent
                      ? `
                  <div class="info-item">
                    <div class="label">${
                      direction === "rtl" ? "اسم المستأجر" : "Tenant Name"
                    }</div>
                    <div class="value">${tenantName}</div>
                  </div>
                  `
                      : ""
                  }
                  <div class="info-item">
                    <div class="label">${
                      direction === "rtl" ? "اسم الوحدة" : "Unit Name"
                    }</div>
                    <div class="value">${unitName}</div>
                  </div>
                  ${
                    isRent && rentStart
                      ? `
                  <div class="info-item">
                    <div class="label">${
                      direction === "rtl"
                        ? "تاريخ بداية الإيجار"
                        : "Rent Start Date"
                    }</div>
                    <div class="value">${new Date(rentStart).toLocaleDateString(
                      direction === "rtl" ? "ar-EG" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        calendar: "gregory",
                      }
                    )}</div>
                  </div>
                  `
                      : ""
                  }
                  ${
                    isRent && rentEnd
                      ? `
                  <div class="info-item">
                    <div class="label">${
                      direction === "rtl"
                        ? "تاريخ نهاية الإيجار"
                        : "Rent End Date"
                    }</div>
                    <div class="value">${new Date(rentEnd).toLocaleDateString(
                      direction === "rtl" ? "ar-EG" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        calendar: "gregory",
                      }
                    )}</div>
                  </div>
                  `
                      : ""
                  }
                </div>
              </div>

              <div class="section">
                <h2 class="section-title">
                  <span class="section-icon">📄</span>
                  ${direction === "rtl" ? "تفاصيل الدفع" : "Payment Details"}
                </h2>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="label">${
                      direction === "rtl" ? "رقم الإيصال" : "Receipt Number"
                    }</div>
                    <div class="value">#${(payment.id || "")
                      .toString()
                      .padStart(6, "0")}</div>
                  </div>
                  ${
                    !isRent
                      ? `
                  <div class="info-item">
                    <div class="label">${
                      direction === "rtl" ? "الفئة" : "Category"
                    }</div>
                    <div class="value">${translateCategory(category)}</div>
                  </div>
                  `
                      : ""
                  }
                  <div class="info-item">
                    <div class="label">${
                      direction === "rtl" ? "طريقة الدفع" : "Payment Method"
                    }</div>
                    <div class="value">${translateMethod(paymentMethod)}</div>
                  </div>
                  <div class="info-item">
                    <div class="label">${
                      direction === "rtl" ? "تاريخ الدفع" : "Payment Date"
                    }</div>
                    <div class="value">${
                      paymentDate
                        ? new Date(paymentDate).toLocaleDateString(
                            direction === "rtl" ? "ar-EG" : "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              calendar: "gregory",
                            }
                          )
                        : direction === "rtl"
                        ? "غير مدفوع بعد"
                        : "Not paid yet"
                    }</div>
                  </div>
                  ${
                    isRent
                      ? `
                  <div class="info-item">
                    <div class="label">${
                      direction === "rtl" ? "حالة الدفع" : "Payment Status"
                    }</div>
                    <div class="value">
                      <span class="status-badge ${
                        paymentStatus === "paid"
                          ? "status-paid"
                          : paymentStatus === "pending"
                          ? "status-pending"
                          : paymentStatus === "overdue"
                          ? "status-overdue"
                          : ""
                      }">
                        ${
                          paymentStatus === "paid"
                            ? direction === "rtl"
                              ? "مدفوع"
                              : "Paid"
                            : paymentStatus === "pending"
                            ? direction === "rtl"
                              ? "قيد الانتظار"
                              : "Pending"
                            : paymentStatus === "overdue"
                            ? direction === "rtl"
                              ? "متأخر"
                              : "Overdue"
                            : paymentStatus
                        }
                      </span>
                    </div>
                  </div>
                  `
                      : ""
                  }
                  ${
                    notes
                      ? `
                  <div class="info-item">
                    <div class="label">${
                      direction === "rtl" ? "ملاحظات" : "Notes"
                    }</div>
                    <div class="value">${notes}</div>
                  </div>
                  `
                      : ""
                  }
                </div>
              </div>

              <div class="financial-section">
                <h2 class="section-title">
                  <span class="section-icon">💰</span>
                  ${
                    direction === "rtl"
                      ? "المعلومات المالية"
                      : "Financial Information"
                  }
                </h2>
                
                <div class="amount-display">
                  <div class="amount-label">${
                    isRent
                      ? direction === "rtl"
                        ? "إجمالي مبلغ الإيجار"
                        : "Total Rent Amount"
                      : direction === "rtl"
                      ? "إجمالي المبلغ المدفوع"
                      : "Total Amount Paid"
                  }</div>
                  <div class="amount-value">$${amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</div>
                </div>
              </div>

              <div class="footer">
                <p class="footer-text">
                  ${
                    direction === "rtl"
                      ? "تم إنشاء هذا الإيصال في"
                      : "Receipt generated on"
                  } 
                  <span class="print-date">${new Date().toLocaleDateString(
                    direction === "rtl" ? "ar-EG" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      calendar: "gregory",
                    }
                  )}</span>
                </p>
                <p class="footer-text" style="margin-top: 8px; font-style: italic; opacity: 0.8;">
                  ${
                    direction === "rtl"
                      ? "هذا الإيصال صالح قانونياً ومعتمد من إدارة العقارات"
                      : "This receipt is legally valid and certified by Property Management"
                  }
                </p>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              // Auto-focus for better printing experience
              document.body.focus();
            }
            
            // Enhanced print functionality
            function printReceipt() {
              window.print();
            }
            
            // Add keyboard shortcut for printing
            document.addEventListener('keydown', function(e) {
              if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                printReceipt();
              }
            });
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {t("payments.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg">
            {t("payments.managePayments")}
          </p>
        </div>

        {activeTab === "occasional-payments" && (
          <div className="mt-6 sm:mt-0 flex flex-row justify-end gap-3">
            <Button
              size="lg"
              className="shadow-sm hover:shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3"
              onClick={handleAddNew}
            >
              <Plus
                className={`h-5 w-5 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
              />
              {t("payments.recordPayment")}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("unit-payments")}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === "unit-payments"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Building className="h-5 w-5" />
              <span>
                {direction === "rtl" ? "دفعات الوحدات" : "Unit Payments"}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("occasional-payments")}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === "occasional-payments"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span>
                {direction === "rtl"
                  ? "الدفعات العرضية"
                  : "Occasional Payments"}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("owner-payments")}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === "owner-payments"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="h-5 w-5" />
              <span>
                {direction === "rtl" ? "دفعات الملاك" : "Owner Payments"}
              </span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {direction === "rtl" ? "إجمالي الإيرادات" : "Total Revenue"}
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${companyRevenue?.total?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {direction === "rtl"
                    ? "إيرادات هذا الشهر"
                    : "This Month Revenue"}
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  ${companyRevenue?.total_this_month?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {direction === "rtl" ? "إيرادات الشركة" : "Company Revenue"}
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${companyRevenue?.company_total?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {direction === "rtl"
                    ? "إجمالي الدفعات العرضية"
                    : "Occasional Payments"}
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ${companyRevenue?.total_occasional?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Unit Payments Content */}
      {activeTab === "unit-payments" && (
        <>
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder={t("payments.searchPayments")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all">
                  {direction === "rtl" ? "جميع الفئات" : "All Categories"}
                </option>
                <option value="wifi">
                  {direction === "rtl" ? "واي فاي" : "WiFi"}
                </option>
                <option value="electricity">
                  {direction === "rtl" ? "كهرباء" : "Electricity"}
                </option>
                <option value="water">
                  {direction === "rtl" ? "مياه" : "Water"}
                </option>
                <option value="cleaning">
                  {direction === "rtl" ? "تنظيف" : "Cleaning"}
                </option>
                <option value="maintenance">
                  {direction === "rtl" ? "صيانة" : "Maintenance"}
                </option>
                <option value="repair">
                  {direction === "rtl" ? "إصلاح" : "Repair"}
                </option>
                <option value="other">
                  {direction === "rtl" ? "أخرى" : "Other"}
                </option>
              </select>
            </div>
          </motion.div>

          {/* Payments Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t("payments.recentPayments")}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`mt-4 sm:mt-0 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    }`}
                  >
                    <Download
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("common.export")}
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {direction === "rtl" ? "الوحدة" : "Unit"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {direction === "rtl" ? "النوع" : "Type"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {direction === "rtl" ? "الفئة" : "Category"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {t("payments.amount")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {t("payments.method")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {t("payments.date")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {t("common.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedPayments.map((payment, index) => (
                        <motion.tr
                          key={payment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {payment.unit_name ||
                                    payment.unit ||
                                    `Unit ${payment.unit_id}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.payment_type === "rent"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                              }`}
                            >
                              {translatePaymentType(
                                payment.payment_type || "occasional"
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                              {translateCategory(payment.category)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                              <span className="font-medium text-gray-900 dark:text-white">
                                $
                                {parseFloat(
                                  payment.amount || 0
                                ).toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-600 dark:text-gray-400">
                              {translateMethod(
                                payment.payment_method || payment.method
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <div className="text-gray-900 dark:text-white">
                                {payment.payment_date || payment.date
                                  ? new Date(
                                      payment.payment_date || payment.date
                                    ).toLocaleDateString(
                                      direction === "rtl" ? "ar-EG" : "en-US",
                                      {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        calendar: "gregory",
                                      }
                                    )
                                  : direction === "rtl"
                                  ? "غير متاح"
                                  : "Not available"}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                title={
                                  direction === "rtl"
                                    ? "عرض الدفع"
                                    : "View Payment"
                                }
                                onClick={() => handleView(payment)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {payment.payment_type !== "rent" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  title={
                                    direction === "rtl"
                                      ? "تعديل الدفع"
                                      : "Edit Payment"
                                  }
                                  onClick={() => handleEdit(payment)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                title={
                                  direction === "rtl"
                                    ? "طباعة الإيصال"
                                    : "Print Receipt"
                                }
                                onClick={() => handlePrint(payment)}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                              {payment.payment_type !== "rent" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  title={
                                    direction === "rtl"
                                      ? "حذف الدفع"
                                      : "Delete Payment"
                                  }
                                  onClick={() => handleDeletePayment(payment)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredPayments.length > itemsPerPage && (
                  <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {direction === "rtl"
                        ? `عرض ${(startIndex + 1).toLocaleString()}-${Math.min(
                            startIndex + itemsPerPage,
                            filteredPayments.length
                          ).toLocaleString()} من ${filteredPayments.length.toLocaleString()}`
                        : `Showing ${(
                            startIndex + 1
                          ).toLocaleString()}-${Math.min(
                            startIndex + itemsPerPage,
                            filteredPayments.length
                          ).toLocaleString()} of ${filteredPayments.length.toLocaleString()}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                      >
                        {direction === "rtl" ? "السابق" : "Previous"}
                      </Button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {direction === "rtl"
                          ? `صفحة ${currentPage} من ${totalPages}`
                          : `Page ${currentPage} of ${totalPages}`}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                      >
                        {direction === "rtl" ? "التالي" : "Next"}
                      </Button>
                    </div>
                  </div>
                )}

                {filteredPayments.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      No payments found
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500">
                      Try adjusting your search criteria
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </>
      )}

      {/* Occasional Payments Content */}
      {activeTab === "occasional-payments" && (
        <>
          {loadingOccasional ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center py-12"
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {direction === "rtl" ? "جاري التحميل..." : "Loading..."}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {direction === "rtl"
                          ? "الدفعات العرضية"
                          : "Occasional Payments"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {direction === "rtl"
                          ? `إجمالي: $${totalOccasionalAmount.toLocaleString(
                              "en-US"
                            )}`
                          : `Total: $${totalOccasionalAmount.toLocaleString(
                              "en-US"
                            )}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadOccasionalPayments}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        {direction === "rtl" ? "تحديث" : "Refresh"}
                      </Button>
                    </div>
                  </div>

                  {occasionalError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-300">
                      {occasionalError}
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {direction === "rtl" ? "الوحدة" : "Unit"}
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {direction === "rtl" ? "الفئة" : "Category"}
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {t("payments.amount")}
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {t("payments.method")}
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {t("payments.date")}
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {t("common.actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedOccasionalPayments.map((payment, index) => (
                          <motion.tr
                            key={payment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                  <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {payment.unit_name ||
                                      `Unit ${payment.unit_id || "-"}`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                {translateCategory(payment.category)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  $
                                  {parseFloat(
                                    payment.amount || 0
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                              {translateMethod(
                                payment.payment_method || payment.method
                              )}
                            </td>
                            <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                              {payment.payment_date || payment.date
                                ? new Date(
                                    payment.payment_date || payment.date
                                  ).toLocaleDateString(
                                    direction === "rtl" ? "ar-EG" : "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      calendar: "gregory",
                                    }
                                  )
                                : direction === "rtl"
                                ? "غير متاح"
                                : "Not available"}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2 rtl:space-x-reverse">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  title={direction === "rtl" ? "عرض" : "View"}
                                  onClick={() => handleView(payment)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  title={direction === "rtl" ? "تعديل" : "Edit"}
                                  onClick={() => handleEdit(payment)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  title={
                                    direction === "rtl" ? "طباعة" : "Print"
                                  }
                                  onClick={() => handlePrint(payment)}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  title={direction === "rtl" ? "حذف" : "Delete"}
                                  onClick={() => handleDeletePayment(payment)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredOccasionalPayments.length >
                    occasionalItemsPerPage && (
                    <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {direction === "rtl"
                          ? `عرض ${(
                              occasionalStartIndex + 1
                            ).toLocaleString()}-${Math.min(
                              occasionalStartIndex + occasionalItemsPerPage,
                              filteredOccasionalPayments.length
                            ).toLocaleString()} من ${filteredOccasionalPayments.length.toLocaleString()}`
                          : `Showing ${(
                              occasionalStartIndex + 1
                            ).toLocaleString()}-${Math.min(
                              occasionalStartIndex + occasionalItemsPerPage,
                              filteredOccasionalPayments.length
                            ).toLocaleString()} of ${filteredOccasionalPayments.length.toLocaleString()}`}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setOccasionalPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={occasionalPage === 1}
                          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                        >
                          {direction === "rtl" ? "السابق" : "Previous"}
                        </Button>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {direction === "rtl"
                            ? `صفحة ${occasionalPage} من ${occasionalTotalPages}`
                            : `Page ${occasionalPage} of ${occasionalTotalPages}`}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setOccasionalPage((prev) =>
                              Math.min(occasionalTotalPages, prev + 1)
                            )
                          }
                          disabled={occasionalPage === occasionalTotalPages}
                          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                        >
                          {direction === "rtl" ? "التالي" : "Next"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {filteredOccasionalPayments.length === 0 &&
                    !loadingOccasional && (
                      <div className="text-center py-12">
                        <div className="mb-4">
                          <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                          {direction === "rtl"
                            ? "لا توجد دفعات عرضية"
                            : "No occasional payments found"}
                        </h3>
                        <p className="text-gray-400 dark:text-gray-500">
                          {direction === "rtl"
                            ? "جرب تغيير معايير البحث"
                            : "Try adjusting your search criteria"}
                        </p>
                      </div>
                    )}
                </div>
              </Card>
            </motion.div>
          )}
        </>
      )}

      {/* Owner Payments Content */}
      {activeTab === "owner-payments" && (
        <>
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder={
                    direction === "rtl"
                      ? "ابحث عن الملاك..."
                      : "Search owners..."
                  }
                  value={ownerSearchTerm}
                  onChange={(e) => setOwnerSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          </motion.div>

          {/* Owners Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOwners.map((owner, index) => {
                const ownerPaymentData = ownerPayments[owner.id];
                const stillNeedToPay = parseFloat(
                  ownerPaymentData?.still_need_to_pay || 0
                );
                return (
                  <motion.div
                    key={owner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {owner.full_name || owner.name || "N/A"}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {owner.email || ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {direction === "rtl" ? "المستحق" : "Total Due"}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(
                              parseFloat(ownerPaymentData?.owner_total || 0)
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {direction === "rtl" ? "المتبقي" : "Remaining"}
                          </span>
                          <span
                            className={`font-semibold ${
                              stillNeedToPay > 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(stillNeedToPay)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleViewOwnerPayments(owner)}
                        >
                          <Eye
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-2" : "mr-2"
                            }`}
                          />
                          {direction === "rtl" ? "عرض" : "View"}
                        </Button>
                        {stillNeedToPay > 0 && (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handlePayOwner(owner)}
                          >
                            <Plus
                              className={`h-4 w-4 ${
                                direction === "rtl" ? "ml-2" : "mr-2"
                              }`}
                            />
                            {direction === "rtl" ? "دفع" : "Pay"}
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {filteredOwners.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <User className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  {direction === "rtl" ? "لا يوجد ملاك" : "No owners found"}
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  {direction === "rtl"
                    ? "جرب تغيير معايير البحث"
                    : "Try adjusting your search criteria"}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Modals */}
      {showForm && (
        <PaymentForm
          payment={editingPayment}
          unitId={selectedUnitId}
          onSave={handleSavePayment}
          onClose={handleCloseForm}
          isEdit={!!editingPayment}
        />
      )}

      {showViewModal && selectedPayment && (
        <PaymentViewModal
          payment={selectedPayment}
          onClose={handleCloseViewModal}
          onEdit={handleEdit}
          onPrint={handlePrint}
        />
      )}

      {/* Owner Payments Modals */}
      {showOwnerPaymentsModal && selectedOwner && (
        <OwnerPaymentsModal
          owner={selectedOwner}
          ownerData={ownerPayments[selectedOwner.id]}
          onClose={handleCloseOwnerPaymentsModal}
          onPay={() => handlePayOwner(selectedOwner)}
          isLoading={paymentsLoading}
        />
      )}

      {showOwnerPaymentForm && selectedOwner && (
        <OwnerPaymentForm
          owner={selectedOwner}
          onSave={handleSaveOwnerPayment}
          onClose={handleCloseOwnerPaymentForm}
        />
      )}
    </div>
  );
};

export default Payments;
