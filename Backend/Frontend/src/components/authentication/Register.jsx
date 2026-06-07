import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  CreditCard, 
  IdCard, 
  Camera,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Sparkles,
  Shield,
  CheckCircle
} from "lucide-react";

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    pancard: "",
    adharcard: "",
    file: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    if (password.match(/[$@#&!]+/)) strength += 25;
    return Math.min(strength, 100);
  };

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(input.password));
  }, [input.password]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    setFocusedField(null);
  };

  const ChangeFilehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const validateForm = () => {
    if (!input.fullname) return "Full name is required";
    if (!input.email) return "Email is required";
    if (!input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Invalid email format";
    if (!input.password) return "Password is required";
    if (!input.role) return "Please select a role";
    if (!input.phoneNumber) return "Phone number is required";
    if (!input.phoneNumber.match(/^[0-9]{10}$/)) return "Invalid phone number";
    if (!input.pancard) return "PAN card is required";
    if (!input.adharcard) return "Aadhar card is required";
    if (!input.adharcard.match()) return "Invalid Aadhar format";
    return null;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("pancard", input.pancard);
    formData.append("adharcard", input.adharcard);
    formData.append("role", input.role);
    formData.append("phoneNumber", input.phoneNumber);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response
        ? error.response.data.message
        : "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const { user } = useSelector((store) => store.auth);
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Medium";
    return "Strong";
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
        className="flex items-center justify-center max-w-7xl mx-auto px-4 py-8 relative"
      >
        <motion.form
          variants={containerVariants}
          onSubmit={submitHandler}
          className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100"
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
                <User className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-gray-800">Create </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Account
              </span>
            </h1>
            <p className="text-gray-600">
              Join thousands of professionals finding their dream jobs
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-between mb-8"
          >
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center">
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: formStep >= step ? 1 : 0.8,
                      backgroundColor: formStep >= step ? "#3B82F6" : "#E5E7EB"
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${formStep >= step ? 'text-white' : 'text-gray-500'}`}
                  >
                    {formStep > step ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </motion.div>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full
                    ${formStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </motion.div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Step 1: Basic Info */}
            <motion.div variants={itemVariants}>
              <Label className="text-gray-700 font-medium">Full Name</Label>
              <div className="relative mt-1">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${focusedField === 'fullname' ? 'text-blue-600' : 'text-gray-400'}`} 
                />
                <Input
                  type="text"
                  value={input.fullname}
                  name="fullname"
                  onChange={changeEventHandler}
                  onFocus={() => setFocusedField('fullname')}
                  onBlur={() => handleBlur('fullname')}
                  placeholder="John Doe"
                  className={`pl-10 py-6 border-2 transition-all duration-300
                    ${focusedField === 'fullname' 
                      ? 'border-blue-600 shadow-lg shadow-blue-100' 
                      : touched.fullname && !input.fullname
                        ? 'border-red-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                />
              </div>
            </motion.div>

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
                  className={`pl-10 py-6 border-2 transition-all duration-300
                    ${focusedField === 'email' 
                      ? 'border-blue-600 shadow-lg shadow-blue-100' 
                      : touched.email && !input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                        ? 'border-red-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label className="text-gray-700 font-medium">Password</Label>
              <div className="relative mt-1">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'}`} 
                />
                <Input
                  type="password"
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`pl-10 py-6 border-2 transition-all duration-300
                    ${focusedField === 'password' 
                      ? 'border-blue-600 shadow-lg shadow-blue-100' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                />
              </div>
              
              {/* Password strength meter */}
              {input.password && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                        className={`h-full ${getPasswordStrengthColor()}`}
                      />
                    </div>
                    <span className={`text-xs font-medium
                      ${passwordStrength < 50 ? 'text-red-600' : 
                        passwordStrength < 75 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use 8+ characters with mix of letters, numbers & symbols
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Step 2: Role Selection */}
            <motion.div variants={itemVariants}>
              <Label className="text-gray-700 font-medium">I want to</Label>
              <RadioGroup className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { value: "Student", label: "Find a Job", icon: GraduationCap },
                  { value: "Recruiter", label: "Hire Talent", icon: Briefcase }
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
                          <p className="text-xs text-gray-500">
                            {option.value === "Student" ? "Apply to jobs" : "Post job openings"}
                          </p>
                        </div>
                      </div>
                    </motion.label>
                  );
                })}
              </RadioGroup>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label className="text-gray-700 font-medium">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${focusedField === 'phoneNumber' ? 'text-blue-600' : 'text-gray-400'}`} 
                />
                <Input
                  type="tel"
                  value={input.phoneNumber}
                  name="phoneNumber"
                  onChange={changeEventHandler}
                  onFocus={() => setFocusedField('phoneNumber')}
                  onBlur={() => handleBlur('phoneNumber')}
                  placeholder="9876543210"
                  className={`pl-10 py-6 border-2 transition-all duration-300
                    ${focusedField === 'phoneNumber' 
                      ? 'border-blue-600 shadow-lg shadow-blue-100' 
                      : touched.phoneNumber && !input.phoneNumber.match(/^[0-9]{10}$/)
                        ? 'border-red-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                />
              </div>
            </motion.div>

            {/* Step 3: Verification Documents */}
            <motion.div variants={itemVariants}>
              <Label className="text-gray-700 font-medium">PAN Card Number</Label>
              <div className="relative mt-1">
                <CreditCard className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${focusedField === 'pancard' ? 'text-blue-600' : 'text-gray-400'}`} 
                />
                <Input
                  type="text"
                  value={input.pancard}
                  name="pancard"
                  onChange={changeEventHandler}
                  onFocus={() => setFocusedField('pancard')}
                  onBlur={() => handleBlur('pancard')}
                  placeholder="ABCDE1234F"
                  className={`pl-10 py-6 border-2 transition-all duration-300
                    ${focusedField === 'pancard' 
                      ? 'border-blue-600 shadow-lg shadow-blue-100' 
                      : touched.pancard && !input.pancard.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
                        ? 'border-red-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label className="text-gray-700 font-medium">Aadhar Card Number</Label>
              <div className="relative mt-1">
                <IdCard className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                  ${focusedField === 'adharcard' ? 'text-blue-600' : 'text-gray-400'}`} 
                />
                <Input
                  type="text"
                  value={input.adharcard}
                  name="adharcard"
                  onChange={changeEventHandler}
                  onFocus={() => setFocusedField('adharcard')}
                  onBlur={() => handleBlur('adharcard')}
                  placeholder="123456789012"
                  className={`pl-10 py-6 border-2 transition-all duration-300
                    ${focusedField === 'adharcard' 
                      ? 'border-blue-600 shadow-lg shadow-blue-100' 
                      : touched.adharcard && !input.adharcard.match(/^[0-9]{12}$/)
                        ? 'border-red-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                />
              </div>
            </motion.div>

            {/* Profile Photo */}
            <motion.div variants={itemVariants}>
              <Label className="text-gray-700 font-medium">Profile Photo</Label>
              <div className="relative mt-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={ChangeFilehandler}
                  className="cursor-pointer py-6 border-2 border-gray-200 hover:border-gray-300 
                    rounded-xl transition-all duration-300 file:mr-4 file:py-2 file:px-4 
                    file:rounded-full file:border-0 file:text-sm file:font-medium
                    file:bg-gradient-to-r file:from-blue-600 file:to-purple-600
                    file:text-white hover:file:opacity-90"
                />
                <Camera className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mt-6"
            >
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Your information is secure</p>
                <p className="text-xs text-gray-600">All documents are encrypted and protected</p>
              </div>
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
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </motion.div>

            {/* Login Link */}
            <motion.p 
              variants={itemVariants}
              className="text-center text-gray-600"
            >
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 font-semibold hover:text-blue-700 
                  transition-colors relative group"
              >
                Sign In
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 
                  group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Register;