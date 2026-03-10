import React, { useEffect, useState } from "react";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import Navbar from "../components_lite/Navbar";
import { motion } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  Filter, 
  Search, 
  ArrowLeft,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  MapPin,
  Calendar,
  Mail,
  Phone,
  FileText,
  Download
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applicants } = useSelector((store) => store.application);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  });

  useEffect(() => {
    const fetchAllApplicants = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${APPLICATION_API_ENDPOINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        dispatch(setAllApplicants(res.data.job));
        
        // Calculate stats
        const applications = res.data.job?.applications || [];
        setStats({
          total: applications.length,
          pending: applications.filter(app => app.status === "pending").length,
          shortlisted: applications.filter(app => app.status === "shortlisted").length,
          rejected: applications.filter(app => app.status === "rejected").length,
          hired: applications.filter(app => app.status === "hired").length
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllApplicants();
  }, [params.id, dispatch]);

  const jobTitle = applicants?.title || "Job Position";
  const companyName = applicants?.company?.name || "Company";

  // Filter applicants based on search and status
  const filteredApplicants = applicants?.applications?.filter(app => {
    const matchesSearch = searchTerm === "" || 
      app.applicant?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const statsCards = [
    { label: "Total Applicants", value: stats.total, icon: Users, color: "blue", gradient: "from-blue-500 to-blue-600" },
    { label: "Pending Review", value: stats.pending, icon: Clock, color: "yellow", gradient: "from-yellow-500 to-orange-600" },
    { label: "Shortlisted", value: stats.shortlisted, icon: CheckCircle, color: "green", gradient: "from-green-500 to-emerald-600" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "red", gradient: "from-red-500 to-rose-600" },
    { label: "Hired", value: stats.hired, icon: Award, color: "purple", gradient: "from-purple-500 to-pink-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 
                hover:border-blue-600 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 
                  rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {jobTitle}
                  </h1>
                  <p className="text-gray-600">{companyName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-blue-100 text-blue-700">
                  {stats.total} Total Applicants
                </Badge>
                {stats.shortlisted > 0 && (
                  <Badge className="bg-green-100 text-green-700">
                    {stats.shortlisted} Shortlisted
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-4 border border-gray-100 
                  hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                    <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <div className="mt-2">
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / Math.max(stats.total, 1)) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                className="pl-10 border-2 border-gray-200 focus:border-blue-600 
                  transition-all duration-300 rounded-lg"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                className={filterStatus === "all" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                  : "hover:border-blue-600 hover:text-blue-600"
                }
              >
                All
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                onClick={() => setFilterStatus("pending")}
                className={filterStatus === "pending" 
                  ? "bg-gradient-to-r from-yellow-600 to-orange-600" 
                  : "hover:border-yellow-600 hover:text-yellow-600"
                }
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === "shortlisted" ? "default" : "outline"}
                onClick={() => setFilterStatus("shortlisted")}
                className={filterStatus === "shortlisted" 
                  ? "bg-gradient-to-r from-green-600 to-emerald-600" 
                  : "hover:border-green-600 hover:text-green-600"
                }
              >
                Shortlisted
              </Button>
              <Button
                variant={filterStatus === "rejected" ? "default" : "outline"}
                onClick={() => setFilterStatus("rejected")}
                className={filterStatus === "rejected" 
                  ? "bg-gradient-to-r from-red-600 to-rose-600" 
                  : "hover:border-red-600 hover:text-red-600"
                }
              >
                Rejected
              </Button>
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-sm text-gray-500"
            >
              Found {filteredApplicants.length} applicants matching "{searchTerm}"
            </motion.div>
          )}
        </motion.div>

        {/* Applicants Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-800">Applicants List</h2>
              </div>
              <Badge variant="outline" className="text-blue-600">
                {filteredApplicants.length} Applicants
              </Badge>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading applicants...</p>
              </div>
            </div>
          ) : (
            <ApplicantsTable applicants={filteredApplicants} />
          )}
          
          {/* Empty State */}
          {!isLoading && filteredApplicants.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center 
                justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Applicants Found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "No one has applied to this position yet"}
              </p>
              {(searchTerm || filterStatus !== "all") && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                  className="text-blue-600"
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex justify-end"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-gray-500 hover:text-blue-600"
          >
            Back to Top ↑
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Applicants;