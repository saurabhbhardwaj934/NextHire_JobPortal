import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/usegetAllCompanies";
import { useDispatch, useSelector } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companyslice";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Search, 
  Plus, 
  Filter, 
  Briefcase,
  Users,
  TrendingUp,
  Sparkles,
  X,
  ArrowRight
} from "lucide-react";
import { Badge } from "../ui/badge";

const Companies = () => {
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  // Calculate company stats
  const stats = {
    total: companies?.length || 0,
    active: companies?.filter(c => c.isActive !== false).length || 0,
    hiring: companies?.filter(c => c.jobs?.length > 0).length || 0,
    industries: [...new Set(companies?.map(c => c.industry))].length || 0
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
                <Building2 className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  <span className="text-gray-800">Company </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Management
                  </span>
                </h1>
              </div>
              <p className="text-gray-600">
                Manage your companies, track applications, and find the best talent
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate("/admin/companies/create")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-700 hover:to-purple-700 text-white 
                  shadow-lg hover:shadow-xl transition-all duration-300 
                  flex items-center gap-2 px-6 py-3 text-lg"
              >
                <Plus className="w-5 h-5" />
                Add New Company
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
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {[
                { 
                  icon: Building2, 
                  label: "Total Companies", 
                  value: stats.total,
                  color: "blue",
                  gradient: "from-blue-500 to-blue-600"
                },
                { 
                  icon: Briefcase, 
                  label: "Active Companies", 
                  value: stats.active,
                  color: "green",
                  gradient: "from-green-500 to-emerald-600"
                },
                { 
                  icon: Users, 
                  label: "Currently Hiring", 
                  value: stats.hiring,
                  color: "purple",
                  gradient: "from-purple-500 to-pink-600"
                },
                { 
                  icon: TrendingUp, 
                  label: "Industries", 
                  value: stats.industries,
                  color: "orange",
                  gradient: "from-orange-500 to-red-600"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md p-4 border border-gray-100 
                    hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.value / Math.max(...Object.values(stats))) * 100}%` }}
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
                placeholder="Search companies by name..."
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
                {stats.total} companies available
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Companies Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-800">Companies List</h2>
              </div>
              <Badge variant="outline" className="text-blue-600">
                {stats.total} Companies
              </Badge>
            </div>
          </div>
          
          <CompaniesTable />
          
          {/* Empty State (if no companies) */}
          {stats.total === 0 && !input && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center 
                justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Companies Yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start by adding your first company
              </p>
              <Button 
                onClick={() => navigate("/admin/companies/create")}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Company
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
                No Companies Found
              </h3>
              <p className="text-gray-500 mb-2">
                No companies matching "{input}" were found
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
          className="mt-6 flex justify-end"
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
        </motion.div>
      </div>
    </div>
  );
};

export default Companies;