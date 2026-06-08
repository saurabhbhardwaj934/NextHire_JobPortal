import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar.jsx";
import { Button } from "../ui/button.jsx";
import { ArrowLeft, Loader2, Building2, Globe, MapPin, FileText, Upload, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Label } from "../ui/label.jsx";
import { Input } from "../ui/input.jsx";
import { Textarea } from "../ui/textarea.jsx";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "../../utils/data.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById.jsx";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge.jsx";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Company name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        if (value.length > 100) return "Name must be less than 100 characters";
        return "";
      case "description":
        if (!value.trim()) return "Description is required";
        if (value.length < 20) return "Description must be at least 20 characters";
        if (value.length > 500) return "Description must be less than 500 characters";
        return "";
      case "website":
        if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
          return "Please enter a valid URL";
        }
        return "";
      case "location":
        if (!value.trim()) return "Location is required";
        return "";
      default:
        return "";
    }
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    setIsDirty(true);
    
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setInput({ ...input, file });
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Clear file error if exists
      setErrors({ ...errors, file: "" });
    } else if (file) {
      setErrors({ ...errors, file: "Please upload a valid image file" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.name = validateField("name", input.name);
    newErrors.description = validateField("description", input.description);
    newErrors.location = validateField("location", input.location);
    if (input.website) {
      newErrors.website = validateField("website", input.website);
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }
    
    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_ENDPOINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      
      if (res.status === 200 && res.data.message) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/admin/companies");
        }, 500);
      } else {
        throw new Error("Unexpected API response.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
      if (singleCompany.logo) {
        setPreviewUrl(singleCompany.logo);
      }
    }
  }, [singleCompany]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 
                hover:border-blue-600 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Companies</span>
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Company Setup</h1>
                <p className="text-white/80 text-sm mt-1">
                  Update your company information and branding
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="p-6">
            <div className="space-y-6">
              {/* Company Logo Section */}
              <motion.div variants={itemVariants} className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 
                    flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Company logo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 cursor-pointer">
                    <div className="bg-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={changeFileHandler}
                      className="hidden"
                    />
                  </label>
                </div>
              </motion.div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    Company Name *
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={changeEventHandler}
                    placeholder="Enter company name"
                    className={`border-2 transition-all duration-300 focus:border-blue-600
                      ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </motion.div>

                {/* Location */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Location *
                  </Label>
                  <Input
                    type="text"
                    name="location"
                    value={input.location}
                    onChange={changeEventHandler}
                    placeholder="City, Country"
                    className={`border-2 transition-all duration-300 focus:border-blue-600
                      ${errors.location ? 'border-red-500 focus:border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.location && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.location}
                    </p>
                  )}
                </motion.div>

                {/* Website */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Website
                  </Label>
                  <Input
                    type="url"
                    name="website"
                    value={input.website}
                    onChange={changeEventHandler}
                    placeholder="https://example.com"
                    className={`border-2 transition-all duration-300 focus:border-blue-600
                      ${errors.website ? 'border-red-500 focus:border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.website && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.website}
                    </p>
                  )}
                  {input.website && !errors.website && (
                    <a 
                      href={input.website.startsWith('http') ? input.website : `https://${input.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Test link
                    </a>
                  )}
                </motion.div>

                {/* Logo Upload Status */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Company Logo
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 
                    hover:border-blue-400 transition-all duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={changeFileHandler}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {input.file ? input.file.name : "Click to upload logo"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, JPEG up to 2MB
                      </p>
                    </label>
                  </div>
                  {errors.file && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.file}
                    </p>
                  )}
                </motion.div>

                {/* Description - Full Width */}
                <motion.div variants={itemVariants} className="md:col-span-2 space-y-2">
                  <Label className="text-gray-700 font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Company Description *
                  </Label>
                  <Textarea
                    name="description"
                    value={input.description}
                    onChange={changeEventHandler}
                    placeholder="Tell us about your company, mission, values, and what makes it special..."
                    rows={5}
                    className={`border-2 transition-all duration-300 focus:border-blue-600 resize-none
                      ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Minimum 20 characters
                    </p>
                    <span className={`text-xs ${input.description.length > 0 ? 'text-gray-500' : 'text-gray-400'}`}>
                      {input.description.length}/500 characters
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Tips Section */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4"
              >
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Tips for a Great Company Profile
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Add a professional logo to build trust</li>
                  <li>• Write a compelling description that attracts talent</li>
                  <li>• Include your company website for more information</li>
                  <li>• Specify accurate location for job seekers</li>
                </ul>
              </motion.div>

              {/* Form Actions */}
              <motion.div 
                variants={itemVariants}
                className="flex gap-4 pt-4"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/companies")}
                  disabled={loading}
                  className="flex-1 py-6 border-2 border-gray-200 hover:border-gray-300 
                    hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-6 bg-gradient-to-r from-blue-600 to-purple-600 
                    hover:from-blue-700 hover:to-purple-700 text-white
                    transition-all duration-300 shadow-md hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating Company...
                    </>
                  ) : (
                    <>
                      Update Company
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>

        {/* Preview Card (Optional) */}
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview</h3>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-800">{input.name || "Company Name"}</p>
                <p className="text-sm text-gray-500">{input.location || "Location"}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompanySetup;