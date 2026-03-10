import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
import { motion } from "framer-motion";
import { 
  Code2, 
  Database, 
  Cloud, 
  Shield, 
  PenTool, 
  Video, 
  BarChart,
  Cpu,
  Layout,
  Smartphone,
  Globe,
  Brain,
  Bot,
  Sparkles
} from "lucide-react";

// Category data with icons and colors
const Category = [
  { name: "Frontend Developer", icon: Layout, color: "from-blue-500 to-cyan-400", count: "2.5k" },
  { name: "Backend Developer", icon: Database, color: "from-green-500 to-emerald-400", count: "3.1k" },
  { name: "Full Stack Developer", icon: Globe, color: "from-purple-500 to-pink-400", count: "4.2k" },
  { name: "MERN Developer", icon: Code2, color: "from-orange-500 to-red-400", count: "1.8k" },
  { name: "Data Scientist", icon: BarChart, color: "from-indigo-500 to-blue-400", count: "2.9k" },
  { name: "DevOps Engineer", icon: Cloud, color: "from-cyan-500 to-teal-400", count: "2.1k" },
  { name: "ML Engineer", icon: Brain, color: "from-violet-500 to-purple-400", count: "1.5k" },
  { name: "AI Engineer", icon: Bot, color: "from-fuchsia-500 to-pink-400", count: "1.2k" },
  { name: "Cybersecurity", icon: Shield, color: "from-red-500 to-rose-400", count: "1.9k" },
  { name: "Product Manager", icon: Sparkles, color: "from-amber-500 to-yellow-400", count: "2.3k" },
  { name: "UX/UI Designer", icon: PenTool, color: "from-pink-500 to-rose-400", count: "2.7k" },
  { name: "Graphics Designer", icon: Layout, color: "from-purple-500 to-indigo-400", count: "2.0k" },
  { name: "Video Editor", icon: Video, color: "from-blue-500 to-indigo-400", count: "1.6k" },
  { name: "Mobile Developer", icon: Smartphone, color: "from-teal-500 to-cyan-400", count: "2.4k" },
];

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const searchjobHandler = (categoryName) => {
    dispatch(setSearchedQuery(categoryName));
    setSelectedCategory(categoryName);
    setTimeout(() => {
      navigate("/browse");
    }, 300);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
              text-white rounded-full text-sm font-medium shadow-lg">
              ✦ Popular Categories ✦
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-800">Browse by </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Category
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore thousands of jobs across different categories. 
            Find the perfect role that matches your skills.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center gap-8 mb-12"
        >
          {[
            { label: "Categories", value: "14+" },
            { label: "Active Jobs", value: "32.5k" },
            { label: "New Openings", value: "1.2k" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Carousel Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {Category.map((category, index) => {
                const Icon = category.icon;
                const isHovered = hoveredIndex === index;
                const isSelected = selectedCategory === category.name;

                return (
                  <CarouselItem 
                    key={index} 
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onHoverStart={() => setHoveredIndex(index)}
                      onHoverEnd={() => setHoveredIndex(null)}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="h-full"
                    >
                      <Button
                        onClick={() => searchjobHandler(category.name)}
                        variant="ghost"
                        className={`w-full h-auto p-6 rounded-2xl bg-white 
                          border-2 transition-all duration-300 relative overflow-hidden group
                          ${isSelected 
                            ? 'border-blue-500 shadow-lg shadow-blue-100' 
                            : 'border-gray-100 hover:border-blue-200 hover:shadow-xl'
                          }`}
                      >
                        {/* Animated gradient background on hover */}
                        <motion.div
                          animate={{
                            scale: isHovered ? 1.5 : 1,
                            opacity: isHovered ? 0.1 : 0,
                          }}
                          className={`absolute inset-0 bg-gradient-to-r ${category.color}`}
                        />

                        {/* Content */}
                        <div className="relative z-10 w-full">
                          {/* Icon with animated background */}
                          <motion.div
                            animate={{
                              rotate: isHovered ? [0, -10, 10, -5, 5, 0] : 0,
                            }}
                            transition={{ duration: 0.5 }}
                            className={`w-14 h-14 mx-auto mb-4 rounded-xl 
                              bg-gradient-to-r ${category.color} bg-opacity-10 
                              flex items-center justify-center
                              group-hover:shadow-lg transition-shadow duration-300`}
                          >
                            <Icon className={`w-7 h-7 text-transparent bg-clip-text 
                              bg-gradient-to-r ${category.color}`} 
                            />
                          </motion.div>

                          {/* Category name */}
                          <h3 className="font-semibold text-gray-800 mb-2 
                            group-hover:text-gray-900 transition-colors">
                            {category.name}
                          </h3>

                          {/* Job count and indicator */}
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm text-gray-500">
                              {category.count} jobs
                            </span>
                            <motion.span
                              animate={{
                                x: isHovered ? [0, 5, 0] : 0,
                              }}
                              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}
                            />
                          </div>

                          {/* Selected indicator */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2"
                            >
                              <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full 
                                  rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 
                                  bg-blue-500"></span>
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Custom navigation buttons */}
            <CarouselPrevious className="hidden md:flex -left-12 w-12 h-12 
              bg-white border-2 border-gray-200 hover:border-blue-400 
              hover:bg-blue-50 transition-all duration-300" />
            <CarouselNext className="hidden md:flex -right-12 w-12 h-12 
              bg-white border-2 border-gray-200 hover:border-blue-400 
              hover:bg-blue-50 transition-all duration-300" />
          </Carousel>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-700 font-medium 
              text-lg group"
            onClick={() => navigate("/browse")}
          >
            <span>View All Categories</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block ml-2"
            >
              →
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Categories;