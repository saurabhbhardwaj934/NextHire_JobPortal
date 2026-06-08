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
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { 
  Edit2, 
  MoreHorizontal, 
  Building2, 
  Calendar, 
  Eye, 
  Trash2,
  CheckCircle,
  Clock,
  Users,
  Briefcase
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const navigate = useNavigate();
  const [filterCompany, setFilterCompany] = useState(companies);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter((company) => {
        if (!searchCompanyByText) {
          return true;
        }
        return company.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  // Get company initials for avatar fallback
  const getCompanyInitials = (name) => {
    if (!name) return "C";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Format date
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

  if (!companies) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="text-gray-500">
          {filterCompany.length === 0 
            ? "No companies registered yet" 
            : `Showing ${filterCompany.length} of ${companies.length} companies`
          }
        </TableCaption>
        
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Logo
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">Company Name</TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Registered
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Status
              </div>
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence mode="sync">
            {filterCompany.length === 0 ? (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td colSpan="5" className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Building2 className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No Companies Found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchCompanyByText 
                        ? `No companies matching "${searchCompanyByText}"` 
                        : "Start by adding your first company"
                      }
                    </p>
                    {searchCompanyByText && (
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
              filterCompany.map((company, index) => (
                <motion.tr
                  key={company._id}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onHoverStart={() => setHoveredRow(company._id)}
                  onHoverEnd={() => setHoveredRow(null)}
                  className="border-b border-gray-100 group cursor-pointer transition-all duration-200"
                  onClick={() => navigate(`/admin/companies/${company._id}`)}
                >
                  {/* Logo Cell */}
                  <TableCell className="py-4">
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-blue-300 transition-all duration-300">
                        <AvatarImage
                          src={company.logo || "default-logo-url"}
                          alt={`${company.name} logo`}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                          {getCompanyInitials(company.name)}
                        </AvatarFallback>
                      </Avatar>
                      {company.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Company Name Cell */}
                  <TableCell className="py-4">
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          {company.jobs?.length || 0} Jobs
                        </Badge>
                        {company.industry && (
                          <span className="text-xs text-gray-500">
                            • {company.industry}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Date Cell */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(company.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </p>
                  </TableCell>

                  {/* Status Cell */}
                  <TableCell className="py-4">
                    <Badge 
                      className={`${
                        company.isActive !== false 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          company.isActive !== false ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {company.isActive !== false ? 'Active' : 'Inactive'}
                      </div>
                    </Badge>
                    {company.hiring && (
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          <Users className="w-3 h-3 mr-1" />
                          Hiring
                        </Badge>
                      </div>
                    )}
                  </TableCell>

                  {/* Actions Cell */}
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
                              navigate(`/admin/companies/${company._id}`);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm 
                              text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                              rounded-lg transition-all duration-200 group"
                          >
                            <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Edit Company</span>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/companies/${company._id}/jobs`);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm 
                              text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                              rounded-lg transition-all duration-200 group"
                          >
                            <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>View Jobs</span>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle view details
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm 
                              text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                              rounded-lg transition-all duration-200 group"
                          >
                            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>View Details</span>
                          </button>
                          
                          <div className="border-t border-gray-100 my-1"></div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete with confirmation
                              if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
                                // Delete logic here
                              }
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm 
                              text-red-600 hover:bg-red-50 rounded-lg 
                              transition-all duration-200 group"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Delete Company</span>
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </TableBody>
      </Table>

      {/* Quick Stats Footer */}
      {filterCompany.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span>Total: {filterCompany.length} companies</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Hiring: {filterCompany.filter(c => c.hiring).length}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Verified: {filterCompany.filter(c => c.isVerified).length}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CompaniesTable;