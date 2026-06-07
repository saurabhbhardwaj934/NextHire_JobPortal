import React, { useState } from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { 
  Contact, 
  Mail, 
  Pen, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Award,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  Edit2,
  Eye,
  Users,
  TrendingUp,
  Clock
} from "lucide-react";
import { Badge } from "../ui/badge";
import AppliedJob from "./AppliedJob";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAllAppliedJobs";
import { motion } from "framer-motion";
import { Progress } from "../ui/progress";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useSelector((store) => store.auth);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.fullname) return "U";
    return user.fullname.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0;
    if (user?.fullname) completed += 20;
    if (user?.email) completed += 20;
    if (user?.phoneNumber) completed += 20;
    if (user?.profile?.bio) completed += 20;
    if (user?.profile?.skills?.length > 0) completed += 20;
    return completed;
  };

  const profileCompletion = calculateProfileCompletion();

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
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              {/* Profile Header */}
              <div className="relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xl">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <button 
                      onClick={() => setOpen(true)}
                      className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1.5 
                        shadow-lg hover:bg-blue-700 transition-all duration-300"
                    >
                      <Pen className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-16 text-center">
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    {user?.fullname}
                  </h1>
                  <p className="text-gray-500 text-sm">
                    {user?.profile?.bio || "No bio added yet"}
                  </p>
                  <Badge className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {user?.role}
                  </Badge>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${user?.email}`} className="text-sm hover:underline">
                      {user?.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                    <Contact className="w-4 h-4" />
                    <a href={`tel:${user?.phoneNumber}`} className="text-sm hover:underline">
                      {user?.phoneNumber || "Not added"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">Profile Completion</h3>
                  <span className="text-xs font-medium text-blue-600">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
                {profileCompletion < 100 && (
                  <button 
                    onClick={() => setOpen(true)}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Complete your profile
                  </button>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
            >
              <h3 className="text-sm font-semibold mb-4 opacity-90">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">Applications Sent</span>
                  </div>
                  <span className="text-2xl font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Profile Views</span>
                  </div>
                  <span className="text-2xl font-bold">245</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Interview Invites</span>
                  </div>
                  <span className="text-2xl font-bold">3</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="flex border-b border-gray-100">
                {[
                  { id: "overview", label: "Overview", icon: Briefcase },
                  { id: "skills", label: "Skills", icon: Award },
                  { id: "applications", label: "Applications", icon: Users }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium 
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
                          layoutId="profileTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Bio */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {user?.profile?.bio || "No bio added yet. Tell employers about yourself!"}
                      </p>
                    </div>

                    {/* Resume */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Resume</h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 
                            rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {user?.profile?.resumeOriginalName || "No resume uploaded"}
                            </p>
                            <p className="text-xs text-gray-500">PDF/DOCX format</p>
                          </div>
                        </div>
                        {user?.profile?.resume && (
                          <a
                            href={user?.profile?.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 
                              hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Additional Information</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Member Since</p>
                            <p className="text-sm font-medium text-gray-700">
                              {new Date(user?.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm font-medium text-gray-700">
                              {user?.profile?.location || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "skills" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-700">Technical Skills</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setOpen(true)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {user?.profile?.skills?.length > 0 ? (
                        user?.profile?.skills.map((skill, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Badge className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 
                              text-gray-700 hover:from-blue-100 hover:to-purple-100 transition-all 
                              duration-300 cursor-default text-sm">
                              {skill}
                            </Badge>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 w-full">
                          <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No skills added yet</p>
                          <Button 
                            onClick={() => setOpen(true)}
                            variant="outline" 
                            size="sm"
                            className="mt-2"
                          >
                            Add Skills
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Skill Recommendations */}
                    {user?.profile?.skills?.length > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Recommended Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {["React", "Node.js", "Python", "AWS", "TypeScript"].map((skill, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="bg-white cursor-pointer hover:bg-blue-100 transition-colors"
                            >
                              + {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "applications" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700">Application History</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Track your job applications and their status
                      </p>
                    </div>
                    <AppliedJob />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;