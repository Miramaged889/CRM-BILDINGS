import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore } from "../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  Star,
  MessageSquare,
  User,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  ReviewForm,
  ReviewViewModal,
} from "../../components/forms/manger form";

const TenantReviews = () => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  const reviews = [
    {
      id: 1,
      tenant: "John Smith",
      tenantId: 1,
      unit: "A-101",
      building: "Sunset Tower",
      rating: 5,
      comment:
        "Great tenant, always pays on time and maintains the unit well. Very respectful and communicative.",
      date: "2024-06-01",
      status: "positive",
      category: "payment",
    },
    {
      id: 2,
      tenant: "Sarah Johnson",
      tenantId: 2,
      unit: "A-102",
      building: "Sunset Tower",
      rating: 4,
      comment:
        "Keeps the unit clean and reports issues promptly. Good communication.",
      date: "2024-07-15",
      status: "positive",
      category: "maintenance",
    },
    {
      id: 3,
      tenant: "Mike Davis",
      tenantId: 3,
      unit: "B-201",
      building: "Palm Residency",
      rating: 2,
      comment: "Frequent late payments and noise complaints from neighbors.",
      date: "2024-08-10",
      status: "negative",
      category: "behavior",
    },
    {
      id: 4,
      tenant: "Ahmed Hassan",
      tenantId: 4,
      unit: "C-301",
      building: "Nile Heights",
      rating: 5,
      comment:
        "Excellent tenant! Always pays on time and takes great care of the property.",
      date: "2024-09-05",
      status: "positive",
      category: "overall",
    },
    {
      id: 5,
      tenant: "Lisa Brown",
      tenantId: 5,
      unit: "D-101",
      building: "Nile Heights",
      rating: 3,
      comment:
        "Average tenant. Some minor issues with cleanliness but generally okay.",
      date: "2024-09-20",
      status: "neutral",
      category: "cleanliness",
    },
  ];

  // Get unique ratings for filter options
  const ratings = [...new Set(reviews.map((review) => review.rating))].sort(
    (a, b) => b - a
  );

  const filtered = reviews.filter((r) => {
    const matchesSearch = [r.tenant, r.comment, r.unit, r.building].some((v) =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRating =
      ratingFilter === "all" || r.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  const handleView = (review) => {
    setSelectedReview(review);
    setShowViewModal(true);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDelete = (review) => {
    if (
      window.confirm(
        direction === "rtl"
          ? "هل أنت متأكد من حذف هذه المراجعة؟"
          : "Are you sure you want to delete this review?"
      )
    ) {
      console.log("Delete review:", review);
      // In real app, this would call API to delete
    }
  };

  const handleAddNew = () => {
    setEditingReview(null);
    setShowForm(true);
  };

  const handleSaveReview = (reviewData) => {
    console.log("Saving review:", reviewData);
    setShowForm(false);
    setEditingReview(null);
    // In real app, this would call API to save
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedReview(null);
  };

  const getStatusColor = (status) => {
    if (status === "positive")
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (status === "negative")
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  };

  const getStatusIcon = (status) => {
    if (status === "positive") return <ThumbsUp className="h-4 w-4" />;
    if (status === "negative") return <ThumbsDown className="h-4 w-4" />;
    return <Star className="h-4 w-4" />;
  };

  const translateCategory = (category) => {
    const categories = {
      payment: direction === "rtl" ? "الدفع" : "Payment",
      maintenance: direction === "rtl" ? "الصيانة" : "Maintenance",
      behavior: direction === "rtl" ? "السلوك" : "Behavior",
      cleanliness: direction === "rtl" ? "النظافة" : "Cleanliness",
      overall: direction === "rtl" ? "عام" : "Overall",
    };
    return categories[category] || category;
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            {direction === "rtl" ? "تقييمات المستأجرين" : "Tenant Reviews"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            {direction === "rtl" ? "مراجعات وتقييمات" : "Ratings and feedback"}
          </p>
        </div>
        <Button
          className="mt-6 sm:mt-0 shadow-sm hover:shadow-md transition-shadow"
          onClick={handleAddNew}
        >
          <Plus
            className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
          />
          {direction === "rtl" ? "إضافة مراجعة" : "Add Review"}
        </Button>
      </motion.div>

      <Card className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search
              className={`absolute ${
                direction === "rtl" ? "right-3" : "left-3"
              } top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4`}
            />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                direction === "rtl"
                  ? "بحث في المراجعات..."
                  : "Search reviews..."
              }
              className={`${direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"}`}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r, index) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow border-0 bg-white dark:bg-gray-800">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {r.tenant}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {r.unit} - {r.building}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < r.rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    r.status
                  )}`}
                >
                  {getStatusIcon(r.status)}
                  <span className="ml-1">
                    {direction === "rtl"
                      ? r.status === "positive"
                        ? "إيجابي"
                        : r.status === "negative"
                        ? "سلبي"
                        : "محايد"
                      : r.status === "positive"
                      ? "Positive"
                      : r.status === "negative"
                      ? "Negative"
                      : "Neutral"}
                  </span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {translateCategory(r.category)}
                </span>
              </div>

              {/* Comment */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {r.comment}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(r.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(r)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={direction === "rtl" ? "عرض" : "View"}
                  >
                    <Eye className="h-4 w-4 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(r)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={direction === "rtl" ? "تعديل" : "Edit"}
                  >
                    <Edit className="h-4 w-4 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(r)}
                    className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title={direction === "rtl" ? "حذف" : "Delete"}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mb-4">
            <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {direction === "rtl" ? "لا توجد مراجعات" : "No Reviews Found"}
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            {direction === "rtl"
              ? "جرب البحث بكلمات مختلفة"
              : "Try searching with different keywords"}
          </p>
        </motion.div>
      )}

      {/* Forms */}
      {showForm && (
        <ReviewForm
          review={editingReview}
          onSave={handleSaveReview}
          onCancel={handleCloseForm}
          isEdit={!!editingReview}
        />
      )}

      {showViewModal && (
        <ReviewViewModal
          review={selectedReview}
          onClose={handleCloseViewModal}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default TenantReviews;
