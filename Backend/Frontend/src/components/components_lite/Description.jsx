import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  Users, 
  Clock,
  Building2,
  Share2,
  Bookmark,
  CheckCircle,
  ArrowLeft,
  TrendingUp,
  Award,
  Shield,
  Sparkles
} from "lucide-react";
import Navbar from "./Navbar";

const Description = () => {
  const params = useParams();
  const jobId = params.id;

  const navigate = useNavigate();
  const location = useLocation();

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Apply Function
  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);

        const updateSingleJob = {
          ...singleJob,
          applications: [
            ...(singleJob.applications || []),
            { applicant: user?._id },
          ],
        };

        dispatch(setSingleJob(updateSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error applying for job");
    } finally {
      setIsSaving(false);
    }
  };

  // Save Job Function
  const saveJobHandler = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Job saved to your profile");
      setIsSaving(false);
    }, 500);
  };

  // Share Job Function
  const shareJobHandler = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsShared(true);
    toast.success("Job link copied to clipboard!");
    setTimeout(() => setIsShared(false), 2000);
  };

  // Fetch Job
  useEffect(() => {
    const fetchSingleJobs = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.status) {
          dispatch(setSingleJob(res.data.job));

          setIsApplied(
            res.data.job.applications?.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSingleJobs();
  }, [jobId, dispatch, user?._id]);

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

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!singleJob) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Job Not Found</h2>
            <p className="text-gray-500 mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/jobs")} className="bg-blue-600 hover:bg-blue-700">
              Browse Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 
            transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Jobs</span>
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            {/* Header Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 
                      rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {singleJob?.title}
                      </h1>
                      <p className="text-gray-600">{singleJob?.company?.name}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 
                      transition-colors px-3 py-1">
                      {singleJob?.position} Positions
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 
                      transition-colors px-3 py-1">
                      {singleJob?.salary} LPA
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 
                      transition-colors px-3 py-1">
                      {singleJob?.location}
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 
                      transition-colors px-3 py-1">
                      {singleJob?.jobType}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* Save Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveJobHandler}
                    disabled={isSaving}
                    className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-600 
                      hover:bg-blue-50 transition-all duration-300 group"
                  >
                    <Bookmark className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  </motion.button>

                  {/* Share Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareJobHandler}
                    className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-600 
                      hover:bg-blue-50 transition-all duration-300 group relative"
                  >
                    <Share2 className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                    <AnimatePresence>
                      {isShared && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                            bg-green-500 text-white text-xs py-1 px-2 rounded whitespace-nowrap"
                        >
                          Copied!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex gap-2 border-b border-gray-200">
                {[
                  { id: "details", label: "Job Details", icon: Briefcase },
                  { id: "company", label: "Company Info", icon: Building2 },
                  { id: "benefits", label: "Benefits", icon: Award }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium 
                        transition-all duration-300 relative
                        ${isActive 
                          ? 'text-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <AnimatePresence mode="wait">
                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Description */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        Job Description
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {singleJob?.description}
                      </p>
                    </div>

                    {/* Requirements */}
                    {singleJob?.requirements && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">
                          Requirements
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          {singleJob.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Responsibilities */}
                    {singleJob?.responsibilities && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">
                          Key Responsibilities
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          {singleJob.responsibilities.map((resp, index) => (
                            <li key={index}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "company" && (
                  <motion.div
                    key="company"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 
                        rounded-xl flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {singleJob?.company?.name}
                        </h2>
                        <p className="text-gray-500">{singleJob?.company?.industry}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">Location</p>
                          <p className="text-sm text-gray-500">{singleJob?.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">Company Size</p>
                          <p className="text-sm text-gray-500">{singleJob?.company?.size || "50-200"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">Founded</p>
                          <p className="text-sm text-gray-500">{singleJob?.company?.founded || "2015"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">Industry</p>
                          <p className="text-sm text-gray-500">{singleJob?.company?.industry || "Technology"}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">About the Company</h3>
                      <p className="text-gray-600">
                        {singleJob?.company?.description || "A leading company in the industry, dedicated to innovation and excellence."}
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "benefits" && (
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "Competitive Salary Package",
                        "Health Insurance",
                        "Flexible Working Hours",
                        "Remote Work Options",
                        "Professional Development",
                        "Performance Bonuses",
                        "Paid Time Off",
                        "Team Building Events"
                      ].map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Apply Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Ready to Apply?</h2>
              
              <Button
                onClick={applyJobHandler}
                disabled={isApplied || isSaving}
                className={`w-full py-6 text-lg font-semibold rounded-xl 
                  transition-all duration-300 relative overflow-hidden group
                  ${isApplied 
                    ? 'bg-green-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
                  }`}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : isApplied ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Successfully Applied</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Apply Now</span>
                    <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  <Users className="w-3 h-3 inline mr-1" />
                  {singleJob?.applications?.length || 0} candidates have applied
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-medium text-gray-700">Secure Application</p>
                </div>
                <p className="text-xs text-gray-500">
                  Your information is encrypted and securely transmitted.
                </p>
              </div>
            </motion.div>

            {/* Job Overview Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Overview</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium text-gray-800">
                    {singleJob?.experienceLevel || "0-2"} Years
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Job Type</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {singleJob?.jobType}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Salary Range</span>
                  <span className="font-medium text-gray-800">
                    {singleJob?.salary} LPA
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Posted Date</span>
                  <span className="font-medium text-gray-800">
                    {new Date(singleJob?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Open Positions</span>
                  <span className="font-medium text-gray-800">
                    {singleJob?.position}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Description;