import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FilterCard from "./Filtercard";
import Job1 from "./Job1";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Search, 
  Filter, 
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  Sparkles,
  Clock,
  TrendingUp,
  MapPin,
  DollarSign
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [searchTerm, setSearchTerm] = useState(searchedQuery || "");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    newJobs: 0,
    locations: 0,
    companies: 0
  });

  // Filter state
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: "",
    salary: "",
    remote: false
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    if (!allJobs) return;

    let filtered = [...allJobs];
    const activeFilterList = [];

    // Apply search query
    if (searchTerm.trim()) {
      filtered = filtered.filter((job) => {
        const query = searchTerm.toLowerCase();
        return (
          job.title?.toLowerCase().includes(query) ||
          job.description?.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query) ||
          job.company?.name?.toLowerCase().includes(query)
        );
      });
      activeFilterList.push({ type: "search", value: searchTerm });
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
      activeFilterList.push({ type: "location", value: filters.location });
    }

    // Apply job type filter
    if (filters.jobType) {
      filtered = filtered.filter(job => 
        job.jobType === filters.jobType
      );
      activeFilterList.push({ type: "type", value: filters.jobType });
    }

    // Apply experience filter
    if (filters.experience) {
      const [min, max] = filters.experience.split("-").map(Number);
      filtered = filtered.filter(job => {
        const exp = job.experience || 0;
        if (max) {
          return exp >= min && exp <= max;
        }
        return exp >= min;
      });
      activeFilterList.push({ type: "experience", value: filters.experience + " years" });
    }

    // Apply salary filter
    if (filters.salary) {
      const minSalary = parseInt(filters.salary);
      filtered = filtered.filter(job => (job.salary || 0) >= minSalary);
      activeFilterList.push({ type: "salary", value: `$${filters.salary}k+` });
    }

    // Apply remote filter
    if (filters.remote) {
      filtered = filtered.filter(job => job.remote === true);
      activeFilterList.push({ type: "remote", value: "Remote" });
    }

    // Apply sorting
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "salary-high") {
      filtered.sort((a, b) => (b.salary || 0) - (a.salary || 0));
    } else if (sortBy === "salary-low") {
      filtered.sort((a, b) => (a.salary || 0) - (b.salary || 0));
    }

    setFilterJobs(filtered);
    setActiveFilters(activeFilterList);

    // Update stats
    setStats({
      totalJobs: filtered.length,
      newJobs: filtered.filter(job => {
        const daysOld = (new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24);
        return daysOld <= 7;
      }).length,
      locations: [...new Set(filtered.map(job => job.location))].length,
      companies: [...new Set(filtered.map(job => job.company?.name))].length
    });
  }, [allJobs, searchTerm, filters, sortBy]);

  const clearFilter = (filterType) => {
    if (filterType === "search") {
      setSearchTerm("");
    } else if (filterType === "location") {
      setFilters({ ...filters, location: "" });
    } else if (filterType === "type") {
      setFilters({ ...filters, jobType: "" });
    } else if (filterType === "experience") {
      setFilters({ ...filters, experience: "" });
    } else if (filterType === "salary") {
      setFilters({ ...filters, salary: "" });
    } else if (filterType === "remote") {
      setFilters({ ...filters, remote: false });
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      location: "",
      jobType: "",
      experience: "",
      salary: "",
      remote: false
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="text-gray-800">Find Your </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Dream Job
                </span>
              </h1>
              <p className="text-gray-600">
                {loading ? "Loading..." : `${filterJobs.length} jobs available`}
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-lg border p-1 shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : ""}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : ""}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilters.length > 0 && (
                  <Badge className="ml-1 bg-blue-600 text-white">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search jobs by title, company, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 text-lg border-2 border-gray-200 focus:border-blue-600 
                rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 
                  p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {[
            { icon: Briefcase, label: "Total Jobs", value: stats.totalJobs, color: "blue" },
            { icon: Clock, label: "New This Week", value: stats.newJobs, color: "green" },
            { icon: MapPin, label: "Locations", value: stats.locations, color: "purple" },
            { icon: TrendingUp, label: "Companies", value: stats.companies, color: "orange" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 
                hover:shadow-md transition-all duration-300"
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
            </motion.div>
          ))}
        </motion.div>

        {/* Active Filters */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              <span className="text-sm text-gray-500">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 flex items-center gap-1 bg-blue-50 text-blue-700 
                    hover:bg-blue-100 transition-colors cursor-pointer"
                  onClick={() => clearFilter(filter.type)}
                >
                  {filter.type}: {filter.value}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-80"
              >
                <FilterCard 
                  filters={filters}
                  setFilters={setFilters}
                  onClose={() => setShowFilters(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Jobs Grid */}
          <motion.div 
            className={`flex-1 ${showFilters ? '' : 'w-full'}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-700">{filterJobs.length}</span> jobs
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm 
                  focus:outline-none focus:border-blue-600 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-64 bg-gradient-to-r from-gray-100 to-gray-200 
                    rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filterJobs.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="text-center py-20"
              >
                <div className="bg-white rounded-2xl p-12 inline-block shadow-sm">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center 
                    justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={clearAllFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                <AnimatePresence>
                  {filterJobs.map((job) => (
                    <motion.div
                      key={job._id}
                      variants={itemVariants}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -4 }}
                      className="h-full"
                    >
                      <Job1 job={job} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;