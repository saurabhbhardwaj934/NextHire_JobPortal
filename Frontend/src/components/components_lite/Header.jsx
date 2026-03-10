import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Search, Sparkles, ArrowRight, Briefcase, MapPin, Award } from "lucide-react";
import { PiBuildingOfficeBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [stats, setStats] = useState({ jobs: 0, companies: 0, placements: 0 });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Simulate loading stats
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        jobs: 10000,
        companies: 500,
        placements: 8000
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const searchjobHandler = () => {
    if (query.trim()) {
      dispatch(setSearchedQuery(query));
      navigate("/browse");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchjobHandler();
    }
  };

  // Popular search suggestions
  const popularSearches = ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          {/* Badge with animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-block mb-8"
          >
            <span className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full 
              shadow-lg border border-blue-100 flex items-center gap-2 
              hover:shadow-xl transition-shadow duration-300 cursor-default">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium">No.1 Job Hunt Platform</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </span>
          </motion.div>

          {/* Main heading with staggered animation */}
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <motion.span
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
              className="block text-gray-800"
            >
              Search, Apply &
            </motion.span>
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
              className="relative inline-block mt-2"
            >
              <span className="relative">
                Get Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600
                  relative inline-block">
                  Dream Job
                  <motion.span
                    animate={{ 
                      width: ["0%", "100%", "0%"],
                      left: ["0%", "0%", "100%"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                  />
                </span>
              </span>
            </motion.div>
          </motion.h2>

          {/* Description with fade-in */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Start your journey to finding the perfect career opportunity. 
            Join thousands of successful placements from the comfort of your home.
          </motion.p>

          {/* Stats counter with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-8 md:gap-12 mb-10"
          >
            {[
              { icon: Briefcase, label: "Active Jobs", value: stats.jobs, suffix: "+" },
              { icon: PiBuildingOfficeBold, label: "Companies", value: stats.companies, suffix: "+" },
              { icon: Award, label: "Placements", value: stats.placements, suffix: "+" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="flex items-center gap-2 justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold text-gray-800"
                >
                  {stat.value.toLocaleString()}{stat.suffix}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>

          {/* Search bar with advanced interactions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
            className="relative max-w-2xl mx-auto"
          >
            <motion.div
              animate={{ 
                scale: isFocused ? 1.02 : 1,
                boxShadow: isFocused 
                  ? "0 20px 40px -15px rgba(59, 130, 246, 0.3)" 
                  : "0 10px 30px -15px rgba(0, 0, 0, 0.1)"
              }}
              className="relative flex items-center bg-white rounded-2xl 
                border-2 transition-colors duration-300
                focus-within:border-blue-400"
            >
              <div className="flex-1 flex items-center px-6">
                <Search className={`w-5 h-5 transition-colors duration-300 
                  ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} 
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyPress={handleKeyPress}
                  placeholder="Try 'Software Engineer', 'Product Manager'..."
                  className="w-full py-5 px-4 outline-none bg-transparent 
                    placeholder:text-gray-400 text-gray-700"
                />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pr-2"
              >
                <Button 
                  onClick={searchjobHandler}
                  disabled={!query.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 
                    hover:from-blue-700 hover:to-purple-700 text-white px-8 py-5 
                    rounded-xl transition-all duration-300 disabled:opacity-50 
                    disabled:cursor-not-allowed flex items-center gap-2 group"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Popular searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-2 mt-4"
            >
              <span className="text-sm text-gray-500">Popular:</span>
              {popularSearches.map((search, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setQuery(search);
                    dispatch(setSearchedQuery(search));
                    navigate("/browse");
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 
                    text-gray-700 rounded-full transition-all duration-200
                    hover:shadow-md"
                >
                  {search}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-6 mt-12 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>10k+ Jobs Posted Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>500+ Top Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>95% Success Rate</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;