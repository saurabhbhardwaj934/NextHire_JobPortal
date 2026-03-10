import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { RadioGroup } from "../ui/radio-group";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  LogIn, 
  Briefcase, 
  GraduationCap,
  Sparkles,
  Shield,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle
} from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "", 
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    setFocusedField(null);
  };

  const validateForm = () => {
    if (!input.email) return "Email is required";
    if (!input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Invalid email format";
    if (!input.password) return "Password is required";
    
    if (!input.role) return "Please select a role";
    return null;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-20"
        />
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex items-center justify-center min-h-[calc(100vh-64px)] max-w-7xl mx-auto px-4 py-8 relative"
      >
        <motion.form
          variants={containerVariants}
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {/* Header with icon */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-gray-800">Welcome </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Back
              </span>
            </h1>
            <p className="text-gray-600">
              Sign in to continue your job search journey
            </p>
          </motion.div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <Label className="text-gray-700 font-medium">Email Address</Label>
              <div className="relative mt-1">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${focusedField === 'email' ? 'text-blue-600' : 'text-gray-400'}`} 
                />
                <Input
                  type="email"
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => handleBlur('email')}
                  placeholder="john@example.com"
                  className={`pl-10 py-6 border-2 transition-all duration-300 rounded-xl
                    ${focusedField === 'email' 
                      ? 'border-blue-600 shadow-lg shadow-blue-100' 
                      : touched.email && !input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                        ? 'border-red-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                />
                {touched.email && input.email && input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <Label className="text-gray-700 font-medium">Password</Label>
              <div className="relative mt-1">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'}`} 
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`pl-10 py-6 border-2 transition-all duration-300 rounded-xl pr-12
                    ${focusedField === 'password' 
                      ? 'border-blue-600 shadow-lg shadow-blue-100' 
                      : touched.password && input.password.length < 6
                        ? 'border-red-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && input.password.length < 6 && input.password.length > 0 && (
                <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>
              )}
            </motion.div>

            {/* Role Selection */}
            <motion.div variants={itemVariants}>
              <Label className="text-gray-700 font-medium">Login as</Label>
              <RadioGroup className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { value: "Student", label: "Student", icon: GraduationCap, desc: "Find jobs" },
                  { value: "Recruiter", label: "Recruiter", icon: Briefcase, desc: "Hire talent" }
                ].map((option) => {
                  const Icon = option.icon;
                  const isSelected = input.role === option.value;
                  
                  return (
                    <motion.label
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300
                        ${isSelected 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <Input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={isSelected}
                        onChange={changeEventHandler}
                        className="absolute opacity-0"
                      />
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg
                          ${isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-600'
                          }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-medium ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                            {option.label}
                          </p>
                          <p className="text-xs text-gray-500">{option.desc}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="ml-auto w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </motion.label>
                  );
                })}
              </RadioGroup>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium 
                  transition-colors relative group"
              >
                Forgot Password?
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 
                  group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>

            {/* Security indicator */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
            >
              <Shield className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-gray-600">
                Your session is protected with industry-standard security
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                    text-white font-semibold rounded-xl shadow-lg 
                    hover:shadow-xl transition-all duration-300 
                    flex items-center justify-center gap-2 group"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </motion.div>

            {/* Register Link */}
            <motion.div 
              variants={itemVariants}
              className="text-center space-y-4"
            >
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-blue-600 font-semibold hover:text-blue-700 
                    transition-colors relative group"
                >
                  Create Account
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 
                    group-hover:w-full transition-all duration-300" />
                </Link>
              </p>

              {/* Alternative registration CTA */}
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 border-2 border-green-500 text-green-600 
                    font-medium rounded-xl hover:bg-green-50 transition-all duration-300 
                    flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>New here? Register now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Demo credentials hint */}
            <motion.p 
              variants={itemVariants}
              className="text-center text-xs text-gray-400"
            >
              Demo: student@example.com / recruiter@example.com (password: demo123)
            </motion.p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;