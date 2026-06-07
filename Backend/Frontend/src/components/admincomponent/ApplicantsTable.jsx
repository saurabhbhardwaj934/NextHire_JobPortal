import React, { useState } from "react";
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
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Download,
  Mail,
  Phone,
  Calendar,
  User,
  Clock,
  Send,
  Eye,
  Award
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../ui/badge";


// ✅ STATUS CONFIG
const shortlistingStatus = [
  { value: "pending", label: "Pending", color: "yellow", icon: Clock },
  { value: "shortlisted", label: "Shortlisted", color: "green", icon: CheckCircle },
  { value: "rejected", label: "Rejected", color: "red", icon: XCircle },
  { value: "hired", label: "Hired", color: "purple", icon: Award }
];

// ✅ COLOR MAPS (Tailwind safe)
const colorMap = {
  yellow: "bg-yellow-100 text-yellow-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700"
};

const hoverMap = {
  yellow: "hover:bg-yellow-50 hover:text-yellow-700",
  green: "hover:bg-green-50 hover:text-green-700",
  red: "hover:bg-red-50 hover:text-red-700",
  purple: "hover:bg-purple-50 hover:text-purple-700"
};

const selectedMap = {
  yellow: "bg-yellow-50 text-yellow-700",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-700",
  purple: "bg-purple-50 text-purple-700"
};

const dotMap = {
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  red: "bg-red-500",
  purple: "bg-purple-500"
};


const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const [updatingId, setUpdatingId] = useState(null);

  const applications = applicants?.applications || [];

  const statusHandler = async (status, id) => {
    setUpdatingId(id);
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = shortlistingStatus.find(x => x.value === status);
    if (!s) return null;
    const Icon = s.icon;

    return (
      <Badge className={`${colorMap[s.color]} px-3 py-1`}>
        <Icon className="w-3 h-3 mr-1" />
        {s.label}
      </Badge>
    );
  };

  if (!applications.length) {
    return (
      <div className="text-center py-12">
        <User className="w-10 h-10 mx-auto text-gray-400" />
        <p>No Applicants</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>{applications.length} Applicants</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence>
            {applications.map((item) => {
              const currentStatus = item.status || "pending";
              const isUpdating = updatingId === item._id;

              return (
                <motion.tr key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  
                  <TableCell>{item?.applicant?.fullname}</TableCell>

                  <TableCell>{item?.applicant?.email}</TableCell>

                  <TableCell>{item?.applicant?.phoneNumber}</TableCell>

                  <TableCell>
                    {item?.applicant?.profile?.resume ? (
                      <a href={item.applicant.profile.resume} target="_blank">
                        <Download />
                      </a>
                    ) : "N/A"}
                  </TableCell>

                  <TableCell>
                    {new Date(item?.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(currentStatus)}
                  </TableCell>

                  <TableCell>
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal />
                      </PopoverTrigger>

                      <PopoverContent>
                        {shortlistingStatus.map((status) => {
                          const Icon = status.icon;
                          const isSelected = currentStatus === status.value;

                          return (
                            <button
                              key={status.value}
                              onClick={() => statusHandler(status.value, item._id)}
                              className={`flex gap-2 p-2 w-full 
                                ${isSelected 
                                  ? selectedMap[status.color] 
                                  : hoverMap[status.color]
                                }`}
                            >
                              <Icon className="w-4 h-4" />
                              {status.label}
                            </button>
                          );
                        })}
                      </PopoverContent>
                    </Popover>
                  </TableCell>

                </motion.tr>
              );
            })}
          </AnimatePresence>
        </TableBody>
      </Table>

      {/* Footer */}
      <div className="flex gap-4 mt-4 text-sm">
        {shortlistingStatus.map(s => (
          <div key={s.value} className="flex items-center gap-1">
            <div className={`w-2 h-2 ${dotMap[s.color]} rounded-full`} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantsTable;