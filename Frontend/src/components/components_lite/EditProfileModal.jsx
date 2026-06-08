import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { setUser } from "@/redux/authSlice";
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Award, 
  Upload,
  X,
  Plus,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const EditProfileModal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills || [],
    file: null,
    resumeOriginalName: user?.profile?.resumeOriginalName || "",
  });

  const dispatch = useDispatch();

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!input.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!input.email.trim()) newErrors.email = "Email is required";
    if (!input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format";
    if (!input.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!input.phoneNumber.match(/^[0-9]{10}$/)) newErrors.phoneNumber = "Invalid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Add skill
  const addSkill = () => {
    if (skillInput.trim() && !input.skills.includes(skillInput.trim())) {
      setInput({
        ...input,
        skills: [...input.skills, skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setInput({
      ...input,
      skills: input.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Handle skill input key press
  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const FileChangehandler = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setInput({ 
        ...input, 
        file,
        resumeOriginalName: file.name 
      });
    } else if (file) {
      toast.error("Please upload a PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", JSON.stringify(input.skills));

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser({ 
          ...res.data.user, 
          profile: {
            ...res.data.user.profile,
            skills: input.skills,
            resumeOriginalName: input.resumeOriginalName || res.data.user.profile?.resumeOriginalName
          }
        }));
        setSuccess(true);
        toast.success(res.data.message);
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setInput({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills || [],
        file: null,
        resumeOriginalName: user?.profile?.resumeOriginalName || "",
      });
      setErrors({});
      setSkillInput("");
      setSuccess(false);
    }
  }, [open, user]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl">
        <AnimatePresence mode="sync">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile Updated!</h3>
              <p className="text-sm text-gray-500">Your changes have been saved successfully.</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl">Edit Profile</DialogTitle>
                  <DialogDescription className="text-white/80">
                    Update your personal information and professional details
                  </DialogDescription>
                </DialogHeader>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-5 max-h-[60vh] overflow-y-auto px-1">
                  {/* Full Name */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      Full Name
                    </Label>
                    <Input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={input.fullname}
                      onChange={changeEventHandler}
                      placeholder="John Doe"
                      className={`border-2 transition-all duration-300 focus:border-blue-600
                        ${errors.fullname ? 'border-red-500 focus:border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.fullname && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullname}
                      </p>
                    )}
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      placeholder="john@example.com"
                      className={`border-2 transition-all duration-300 focus:border-blue-600
                        ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </motion.div>

                  {/* Phone Number */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={input.phoneNumber}
                      onChange={changeEventHandler}
                      placeholder="9876543210"
                      className={`border-2 transition-all duration-300 focus:border-blue-600
                        ${errors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phoneNumber}
                      </p>
                    )}
                  </motion.div>

                  {/* Bio */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-gray-700 font-medium">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={input.bio}
                      onChange={changeEventHandler}
                      placeholder="Tell us about yourself, your experience, and career goals..."
                      rows={3}
                      className="border-2 border-gray-200 focus:border-blue-600 transition-all duration-300 resize-none"
                    />
                  </motion.div>

                  {/* Skills */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      Skills
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={handleSkillKeyPress}
                        placeholder="Add a skill (e.g., React, Python)"
                        className="flex-1 border-2 border-gray-200 focus:border-blue-600 transition-all duration-300"
                      />
                      <Button
                        type="button"
                        onClick={addSkill}
                        variant="outline"
                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    
                    {/* Skills Display */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <AnimatePresence>
                        {input.skills.map((skill, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge 
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 
                                text-gray-700 hover:from-blue-100 hover:to-purple-100 
                                transition-all duration-300 cursor-default group"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Press Enter or click Add to add skills
                    </p>
                  </motion.div>

                  {/* Resume Upload */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Resume (PDF only)
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 
                      hover:border-blue-400 transition-all duration-300">
                      <input
                        type="file"
                        id="file"
                        name="file"
                        accept="application/pdf"
                        onChange={FileChangehandler}
                        className="hidden"
                      />
                      <label
                        htmlFor="file"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {input.resumeOriginalName || "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF files only (Max 5MB)</p>
                      </label>
                    </div>
                    {input.resumeOriginalName && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg mt-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">{input.resumeOriginalName}</span>
                      </div>
                    )}
                  </motion.div>
                </div>

                <DialogFooter className="mt-6 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="border-gray-300 hover:border-gray-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 
                      hover:from-blue-700 hover:to-purple-700 text-white
                      transition-all duration-300 shadow-sm hover:shadow"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        Save Changes
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;