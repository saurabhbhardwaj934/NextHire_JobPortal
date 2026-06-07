import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { 
  Edit2, 
  Eye, 
  MoreHorizontal, 
  Users, 
  Calendar,
  Briefcase,
  Building2,
  CheckCircle,
  Clock,
  TrendingUp,
  Trash2,
  ExternalLink
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const AdminJobsTable = () => {
  const { companies } = useSelector((store) => store.company);
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const filteredJobs =
      allAdminJobs.length >= 0 &&
      allAdminJobs.filter((job) => {
        if (!searchJobByText) {
          return true;
        }
        return (
          job.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
          job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
          job?.location?.toLowerCase().includes(searchJobByText.toLowerCase())
        );
      });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  // Format date with relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get job status badge
  const getJobStatusBadge = (job) => {
    const daysOld = (new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24);
    
    if (job.isActive === false) {
      return { label: "Closed", color: "bg-red-100 text-red-700", icon: XCircle };
    } else if (daysOld <= 7) {
      return { label: "New", color: "bg-green-100 text-green-700", icon: TrendingUp };
    } else if (daysOld <= 30) {
      return { label: "Active", color: "bg-blue-100 text-blue-700", icon: CheckCircle };
    } else {
      return { label: "Expiring", color: "bg-yellow-100 text-yellow-700", icon: Clock };
    }
  };

  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: {
      scale: 1.01,
      backgroundColor: "rgba(59, 130, 246, 0.02)",
      transition: { duration: 0.2 }
    }
  };

  if (!companies || !allAdminJobs) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="text-gray-500">
          {filterJobs.length === 0 
            ? "No jobs posted yet" 
            : `Showing ${filterJobs.length} of ${allAdminJobs.length} jobs`
          }
        </TableCaption>
        
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Company
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Job Title
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Applicants
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Posted Date
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">Status</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence mode="wait">
            {filterJobs.length === 0 ? (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td colSpan="6" className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Briefcase className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No Jobs Found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchJobByText 
                        ? `No jobs matching "${searchJobByText}"` 
                        : "Start by posting your first job"
                      }
                    </p>
                    {searchJobByText && (
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()}
                        className="text-blue-600"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                 </td>
              </motion.tr>
            ) : (
              filterJobs.map((job, index) => {
                const status = getJobStatusBadge(job);
                const StatusIcon = status.icon;
                const applicantCount = job.applications?.length || 0;
                
                return (
                  <motion.tr
                    key={job._id}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    onHoverStart={() => setHoveredRow(job._id)}
                    onHoverEnd={() => setHoveredRow(null)}
                    className="border-b border-gray-100 group cursor-pointer transition-all duration-200"
                    onClick={() => navigate(`/admin/jobs/${job._id}`)}
                  >
                    {/* Company Name */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 
                          rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                            {job?.company?.name || "Unknown Company"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {job?.location || "Location not specified"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Job Title */}
                    <TableCell className="py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{job.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            {job.jobType || "Full-time"}
                          </Badge>
                          {job.salary && (
                            <span className="text-xs text-gray-500">
                              {job.salary} LPA
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Applicants Count */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
                          ${applicantCount > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Users className={`w-4 h-4 
                            ${applicantCount > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <span className={`font-semibold ${applicantCount > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                          {applicantCount}
                        </span>
                      </div>
                    </TableCell>

                    {/* Posted Date */}
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600">{formatDate(job.createdAt)}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-4">
                      <Badge className={`${status.color} px-3 py-1`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right py-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <MoreHorizontal className="w-5 h-5 text-gray-500" />
                          </motion.button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2 bg-white shadow-lg rounded-lg border border-gray-100">
                          <div className="space-y-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/jobs/${job._id}/edit`);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm 
                                text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                                rounded-lg transition-all duration-200 group"
                            >
                              <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span>Edit Job</span>
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/jobs/${job._id}/applicants`);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm 
                                text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                                rounded-lg transition-all duration-200 group"
                            >
                              <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span>View Applicants</span>
                              {applicantCount > 0 && (
                                <Badge className="ml-auto bg-blue-100 text-blue-700">
                                  {applicantCount}
                                </Badge>
                              )}
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/jobs/${job._id}`);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm 
                                text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                                rounded-lg transition-all duration-200 group"
                            >
                              <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span>View Public Page</span>
                            </button>
                            
                            <div className="border-t border-gray-100 my-1"></div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
                                  // Delete logic here
                                }
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm 
                                text-red-600 hover:bg-red-50 rounded-lg 
                                transition-all duration-200 group"
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span>Delete Job</span>
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </AnimatePresence>
        </TableBody>
      </Table>

      {/* Quick Stats Footer */}
      {filterJobs.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4 text-sm text-gray-500"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              <span>Total: {filterJobs.length} jobs</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Applicants: {filterJobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">New</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs">Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs">Expiring</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminJobsTable;