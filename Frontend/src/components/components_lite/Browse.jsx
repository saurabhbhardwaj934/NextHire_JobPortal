import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Job1 from "./Job1";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../ui/skeleton"; // ✅ only once

import {
  Briefcase,
  Filter,
  Search,
  MapPin,
  DollarSign,
  Clock,
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    salary: "",
    experience: "",
    sortBy: "newest",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Clear search on unmount
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  // Filter Logic
  useEffect(() => {
    if (!allJobs) return;

    let filtered = [...allJobs];
    const activeFilterList = [];

    if (filters.search) {
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.company?.name
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
      );
      activeFilterList.push({ type: "search", value: filters.search });
    }

    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
      activeFilterList.push({ type: "location", value: filters.location });
    }

    if (filters.jobType && filters.jobType !== "all") {
      filtered = filtered.filter(
        (job) => job.jobType === filters.jobType
      );
      activeFilterList.push({ type: "jobType", value: filters.jobType });
    }

    if (filters.salary && filters.salary !== "all") {
      const minSalary = parseInt(filters.salary);
      filtered = filtered.filter((job) => (job.salary || 0) >= minSalary);
      activeFilterList.push({ type: "salary", value: `$${filters.salary}k+` });
    }

    // Sorting
    if (filters.sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredJobs(filtered);
    setActiveFilters(activeFilterList);
  }, [filters, allJobs]);

  const clearAllFilters = () => {
    setFilters({
      search: "",
      location: "",
      jobType: "",
      salary: "",
      experience: "",
      sortBy: "newest",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-4">Browse Jobs</h1>

        {/* Loader */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {filteredJobs.length === 0 ? (
              <p>No Jobs Found</p>
            ) : (
              filteredJobs.map((job) => (
                <Job1 key={job._id} job={job} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;