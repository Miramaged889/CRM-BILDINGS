import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../stores/languageStore";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchTenantById,
  fetchTenants,
} from "../../../store/slices/tenantsSlice";
import {
  fetchReviews,
  updateReview,
  deleteReview,
  clearError,
} from "../../../store/slices/reviewsSlice";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  FileText,
  BarChart3,
  Users,
  Award,
  Home,
  CreditCard,
  Shield,
  Car,
  Heart,
  Plus,
  Star,
  Eye,
  Trash2,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Avatar from "../../../components/ui/Avatar";
import { LeaseForm, LeaseViewModal } from "../../../components/manger form";
import { ReviewForm, ReviewViewModal } from "../../../components/manger form";
import { getRents, deleteRent } from "../../../services/api";

const TenantDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const dispatch = useAppDispatch();
  const { error: reviewsError, reviews: reviewsFromStore } = useAppSelector(
    (state) => state.reviews
  );
  const [activeTab, setActiveTab] = useState("overview");
  const { currentTenant, isLoading, error, tenants } = useAppSelector(
    (state) => state.tenants
  );

  // Form and modal states
  const [showLeaseForm, setShowLeaseForm] = useState(false);
  const [showLeaseViewModal, setShowLeaseViewModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviewViewModal, setShowReviewViewModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editingLease, setEditingLease] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  // State for rents from API
  const [rents, setRents] = useState([]);
  const [loadingRents, setLoadingRents] = useState(false);

  // Fetch tenant by ID from API/Redux
  useEffect(() => {
    if (id) {
      dispatch(fetchTenantById(id));
      // Also fetch reviews for this tenant if reviews endpoint supports filtering
      dispatch(fetchReviews({ tenant: id }));
    }
  }, [id, dispatch]);

  // Fetch rents for this tenant from API
  useEffect(() => {
    const fetchTenantRents = async () => {
      if (!id) return;

      setLoadingRents(true);
      try {
        const response = await getRents({ tenant: id });
        // Handle paginated response with results array
        const rentsData = response?.results || response?.data || response || [];
        setRents(Array.isArray(rentsData) ? rentsData : []);
      } catch (error) {
        console.error("Error fetching rents:", error);
        setRents([]);
        toast.error(
          direction === "rtl" ? "فشل تحميل الإيجارات" : "Failed to load rents"
        );
      } finally {
        setLoadingRents(false);
      }
    };

    fetchTenantRents();
  }, [id, direction]);

  // Fetch all tenants to map tenant IDs to names in reviews
  useEffect(() => {
    if (!tenants || tenants.length === 0) {
      dispatch(fetchTenants({}));
    }
  }, [dispatch, tenants]);

  // Helper function to get tenant name by ID
  const getTenantNameById = React.useCallback(
    (tenantId) => {
      if (!tenantId) return "-";
      const foundTenant = tenants?.find((t) => t.id === tenantId);
      return (
        foundTenant?.full_name || foundTenant?.name || `Tenant #${tenantId}`
      );
    },
    [tenants]
  );

  // Map API tenant shape to UI-friendly fields with fallbacks
  const tenant = React.useMemo(() => {
    const t = currentTenant || {};
    const rentInfo = t.rent_info || {};

    // Get reviews from Redux store (primary source - fresh from API)
    // Ensure reviewsFromStore is an array (it comes from paginated API response with results)
    const storeReviews = Array.isArray(reviewsFromStore)
      ? reviewsFromStore.filter((r) => r && r.id) // Filter out invalid reviews
      : [];

    // Get reviews from tenant data (fallback)
    const tenantReviews = Array.isArray(t.reviews)
      ? t.reviews.filter((r) => r && r.id) // Filter out invalid reviews
      : [];

    // Use store reviews as primary source, add tenant reviews only if they don't exist in store
    // This prevents duplicates after delete
    const reviewsMap = new Map();

    // Add store reviews first (they are the source of truth)
    storeReviews.forEach((review) => {
      if (review && review.id) {
        reviewsMap.set(review.id, review);
      }
    });

    // Add tenant reviews only if they don't exist in store
    tenantReviews.forEach((review) => {
      if (review && review.id && !reviewsMap.has(review.id)) {
        reviewsMap.set(review.id, review);
      }
    });

    // Convert map to array
    const allReviews = Array.from(reviewsMap.values());

    // Map reviews with tenant names based on schema: { id, tenant, comment, rate, date }
    const mappedReviews = allReviews
      .filter((review) => review && review.id) // Final safety check
      .map((review) => {
        const tenantId =
          typeof review.tenant === "object" ? review.tenant.id : review.tenant;
        return {
          id: review.id,
          tenant: tenantId,
          tenantName: getTenantNameById(tenantId),
          comment: review.comment || "",
          rate: review.rate || review.rating || "0.0",
          date: review.date || review.created_at || new Date().toISOString(),
        };
      });

    return {
      id: t.id,
      name: t.full_name || t.name || "-",
      email: t.email || "-",
      phone: t.phone || "-",
      avatar: t.avatar || undefined,
      status: (t.status || "active").toLowerCase(),
      unit: rentInfo.unit_name || rentInfo.unit || t.unit_name || "-",
      leaseStart: rentInfo.rent_start || t.lease_start || null,
      leaseEnd: rentInfo.rent_end || t.lease_end || null,
      rentalType: (rentInfo.rental_type || "daily").toLowerCase(),
      rent: parseFloat(rentInfo.total_amount) || t.rent || 0,
      paymentHistory: t.payment_history || [],
      maintenanceRequests: t.maintenance_requests || [],
      recentActivity: t.recent_activity || [],
      reviews: mappedReviews,
      leases: rents, // Use rents from API instead of t.leases
    };
  }, [currentTenant, getTenantNameById, reviewsFromStore, id, rents]);

  const statusColors = {
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    inactive:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    completed:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  };

  const rentalTypeColors = {
    monthly:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
    daily:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  };

  const paymentStatusColors = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300",
    overdue:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300",
  };

  const getRentalTypeColor = (rentalType) => {
    return rentalTypeColors[rentalType] || rentalTypeColors.monthly;
  };

  const tabs = [
    { id: "overview", label: t("tenants.personalInfo"), icon: User },
    { id: "lease", label: t("tenants.leaseInfo"), icon: FileText },
    { id: "payments", label: t("tenants.paymentHistory"), icon: CreditCard },
    { id: "reviews", label: t("tenants.reviews"), icon: MessageSquare },
    { id: "leases", label: t("tenants.leases"), icon: FileText },
  ];

  // Handler functions
  const handleAddLease = () => {
    setEditingLease(null);
    setShowLeaseForm(true);
  };

  const handleEditLease = (lease) => {
    setEditingLease(lease);
    setShowLeaseForm(true);
  };

  const handleViewLease = (lease) => {
    setSelectedLease(lease);
    setShowLeaseViewModal(true);
  };

  const handleSaveLease = async (leaseData) => {
    try {
      if (leaseData?.deleted && leaseData?.id) {
        // Delete rent via API
        await deleteRent(leaseData.id);
        // Refresh rents after deletion
        if (id) {
          const response = await getRents({ tenant: id });
          const rentsData =
            response?.results || response?.data || response || [];
          setRents(Array.isArray(rentsData) ? rentsData : []);
        }
        toast.success(
          direction === "rtl"
            ? "تم حذف الإيجار بنجاح"
            : "Rent deleted successfully"
        );
        setShowLeaseForm(false);
        setEditingLease(null);
      } else {
        // Refresh rents after create/update (create/update is handled by LeaseForm)
        if (id) {
          const response = await getRents({ tenant: id });
          const rentsData =
            response?.results || response?.data || response || [];
          setRents(Array.isArray(rentsData) ? rentsData : []);
        }
        toast.success(
          direction === "rtl"
            ? "تم حفظ الإيجار بنجاح"
            : "Rent saved successfully"
        );
        setShowLeaseForm(false);
        setEditingLease(null);
      }
    } catch (error) {
      console.error("Error saving lease:", error);
      toast.error(
        direction === "rtl" ? "فشل حفظ الإيجار" : "Failed to save rent"
      );
    }
  };

  const handleCloseLeaseForm = () => {
    setShowLeaseForm(false);
    setEditingLease(null);
  };

  const handleCloseLeaseViewModal = () => {
    setShowLeaseViewModal(false);
    setSelectedLease(null);
  };

  const handleAddReview = () => {
    setEditingReview(null);
    setShowReviewForm(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowReviewViewModal(true);
  };

  // Handle reviews error
  useEffect(() => {
    if (reviewsError) {
      toast.error(reviewsError);
      dispatch(clearError());
    }
  }, [reviewsError, dispatch]);

  const handleSaveReview = async (reviewData) => {
    try {
      if (editingReview && editingReview.id) {
        // Update review - map form data to API format
        await dispatch(
          updateReview({
            id: editingReview.id,
            data: {
              rate: reviewData.rate || reviewData.rating,
              comment: reviewData.comment,
            },
          })
        ).unwrap();
        toast.success(
          direction === "rtl"
            ? "تم تحديث المراجعة بنجاح"
            : "Review updated successfully"
        );
      } else {
        // Create review - data is already sent by ReviewForm via createReview
        toast.success(
          direction === "rtl"
            ? "تم إضافة المراجعة بنجاح"
            : "Review added successfully"
        );
      }

      // Refresh reviews after save
      if (id) {
        dispatch(fetchReviews({ tenant: id }));
      }

      setShowReviewForm(false);
      setEditingReview(null);
    } catch (error) {
      const errorMessage = error?.message || error || "Failed to save review";
      toast.error(errorMessage);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId) {
      toast.error(
        direction === "rtl"
          ? "لا يمكن حذف المراجعة: المعرف غير موجود"
          : "Cannot delete review: ID is missing"
      );
      return;
    }

    if (
      window.confirm(
        direction === "rtl"
          ? "هل أنت متأكد من حذف هذه المراجعة؟"
          : "Are you sure you want to delete this review?"
      )
    ) {
      try {
        await dispatch(deleteReview(reviewId)).unwrap();
        toast.success(
          direction === "rtl"
            ? "تم حذف المراجعة بنجاح"
            : "Review deleted successfully"
        );
        // Refresh reviews after deletion - wait a bit to ensure API processed the delete
        if (id) {
          // Small delay to ensure backend processed the delete
          setTimeout(() => {
            dispatch(fetchReviews({ tenant: id }));
          }, 100);
        }
      } catch (error) {
        const errorMessage =
          error?.message || error || "Failed to delete review";
        toast.error(errorMessage);
      }
    }
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleCloseReviewViewModal = () => {
    setShowReviewViewModal(false);
    setSelectedReview(null);
  };

  const handlePrintLease = (lease) => {
    console.log("Printing lease:", lease);
    // Add print functionality here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 md:p-6 space-y-6">
        {isLoading && (
          <div className="text-center text-gray-600 dark:text-gray-300">
            Loading...
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div
                className={`flex items-center ${
                  direction === "rtl"
                    ? "space-x-reverse space-x-4"
                    : "space-x-4"
                }`}
              >
                <Avatar src={tenant.avatar} alt={tenant.name} size="xl" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {tenant.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        statusColors[tenant.status]
                      }`}
                    >
                      {t(`tenants.${tenant.status}`)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 capitalize flex items-center">
                      <Home
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {t("tenants.unit")}: {tenant.unit}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                      <DollarSign
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {tenant.rent}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md flex-1 sm:flex-none">
                <Edit
                  className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("tenants.editProfile")}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-0 overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav
                    className={`flex flex-wrap px-4 sm:px-6 overflow-x-auto ${
                      direction === "rtl"
                        ? "space-x-reverse space-x-2"
                        : "space-x-2"
                    }`}
                  >
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-3 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm flex items-center whitespace-nowrap transition-colors ${
                            activeTab === tab.id
                              ? "border-blue-500 text-blue-600 dark:text-blue-400"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                          }`}
                        >
                          <Icon
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              direction === "rtl"
                                ? "ml-1 sm:ml-2"
                                : "mr-1 sm:mr-2"
                            }`}
                          />
                          <span className="hidden sm:inline">{tab.label}</span>
                          <span className="sm:hidden">
                            {tab.label.split(" ")[0]}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("tenants.personalInfo")}
                          </h3>
                          <div className="space-y-3">
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.name")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {tenant.name}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.email")}
                                </span>
                                <p className="text-gray-900 dark:text-white text-sm">
                                  {tenant.email}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.phone")}
                                </span>
                                <p className="text-gray-900 dark:text-white text-sm">
                                  {tenant.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("tenants.leaseInfo")}
                          </h3>
                          <div className="space-y-3">
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
                              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.unit")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {tenant.unit}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
                              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.leaseStart")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {new Date(tenant.leaseStart).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
                              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.leaseEnd")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {new Date(tenant.leaseEnd).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "lease" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("tenants.leaseInfo")}
                          </h3>
                          <div className="space-y-3">
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Home className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.unit")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {tenant.unit}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.leaseStart")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {new Date(
                                    tenant.leaseStart
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`flex items-center ${
                                direction === "rtl"
                                  ? "space-x-reverse space-x-3"
                                  : "space-x-3"
                              }`}
                            >
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                  {t("tenants.leaseEnd")}
                                </span>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {new Date(
                                    tenant.leaseEnd
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Financial Details
                          </h3>
                          <div className="space-y-3">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                {t("tenants.rentAmount")}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                ${tenant.rent}
                              </p>
                            </div>
                            <div
                              className={`p-3 rounded-lg border ${
                                tenant.rentalType === "daily"
                                  ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                                  : "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                              }`}
                            >
                              <span className="text-gray-600 dark:text-gray-400 text-sm block">
                                {t("tenants.rentalType")}
                              </span>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {t(`tenants.${tenant.rentalType}`)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "payments" && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("tenants.paymentHistory")}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr
                              className={`border-b border-gray-200 dark:border-gray-700 ${
                                direction === "rtl" ? "flex-start" : "flex-end"
                              }`}
                            >
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                {t("tenants.date")}
                              </th>
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                {t("tenants.amount")}
                              </th>
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                {t("tenants.method")}
                              </th>
                              <th
                                className={`${
                                  direction === "rtl"
                                    ? "text-left"
                                    : "text-left"
                                } py-3 px-4 text-gray-600 dark:text-gray-400 font-medium`}
                              >
                                {t("tenants.status")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tenant.paymentHistory.map((payment, index) => (
                              <tr
                                key={payment.id || `payment-${index}`}
                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">
                                  {new Date(payment.date).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4 text-gray-900 dark:text-white font-semibold">
                                  ${payment.amount.toLocaleString()}
                                </td>
                                <td className="py-4 px-4 text-gray-900 dark:text-white">
                                  {payment.method}
                                </td>
                                <td className="py-4 px-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                      paymentStatusColors[payment.status]
                                    } flex items-center w-fit`}
                                  >
                                    {payment.status === "paid" ? (
                                      <CheckCircle
                                        className={`h-3 w-3 ${
                                          direction === "rtl" ? "ml-1" : "mr-1"
                                        }`}
                                      />
                                    ) : (
                                      <Clock
                                        className={`h-3 w-3 ${
                                          direction === "rtl" ? "ml-1" : "mr-1"
                                        }`}
                                      />
                                    )}
                                    {payment.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {t("tenants.reviews")}
                        </h3>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                          onClick={handleAddReview}
                        >
                          <Plus
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-2" : "mr-2"
                            }`}
                          />
                          {t("tenants.addReview")}
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {tenant.reviews && tenant.reviews.length > 0 ? (
                          tenant.reviews.map((review, index) => (
                            <div
                              key={review.id || `review-${index}`}
                              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2 ">
                                    <div className="flex items-center gap-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={`review-${
                                            review.id || index
                                          }-star-${i}`}
                                          className={`h-4 w-4 ${
                                            i <
                                            parseFloat(
                                              review.rate || review.rating || 0
                                            )
                                              ? "text-amber-500 fill-amber-500"
                                              : "text-gray-300 dark:text-gray-600"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <div
                                    className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ${
                                      direction === "rtl" ? "flex-row" : ""
                                    }`}
                                  >
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">
                                      {review.tenantName ||
                                        (review.tenant
                                          ? getTenantNameById(
                                              typeof review.tenant === "object"
                                                ? review.tenant.id
                                                : review.tenant
                                            )
                                          : tenant.name || "-")}
                                    </span>
                                    <span className="mx-1">•</span>
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {review.date
                                        ? new Date(
                                            review.date
                                          ).toLocaleDateString()
                                        : "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {review.comment && (
                                <div className="mb-3">
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {review.comment}
                                  </p>
                                </div>
                              )}
                              <div className="flex justify-end">
                                <div
                                  className={`flex gap-2 ${
                                    direction === "rtl"
                                      ? "flex-row-reverse"
                                      : ""
                                  }`}
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewReview(review)}
                                    title={t("common.view")}
                                    className="flex items-center"
                                  >
                                    <Eye className="h-3 w-3" />
                                    <span
                                      className={`hidden sm:inline ${
                                        direction === "rtl" ? "mr-1" : "ml-1"
                                      }`}
                                    >
                                      {t("common.view")}
                                    </span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditReview(review)}
                                    title={t("common.edit")}
                                    className="flex items-center"
                                  >
                                    <Edit className="h-3 w-3" />
                                    <span
                                      className={`hidden sm:inline ${
                                        direction === "rtl" ? "mr-1" : "ml-1"
                                      }`}
                                    >
                                      {t("common.edit")}
                                    </span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (!review.id) {
                                        toast.error(
                                          direction === "rtl"
                                            ? "لا يمكن حذف المراجعة: المعرف غير موجود"
                                            : "Cannot delete review: ID is missing"
                                        );
                                        return;
                                      }
                                      handleDeleteReview(review.id);
                                    }}
                                    disabled={!review.id}
                                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    title={t("common.delete")}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span
                                      className={`hidden sm:inline ${
                                        direction === "rtl" ? "mr-1" : "ml-1"
                                      }`}
                                    >
                                      {t("common.delete")}
                                    </span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">
                              {t("tenants.noReviews")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "leases" && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {t("tenants.leases")}
                        </h3>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                          onClick={handleAddLease}
                        >
                          <Plus
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-2" : "mr-2"
                            }`}
                          />
                          {t("tenants.addLease")}
                        </Button>
                      </div>
                      {loadingRents ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                          <p className="text-gray-500 dark:text-gray-400 mt-4">
                            {direction === "rtl"
                              ? "جاري التحميل..."
                              : "Loading..."}
                          </p>
                        </div>
                      ) : tenant.leases && tenant.leases.length > 0 ? (
                        <div className="space-y-4">
                          {tenant.leases.map((lease, index) => {
                            const unitName =
                              typeof lease.unit === "object"
                                ? lease.unit.name || `#${lease.unit.id}`
                                : lease.unit_name ||
                                  `Unit #${lease.unit || "-"}`;
                            const rentStart =
                              lease.rent_start || lease.startDate;
                            const rentEnd = lease.rent_end || lease.endDate;
                            const totalAmount =
                              lease.total_amount || lease.rent || 0;
                            const paymentStatus =
                              lease.payment_status || "pending";

                            return (
                              <div
                                key={lease.id || `lease-${index}`}
                                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                      {unitName}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {rentStart
                                        ? new Date(
                                            rentStart
                                          ).toLocaleDateString()
                                        : "-"}{" "}
                                      -{" "}
                                      {rentEnd
                                        ? new Date(rentEnd).toLocaleDateString()
                                        : "-"}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                      paymentStatusColors[paymentStatus] ||
                                      paymentStatusColors.pending
                                    }`}
                                  >
                                    {paymentStatus === "paid"
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
                                      : paymentStatus}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {direction === "rtl"
                                        ? "المبلغ الإجمالي:"
                                        : "Total Amount:"}
                                    </span>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                      $
                                      {parseFloat(totalAmount).toLocaleString()}
                                    </p>
                                  </div>
                                  {lease.payment_method && (
                                    <div>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {direction === "rtl"
                                          ? "طريقة الدفع:"
                                          : "Payment Method:"}
                                      </span>
                                      <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                        {lease.payment_method
                                          .replace("_", " ")
                                          .replace(
                                            /(bank transfer|credit card|online payment)/gi,
                                            (match) => {
                                              const methods = {
                                                "bank transfer":
                                                  direction === "rtl"
                                                    ? "تحويل بنكي"
                                                    : "Bank Transfer",
                                                "credit card":
                                                  direction === "rtl"
                                                    ? "بطاقة ائتمان"
                                                    : "Credit Card",
                                                "online payment":
                                                  direction === "rtl"
                                                    ? "دفع إلكتروني"
                                                    : "Online Payment",
                                              };
                                              return (
                                                methods[match.toLowerCase()] ||
                                                match
                                              );
                                            }
                                          )}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                {lease.notes && (
                                  <div className="mb-3">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {direction === "rtl"
                                        ? "ملاحظات:"
                                        : "Notes:"}
                                    </span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                      {lease.notes}
                                    </p>
                                  </div>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3">
                                  <div
                                    className={`flex ${
                                      direction === "rtl"
                                        ? "space-x-reverse space-x-2"
                                        : "space-x-2"
                                    }`}
                                  >
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleViewLease(lease)}
                                      title={t("common.view")}
                                      className="flex-1 sm:flex-none"
                                    >
                                      <Eye className="h-3 w-3" />
                                      <span
                                        className={`hidden sm:inline ${
                                          direction === "rtl" ? "mr-1" : "ml-1"
                                        }`}
                                      >
                                        {t("common.view")}
                                      </span>
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditLease(lease)}
                                      title={t("common.edit")}
                                      className="flex-1 sm:flex-none"
                                    >
                                      <Edit className="h-3 w-3" />
                                      <span
                                        className={`hidden sm:inline ${
                                          direction === "rtl" ? "mr-1" : "ml-1"
                                        }`}
                                      >
                                        {t("common.edit")}
                                      </span>
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                                      title={t("common.delete")}
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            direction === "rtl"
                                              ? "هل أنت متأكد من حذف هذا الإيجار؟"
                                              : "Are you sure you want to delete this rent?"
                                          )
                                        ) {
                                          handleSaveLease({
                                            ...lease,
                                            deleted: true,
                                          });
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      <span
                                        className={`hidden sm:inline ${
                                          direction === "rtl" ? "mr-1" : "ml-1"
                                        }`}
                                      >
                                        {t("common.delete")}
                                      </span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">
                            {direction === "rtl"
                              ? "لا توجد إيجارات"
                              : "No rents found"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rent Info */}
            <motion.div
              initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                <div className="mb-4">
                  <h3
                    className={`text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between ${
                      direction === "rtl" ? "flex-row" : ""
                    }`}
                  >
                    <span className="flex items-center">
                      <DollarSign
                        className={`h-4 w-4 ${
                          direction === "rtl" ? "ml-2" : "mr-2"
                        } text-green-600`}
                      />
                      {t("tenants.rentAmount")}
                    </span>
                    <div
                      className={`flex items-center ${
                        direction === "rtl"
                          ? "space-x-reverse space-x-2"
                          : "space-x-2"
                      }`}
                    >
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        ${tenant.rent}
                      </span>
                    </div>
                  </h3>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t("tenants.quickActions")}
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    size="sm"
                  >
                    <MessageSquare
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("tenants.sendMessage")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
                    size="sm"
                  >
                    <Mail
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("tenants.sendEmail")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
                    size="sm"
                  >
                    <FileText
                      className={`h-4 w-4 ${
                        direction === "rtl" ? "ml-2" : "mr-2"
                      }`}
                    />
                    {t("tenants.viewLease")}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: direction === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock
                    className={`h-5 w-5 ${
                      direction === "rtl" ? "ml-2" : "mr-2"
                    } text-orange-600`}
                  />
                  {t("tenants.recentActivity")}
                </h3>
                <div className="space-y-3">
                  {tenant.recentActivity.map((activity, index) => (
                    <div
                      key={activity.id || `activity-${index}`}
                      className={`flex items-start ${
                        direction === "rtl"
                          ? "space-x-reverse space-x-3"
                          : "space-x-3"
                      }`}
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLeaseForm && (
        <LeaseForm
          lease={editingLease}
          onSave={handleSaveLease}
          onClose={handleCloseLeaseForm}
          isEdit={!!editingLease}
        />
      )}

      {showLeaseViewModal && selectedLease && (
        <LeaseViewModal
          lease={selectedLease}
          onClose={handleCloseLeaseViewModal}
          onEdit={handleEditLease}
          onPrint={handlePrintLease}
        />
      )}

      {showReviewForm && (
        <ReviewForm
          review={editingReview}
          onSave={handleSaveReview}
          onCancel={handleCloseReviewForm}
          isEdit={!!editingReview}
        />
      )}

      {showReviewViewModal && selectedReview && (
        <ReviewViewModal
          review={selectedReview}
          onClose={handleCloseReviewViewModal}
          onEdit={handleEditReview}
        />
      )}
    </div>
  );
};

export default TenantDetail;
