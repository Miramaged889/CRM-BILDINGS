import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguageStore } from "../../../stores/languageStore";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Home,
  Star,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  Search,
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { OwnerForm } from "../../../components/manger form";

const OwnerDetail = () => {
  const { direction } = useLanguageStore();
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contractSearchTerm, setContractSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  const mockOwners = [
    {
      id: 1,
      name: "Ahmed Ali",
      email: "ahmed@example.com",
      phone: "+201234567890",
      address: "123 Main Street, Cairo, Egypt",
      dateJoined: "2020-01-15",
      buildingsCount: 3,
      units: 28,
      rating: 4.6,
      totalRevenue: 125000,
      monthlyRevenue: 8500,
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      buildings: [
        {
          id: 1,
          name: "Sunset Tower",
          address: "Downtown, Cairo",
          units: 12,
          occupiedUnits: 10,
          monthlyRevenue: 4500,
        },
        {
          id: 2,
          name: "Palm Residency",
          address: "New Cairo",
          units: 8,
          occupiedUnits: 6,
          monthlyRevenue: 2500,
        },
        {
          id: 3,
          name: "Nile Heights",
          address: "Zamalek, Cairo",
          units: 8,
          occupiedUnits: 7,
          monthlyRevenue: 1500,
        },
      ],
      contracts: [
        {
          id: 1,
          contractNumber: "CON-001",
          buildingName: "Sunset Tower",
          unitNumber: "A-101",
          tenantName: "John Smith",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          monthlyRent: 1200,
          status: "active",
          contractPhoto:
            "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          contractPDF: "contract-001.pdf",
        },
        {
          id: 2,
          contractNumber: "CON-002",
          buildingName: "Palm Residency",
          unitNumber: "B-205",
          tenantName: "Sarah Johnson",
          startDate: "2024-02-15",
          endDate: "2025-02-14",
          monthlyRent: 950,
          status: "active",
          contractPhoto:
            "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          contractPDF: "contract-002.pdf",
        },
        {
          id: 3,
          contractNumber: "CON-003",
          buildingName: "Nile Heights",
          unitNumber: "C-301",
          tenantName: "Mike Davis",
          startDate: "2023-06-01",
          endDate: "2024-05-31",
          monthlyRent: 1100,
          status: "expired",
          contractPhoto:
            "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          contractPDF: "contract-003.pdf",
        },
      ],
    },
    {
      id: 2,
      name: "Mona Hassan",
      email: "mona@example.com",
      phone: "+201112223334",
      address: "456 Garden City, Cairo, Egypt",
      dateJoined: "2021-03-20",
      buildingsCount: 1,
      units: 12,
      rating: 4.2,
      totalRevenue: 45000,
      monthlyRevenue: 3200,
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      buildings: [
        {
          id: 4,
          name: "Garden Plaza",
          address: "Garden City, Cairo",
          units: 12,
          occupiedUnits: 10,
          monthlyRevenue: 3200,
        },
      ],
      contracts: [
        {
          id: 4,
          contractNumber: "CON-004",
          buildingName: "Garden Plaza",
          unitNumber: "D-101",
          tenantName: "Ahmed Hassan",
          startDate: "2024-03-01",
          endDate: "2025-02-28",
          monthlyRent: 800,
          status: "active",
          contractPhoto:
            "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          contractPDF: "contract-004.pdf",
        },
        {
          id: 5,
          contractNumber: "CON-005",
          buildingName: "Garden Plaza",
          unitNumber: "D-205",
          tenantName: "Fatma Ali",
          startDate: "2023-09-15",
          endDate: "2024-09-14",
          monthlyRent: 750,
          status: "expired",
          contractPhoto:
            "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          contractPDF: "contract-005.pdf",
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchOwner = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundOwner = mockOwners.find((o) => o.id === parseInt(id));
      setOwner(foundOwner);
      setLoading(false);
    };

    fetchOwner();
  }, [id]);

  const handleEdit = () => {
    setShowForm(true);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        direction === "rtl"
          ? "هل أنت متأكد من حذف هذا المالك؟"
          : "Are you sure you want to delete this owner?"
      )
    ) {
      console.log("Delete owner:", owner);
      navigate("/owners");
      // In real app, this would call API to delete
    }
  };

  const handleSaveOwner = (ownerData) => {
    console.log("Saving owner:", ownerData);
    setOwner(ownerData);
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const filteredBuildings =
    owner?.buildings?.filter((building) =>
      [building.name, building.address].some((v) =>
        v.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) || [];

  const filteredContracts =
    owner?.contracts?.filter((contract) =>
      [
        contract.contractNumber,
        contract.buildingName,
        contract.unitNumber,
        contract.tenantName,
      ].some((v) => v.toLowerCase().includes(contractSearchTerm.toLowerCase()))
    ) || [];

  const getContractStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "expired":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getContractStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />;
      case "expired":
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {direction === "rtl" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {direction === "rtl" ? "المالك غير موجود" : "Owner Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {direction === "rtl"
              ? "المالك المطلوب غير موجود أو تم حذفه"
              : "The requested owner was not found or has been deleted"}
          </p>
          <Button onClick={() => navigate("/owners")}>
            <ArrowLeft
              className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {direction === "rtl" ? "العودة للملاك" : "Back to Owners"}
          </Button>
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
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              {owner.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              {direction === "rtl" ? "معلومات المالك" : "Owner Information"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="flex items-center"
          >
            <Trash2
              className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {direction === "rtl" ? "حذف" : "Delete"}
          </Button>
          <Button onClick={handleEdit} className="flex items-center">
            <Edit
              className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`}
            />
            {direction === "rtl" ? "تعديل" : "Edit"}
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "إجمالي المباني" : "Total Buildings"}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {owner.buildingsCount}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "إجمالي الوحدات" : "Total Units"}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {owner.units}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Home className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "التقييم" : "Rating"}
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {owner.rating}
              </p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
              <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {direction === "rtl" ? "الإيراد الشهري" : "Monthly Revenue"}
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${owner.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Owner Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Owner Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User
                className={`h-5 w-5 ${
                  direction === "rtl" ? "ml-2" : "mr-2"
                } text-blue-600`}
              />
              {direction === "rtl" ? "معلومات المالك" : "Owner Details"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "الاسم" : "Name"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {owner.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "البريد الإلكتروني" : "Email"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {owner.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "رقم الهاتف" : "Phone"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {owner.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {direction === "rtl" ? "تاريخ الانضمام" : "Date Joined"}
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(owner.dateJoined).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {direction === "rtl" ? "العنوان" : "Address"}
              </label>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                {owner.address}
              </p>
            </div>
          </Card>

          {/* Buildings List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Building2
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-green-600`}
                />
                {direction === "rtl" ? "قائمة المباني" : "Buildings List"}
              </h3>
              <div className="relative max-w-sm">
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
                      ? "بحث في المباني..."
                      : "Search buildings..."
                  }
                  className={`${
                    direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                  }`}
                />
              </div>
            </div>
            <div className="space-y-3">
              {filteredBuildings.map((building) => (
                <div
                  key={building.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {building.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {building.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {direction === "rtl" ? "الوحدات" : "Units"}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {building.occupiedUnits}/{building.units}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {direction === "rtl"
                        ? "الإيراد الشهري"
                        : "Monthly Revenue"}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${building.monthlyRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Contracts List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FileText
                  className={`h-5 w-5 ${
                    direction === "rtl" ? "ml-2" : "mr-2"
                  } text-blue-600`}
                />
                {direction === "rtl" ? "قائمة العقود" : "Contracts List"}
              </h3>
              <div className="relative max-w-sm">
                <Search
                  className={`absolute ${
                    direction === "rtl" ? "right-3" : "left-3"
                  } top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4`}
                />
                <Input
                  value={contractSearchTerm}
                  onChange={(e) => setContractSearchTerm(e.target.value)}
                  placeholder={
                    direction === "rtl"
                      ? "بحث في العقود..."
                      : "Search contracts..."
                  }
                  className={`${
                    direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                  }`}
                />
              </div>
            </div>
            <div className="space-y-4">
              {filteredContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Contract Photo */}
                    <div className="lg:col-span-1">
                      <img
                        src={contract.contractPhoto}
                        alt={`Contract ${contract.contractNumber}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Contract Details */}
                    <div className="lg:col-span-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {contract.contractNumber}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {contract.buildingName} - {contract.unitNumber}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center ${getContractStatusColor(
                            contract.status
                          )}`}
                        >
                          {getContractStatusIcon(contract.status)}
                          <span
                            className={`${
                              direction === "rtl" ? "mr-1" : "ml-1"
                            }`}
                          >
                            {direction === "rtl"
                              ? contract.status === "active"
                                ? "نشط"
                                : "منتهي"
                              : contract.status}
                          </span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            {direction === "rtl" ? "المستأجر" : "Tenant"}:
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {contract.tenantName}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            {direction === "rtl"
                              ? "الإيجار الشهري"
                              : "Monthly Rent"}
                            :
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${contract.monthlyRent.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            {direction === "rtl"
                              ? "تاريخ البداية"
                              : "Start Date"}
                            :
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(contract.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            {direction === "rtl" ? "تاريخ النهاية" : "End Date"}
                            :
                          </span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(contract.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Contract Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => {
                            // In real app, this would open the PDF
                            console.log("View PDF:", contract.contractPDF);
                          }}
                        >
                          <Eye
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-1" : "mr-1"
                            }`}
                          />
                          {direction === "rtl" ? "عرض" : "View"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => {
                            // In real app, this would download the PDF
                            console.log("Download PDF:", contract.contractPDF);
                          }}
                        >
                          <Download
                            className={`h-4 w-4 ${
                              direction === "rtl" ? "ml-1" : "mr-1"
                            }`}
                          />
                          {direction === "rtl" ? "تحميل" : "Download"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredContracts.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {direction === "rtl"
                      ? "لا توجد عقود مطابقة للبحث"
                      : "No contracts match your search"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Avatar */}
          <Card className="p-6">
            <div className="text-center">
              <img
                src={owner.avatar}
                alt={owner.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {owner.name}
              </h3>
              <div className="flex items-center justify-center text-amber-500 mt-2">
                <Star className="h-4 w-4" />
                <span className="ml-1">{owner.rating}</span>
              </div>
            </div>
          </Card>

          {/* Revenue Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp
                className={`h-5 w-5 ${
                  direction === "rtl" ? "ml-2" : "mr-2"
                } text-purple-600`}
              />
              {direction === "rtl" ? "ملخص الإيرادات" : "Revenue Summary"}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {direction === "rtl" ? "الإيراد الشهري" : "Monthly Revenue"}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${owner.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {direction === "rtl" ? "إجمالي الإيرادات" : "Total Revenue"}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${owner.totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Forms */}
      {showForm && (
        <OwnerForm
          owner={owner}
          onSave={handleSaveOwner}
          onCancel={handleCloseForm}
          isEdit={true}
        />
      )}
    </div>
  );
};

export default OwnerDetail;
