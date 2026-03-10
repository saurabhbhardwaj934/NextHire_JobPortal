import React, { useState, useEffect } from "react";
import JobCards from "./JobCards";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Building2, 
  Sparkles,
  ArrowRight,
  Filter
} from "lucide-react";
import { Button } from "../ui/button";

const LatestJobs = () => {
  const allJobs = useSelector((state) => state.jobs?.allJobs || []);
  const [visibleJobs, setVisibleJobs] = useState(6);
  const [filter, setFilter] = useState("latest");
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredJob, setHoveredJob] = useState(null);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter options
  const filters = [
    { id: "latest", label: "Latest", icon: Clock },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "remote", label: "Remote", icon: MapPin },
    { id: "fulltime", label: "Full Time", icon: Briefcase },
  ];

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

  const loadMore = () => {
    setVisibleJobs(prev => Math.min(prev + 3, allJobs.length));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto my-20 px-4 relative"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20"
        />
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center md:text-left md:flex md:items-end md:justify-between mb-12"
      >
        <div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 
              text-purple-700 rounded-full text-sm font-medium inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Discover Your Next Opportunity
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-800">Latest & Top </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Job Openings
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl">
            Explore thousands of job opportunities tailored to your skills. 
            Your dream career starts here.
          </p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-6 mt-6 md:mt-0"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{allJobs.length}+</div>
            <div className="text-sm text-gray-500">Total Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">24</div>
            <div className="text-sm text-gray-500">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">1.5k</div>
            <div className="text-sm text-gray-500">Applicants</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filter Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-400" />
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = filter === f.id;
            
            return (
              <motion.button
                key={f.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium 
                  transition-all duration-200 flex items-center gap-2 whitespace-nowrap
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {f.label}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            className="border-2 border-purple-200 text-purple-600 
              hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
          >
            View All Jobs
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Job Cards Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <motion.div
                key={n}
                variants={itemVariants}
                className="h-64 bg-gradient-to-r from-gray-100 to-gray-200 
                  rounded-2xl animate-pulse"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {allJobs.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="col-span-full text-center py-20"
              >
                <div className="bg-gray-50 rounded-2xl p-12 inline-block">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Jobs Available
                  </h3>
                  <p className="text-gray-500">
                    Check back later for new opportunities
                  </p>
                </div>
              </motion.div>
            ) : (
              allJobs
                .slice(0, visibleJobs)
                .map((job, index) => 
                  job?._id ? (
                    <motion.div
                      key={job._id}
                      variants={itemVariants}
                      onHoverStart={() => setHoveredJob(job._id)}
                      onHoverEnd={() => setHoveredJob(null)}
                      className="relative group"
                    >
                      {/* Hover effect background */}
                      <motion.div
                        animate={{
                          scale: hoveredJob === job._id ? 1.02 : 1,
                          opacity: hoveredJob === job._id ? 1 : 0,
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 
                          rounded-2xl -m-2 p-2 pointer-events-none"
                      />
                      
                      <JobCards job={job} />
                    </motion.div>
                  ) : null
                )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load More Button */}
      {visibleJobs < allJobs.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMore}
            className="px-8 py-3 bg-white border-2 border-gray-200 
              hover:border-purple-300 rounded-full text-gray-700 
              hover:text-purple-600 font-medium transition-all duration-300 
              shadow-sm hover:shadow-md inline-flex items-center gap-2 group"
          >
            <span>Load More Jobs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      )}

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap items-center justify-center gap-8 mt-16 
          pt-8 border-t border-gray-100"
      >
        {[
          "✓ Verified Companies",
          "✓ No Application Fee",
          "✓ Quick Apply",
          "✓ 24/7 Support",
        ].map((text, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 text-sm text-gray-500"
          >
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            {text}
          </motion.div>
        ))}
      </motion.div>

      {/* Floating notification for new jobs */}
      <AnimatePresence>
        {allJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 
              to-blue-600 text-white px-4 py-3 rounded-lg shadow-lg 
              flex items-center gap-3 z-50"
          >
            <Sparkles className="w-5 h-5" />
            <div>
              <p className="text-sm font-medium">New jobs added!</p>
              <p className="text-xs opacity-90">{allJobs.length} opportunities available</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LatestJobs;