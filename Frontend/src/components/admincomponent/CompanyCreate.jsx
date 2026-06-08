import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { COMPANY_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companyslice";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Building2, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Briefcase,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Badge } from "../ui/badge";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();

  const validateCompanyName = (name) => {
    if (!name.trim()) return "Company name is required";
    if (name.length < 2) return "Company name must be at least 2 characters";
    if (name.length > 50) return "Company name must be less than 50 characters";
    if (!/^[a-zA-Z0-9\s&.-]+$/.test(name)) return "Company name can only contain letters, numbers, spaces, and &.-";
    return null;
  };

  const registerNewCompany = async () => {
    const validationError = validateCompanyName(companyName);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const res = await axios.post(
        `${COMPANY_API_ENDPOINT}/register`,
        { companyName: companyName.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        setTimeout(() => {
          navigate(`/admin/companies/${companyId}`);
        }, 500);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Failed to create company. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      registerNewCompany();
    }
  };

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

  // Company name suggestions
  const suggestions = [
    "Tech Innovations Inc.",
    "Creative Solutions Ltd.",
    "Global Enterprises",
    "Future Technologies",
    "Digital Dynamics"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
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
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-800">Create Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Company
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Start your journey by creating a company profile. This will help you
            post jobs and find the best talent for your organization.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {/* Form Section */}
          <div className="space-y-8">
            {/* Company Name Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label className="text-gray-700 font-semibold text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Company Name
              </Label>
              <p className="text-sm text-gray-500 mb-2">
                This will be the public name of your company that job seekers will see
              </p>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g., Tech Innovations Inc."
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (error) setError("");
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyPress={handleKeyPress}
                  className={`py-6 pl-12 text-lg border-2 transition-all duration-300
                    ${isFocused 
                      ? 'border-blue-600 shadow-lg shadow-blue-100' 
                      : error 
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  autoFocus
                />
                <Building2 className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 
                  transition-colors duration-300 ${isFocused ? 'text-blue-600' : 'text-gray-400'}`} 
                />
                {companyName && !error && (
                  <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {error && (
                  <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>
              
              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </motion.p>
              )}
              
              {/* Character Counter */}
              <div className="flex justify-end">
                <span className={`text-xs ${companyName.length > 0 ? 'text-gray-500' : 'text-gray-400'}`}>
                  {companyName.length}/50 characters
                </span>
              </div>
            </motion.div>

            {/* Name Suggestions */}
            <motion.div variants={itemVariants}>
              <Label className="text-gray-700 font-medium text-sm">Suggestions</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCompanyName(suggestion);
                      setError("");
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-blue-100 
                      text-gray-700 hover:text-blue-700 rounded-full 
                      transition-all duration-200"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Tips Section */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4"
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Pro Tips for Company Name
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Keep it professional and memorable
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Use your brand's official name
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Avoid special characters if possible
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Make it easy to search and remember
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                variant="outline"
                onClick={() => navigate("/admin/companies")}
                disabled={isLoading}
                className="flex-1 py-6 text-lg border-2 border-gray-200 
                  hover:border-gray-300 hover:bg-gray-50 
                  transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Cancel
              </Button>
              
              <Button
                onClick={registerNewCompany}
                disabled={isLoading || !companyName.trim()}
                className="flex-1 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 
                  hover:from-blue-700 hover:to-purple-700 text-white
                  transition-all duration-300 shadow-md hover:shadow-lg
                  disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Company...
                  </>
                ) : (
                  <>
                    Continue to Setup
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>

            {/* Info Message */}
            <motion.div 
              variants={itemVariants}
              className="text-center text-sm text-gray-500 pt-4"
            >
              <p>You can always edit your company details later</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: Briefcase, title: "Post Jobs", desc: "Share opportunities with thousands of job seekers" },
            { icon: Users, title: "Find Talent", desc: "Discover qualified candidates for your positions" },
            { icon: TrendingUp, title: "Grow Business", desc: "Build your brand and attract top talent" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl 
                flex items-center justify-center mx-auto mb-3">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyCreate;