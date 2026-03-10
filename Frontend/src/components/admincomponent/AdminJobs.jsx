import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllJAdminobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import {AnimatePresence, motion } from "framer-motion";
import { 
  Briefcase, 
  Search, 
  Plus, 
  Filter, 
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  X,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Badge } from "../ui/badge";

const AdminJobs = () => {
  useGetAllAdminJobs();
  const navigate = useNavigate();
  const { allJobs } = useSelector((store) => store.job);
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  // Calculate job statistics
  const stats = {
    total: allJobs?.length || 0,
    active: allJobs?.filter(job => job.isActive !== false).length || 0,
    newToday: allJobs?.filter(job => {
      const today = new Date();
      const jobDate = new Date(job.createdAt);
      return jobDate.toDateString() === today.toDateString();
    }).length || 0,
    totalApplicants: allJobs?.reduce((sum, job) => sum + (job.applications?.length || 0), 0) || 0
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  <span className="text-gray-800">Job </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Management
                  </span>
                </h1>
              </div>
              <p className="text-gray-600">
                Manage your job postings, track applications, and find the best talent
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate("/admin/jobs/create")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-700 hover:to-purple-700 text-white 
                  shadow-lg hover:shadow-xl transition-all duration-300 
                  flex items-center gap-2 px-6 py-3 text-lg"
              >
                <Plus className="w-5 h-5" />
                Post New Job
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {[
                { 
                  icon: Briefcase, 
                  label: "Total Jobs", 
                  value: stats.total,
                  color: "blue",
                  gradient: "from-blue-500 to-blue-600",
                  trend: "+12%"
                },
                { 
                  icon: CheckCircle, 
                  label: "Active Jobs", 
                  value: stats.active,
                  color: "green",
                  gradient: "from-green-500 to-emerald-600",
                  trend: "+8%"
                },
                { 
                  icon: Clock, 
                  label: "New Today", 
                  value: stats.newToday,
                  color: "orange",
                  gradient: "from-orange-500 to-red-600",
                  trend: "+3"
                },
                { 
                  icon: Users, 
                  label: "Total Applicants", 
                  value: stats.totalApplicants,
                  color: "purple",
                  gradient: "from-purple-500 to-pink-600",
                  trend: "+24%"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md p-5 border border-gray-100 
                    hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      {stat.trend}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                  <div className="mt-3">
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.value / Math.max(...Object.values(stats).filter(v => typeof v === 'number'))) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                transition-colors duration-300 ${isFocused ? 'text-blue-600' : 'text-gray-400'}`} 
              />
              <Input
                className="pl-10 border-2 border-gray-200 focus:border-blue-600 
                  transition-all duration-300 rounded-lg py-5"
                placeholder="Search jobs by title, location, or company..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                    p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowStats(!showStats)}
              className="gap-2 border-2 hover:border-blue-600 hover:text-blue-600 
                transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
              {showStats ? "Hide Stats" : "Show Stats"}
            </Button>
          </div>

          {/* Active Search Badge */}
          {input && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2"
            >
              <Badge className="bg-blue-100 text-blue-700 px-3 py-1">
                <Search className="w-3 h-3 mr-1" />
                Searching: {input}
              </Badge>
              <span className="text-xs text-gray-500">
                {stats.total} jobs available
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Jobs Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-800">Job Postings</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-600">
                  {stats.total} Jobs
                </Badge>
                <Badge variant="outline" className="text-green-600">
                  {stats.active} Active
                </Badge>
              </div>
            </div>
          </div>
          
          <AdminJobsTable />
          
          {/* Empty State (if no jobs) */}
          {stats.total === 0 && !input && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center 
                justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Jobs Posted Yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start by posting your first job opportunity
              </p>
              <Button 
                onClick={() => navigate("/admin/jobs/create")}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Post New Job
              </Button>
            </motion.div>
          )}
          
          {/* No Search Results */}
          {stats.total === 0 && input && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center 
                justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Jobs Found
              </h3>
              <p className="text-gray-500 mb-2">
                No jobs matching "{input}" were found
              </p>
              <Button 
                onClick={() => setInput("")}
                variant="link"
                className="text-blue-600"
              >
                Clear Search
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex justify-between items-center"
        >
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-gray-500 hover:text-blue-600"
            >
              Back to Top ↑
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Tip: Use filters to find specific jobs</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminJobs;