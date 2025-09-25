import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../stores/languageStore";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  UserPlus,
  Users,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  Building,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/ui/Icon";
import Avatar from "../../../components/ui/Avatar";

const StaffList = () => {
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const staff = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@realestate.com",
      phone: "+1 (555) 123-4567",
      role: "propertyManager",
      department: "management",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      joinDate: "2023-01-15",
      location: "New York Office",
      employeeId: "EMP001",
      salary: "$75,000",
      reportsTo: "CEO",
    },
    {
      id: 2,
      name: "Mike Davis",
      email: "mike@realestate.com",
      phone: "+1 (555) 234-5678",
      role: "maintenanceSupervisor",
      department: "maintenance",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      joinDate: "2023-03-20",
      location: "Chicago Office",
      employeeId: "EMP002",
      salary: "$65,000",
      reportsTo: "Sarah Johnson",
    },
    {
      id: 3,
      name: "Emily Brown",
      email: "emily@realestate.com",
      phone: "+1 (555) 345-6789",
      role: "leasingAgent",
      department: "sales",
      status: "inactive",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      joinDate: "2023-06-10",
      location: "Los Angeles Office",
      employeeId: "EMP003",
      salary: "$55,000",
      reportsTo: "Sarah Johnson",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@realestate.com",
      phone: "+1 (555) 456-7890",
      role: "propertyManager",
      department: "management",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      joinDate: "2023-02-10",
      location: "Miami Office",
      employeeId: "EMP004",
      salary: "$70,000",
      reportsTo: "CEO",
    },
    {
      id: 5,
      name: "Lisa Garcia",
      email: "lisa@realestate.com",
      phone: "+1 (555) 567-8901",
      role: "leasingAgent",
      department: "sales",
      status: "active",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      joinDate: "2023-04-05",
      location: "Seattle Office",
      employeeId: "EMP005",
      salary: "$52,000",
      reportsTo: "David Wilson",
    },
    {
      id: 6,
      name: "John Smith",
      email: "john@realestate.com",
      phone: "+1 (555) 678-9012",
      role: "maintenanceSupervisor",
      department: "maintenance",
      status: "pending",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      joinDate: "2023-08-15",
      location: "Denver Office",
      employeeId: "EMP006",
      salary: "$60,000",
      reportsTo: "Mike Davis",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
      case "inactive":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
                {t("nav.staff")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("staff.manageStaff")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
                <Filter className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
                {t("common.filter")}
              </Button>
              <Button size="sm" className="shadow-sm hover:shadow-md transition-shadow">
                <UserPlus className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
                {t("staff.addStaff")}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t("staff.totalStaff")}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">{staff.length}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                    {t("staff.activeStaff")}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {staff.filter(s => s.status === "active").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
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
                    {t("staff.newHires")}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {staff.filter(s => s.status === "pending").length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <UserPlus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                    {t("staff.departments")}
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {new Set(staff.map(s => s.department)).size}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Building className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 shadow-lg border-0 bg-white dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute ${direction === "rtl" ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
                  <input
                    type="text"
                    placeholder={t("staff.searchStaff")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full ${direction === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-600 transition-all duration-200`}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Avatar src={member.avatar} alt={member.name} size="lg" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(`staff.${member.role}`)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      member.status
                    )}`}
                  >
                    {t(`staff.${member.status}`)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {member.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {member.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {member.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t("staff.joinDate")}: {new Date(member.joinDate).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Link to={`/staff/${member.id}`}>
                      <Button size="sm" variant="outline" title={t("staff.view")}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" title={t("staff.edit")}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" title={t("staff.sendEmail")}>
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" title={t("staff.delete")}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mb-4">
              <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              {t("staff.noStaffFound")}
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              {t("staff.tryDifferentSearch")}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StaffList;
