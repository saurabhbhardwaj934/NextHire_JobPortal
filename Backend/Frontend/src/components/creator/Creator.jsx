import React, { useState } from 'react';
import Navbar from '../components_lite/Navbar';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Globe, 
  Code2,
  Users,
  Award,
  Coffee,
  ExternalLink,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// Import images
import sandeep from './sandeep.jpeg';
import shivam from './shivam.jpeg';
import srb from './srb.jpeg';

const Creator = () => {
  const [hoveredDev, setHoveredDev] = useState(null);

  const developers = [
    {
      id: 1,
      name: "Saurabh Bhardwaj",
      role: "Lead Developer & Designer",
      regNo: "211101250xx",
      image: srb,
      expertise: ["Full Stack", "UI/UX", "System Design"],
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
        email: "saurabh@example.com"
      },
      bio: "Computer Science graduate passionate about creating intuitive web experiences. Specializes in building scalable applications with modern technologies.",
      education: "B.Tech in Computer Science & Engineering",
      university: "AKTU University, Lucknow",
      location: "Lucknow, India",
      experience: "3+ years",
      projects: 15,
      achievements: ["Best Project Award 2023", "Open Source Contributor"]
    },
    {
      id: 2,
      name: "Sandeep Chauhan",
      role: "Backend Developer",
      regNo: "21110125035",
      image: sandeep,
      expertise: ["Node.js", "Python", "Databases", "API Design"],
      social: {
        github: "#",
        linkedin: "#",
        email: "sandeep@example.com"
      },
      bio: "Backend focused on building robust and scalable server-side applications. Experienced in database optimization and API architecture.",
      education: "B.Tech in Computer Science & Engineering",
      university: "AKTU University, Lucknow",
      location: "Lucknow, India",
      experience: "2+ years",
      projects: 12,
      achievements: ["Database Optimization Expert", "API Design Specialist"]
    },
    {
      id: 3,
      name: "Shivam Kumar",
      role: "Frontend Developer",
      regNo: "21110125043",
      image: shivam,
      expertise: ["React", "UI/UX", "Animation", "Responsive Design"],
      social: {
        github: "#",
        linkedin: "#",
        email: "shivam@example.com"
      },
      bio: "Frontend enthusiast dedicated to creating beautiful and responsive user interfaces. Passionate about animations and user experience.",
      education: "B.Tech in Computer Science & Engineering",
      university: "AKTU University, Lucknow",
      location: "Lucknow, India",
      experience: "2+ years",
      projects: 10,
      achievements: ["Best UI Design 2023", "Animation Specialist"]
    }
  ];

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

  return (
    <h1 >this page under processing</h1>
  //   <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
  //     <Navbar />
      
  //     {/* Hero Section */}
  //     <motion.div
  //       initial={{ opacity: 0, y: -20 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16"
  //     >
  //       <div className="max-w-7xl mx-auto px-4 text-center">
  //         <motion.div
  //           initial={{ scale: 0 }}
  //           animate={{ scale: 1 }}
  //           transition={{ type: "spring", stiffness: 260, damping: 20 }}
  //           className="inline-block mb-4"
  //         >
  //           <Badge className="bg-white/20 text-white border-0 px-4 py-2">
  //             <Users className="w-4 h-4 mr-2" />
  //             Meet the Team
  //           </Badge>
  //         </motion.div>
          
  //         <h1 className="text-4xl md:text-5xl font-bold mb-4">
  //           Behind the Scenes of JobPortal
  //         </h1>
  //         <p className="text-xl text-white/90 max-w-2xl mx-auto">
  //           Passionate developers and designers working together to create your 
  //           perfect job hunting experience.
  //         </p>
  //       </div>
  //     </motion.div>

  //     {/* Team Stats */}
  //     <motion.div
  //       variants={containerVariants}
  //       initial="hidden"
  //       animate="visible"
  //       className="max-w-7xl mx-auto px-4 -mt-8 mb-12"
  //     >
  //       <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
  //         {[
  //           { icon: Users, label: "Team Members", value: "3" },
  //           { icon: Code2, label: "Projects Completed", value: "37+" },
  //           { icon: Coffee, label: "Coffee Consumed", value: "500+" },
  //           { icon: Award, label: "Achievements", value: "8" }
  //         ].map((stat, index) => (
  //           <motion.div
  //             key={index}
  //             variants={itemVariants}
  //             className="text-center"
  //           >
  //             <stat.icon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
  //             <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
  //             <div className="text-sm text-gray-500">{stat.label}</div>
  //           </motion.div>
  //         ))}
  //       </div>
  //     </motion.div>

  //     {/* Lead Developer Section */}
  //     <motion.div
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       transition={{ delay: 0.3 }}
  //       className="max-w-7xl mx-auto px-4 py-12"
  //     >
  //       <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
  //         <div className="grid md:grid-cols-2 gap-8">
  //           {/* Image Section */}
  //           <div className="relative h-96 md:h-full">
  //             <img 
  //               src={developers[0].image} 
  //               alt={developers[0].name}
  //               className="w-full h-full object-cover"
  //             />
  //             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
  //             <div className="absolute bottom-4 left-4 text-white">
  //               <h3 className="text-2xl font-bold">{developers[0].name}</h3>
  //               <p className="text-white/90">{developers[0].role}</p>
  //             </div>
  //           </div>

  //           {/* Content Section */}
  //           <div className="p-8">
  //             <Badge className="mb-4 bg-purple-100 text-purple-700 border-0">
  //               Team Lead
  //             </Badge>
              
  //             <p className="text-gray-600 mb-6">{developers[0].bio}</p>
              
  //             <div className="space-y-4 mb-6">
  //               <div className="flex items-center gap-3 text-gray-600">
  //                 <GraduationCap className="w-5 h-5 text-purple-600" />
  //                 <span>{developers[0].education}</span>
  //               </div>
  //               <div className="flex items-center gap-3 text-gray-600">
  //                 <MapPin className="w-5 h-5 text-purple-600" />
  //                 <span>{developers[0].location}</span>
  //               </div>
  //               <div className="flex items-center gap-3 text-gray-600">
  //                 <Briefcase className="w-5 h-5 text-purple-600" />
  //                 <span>{developers[0].experience} experience</span>
  //               </div>
  //             </div>

  //             <div className="flex flex-wrap gap-2 mb-6">
  //               {developers[0].expertise.map((skill, index) => (
  //                 <Badge key={index} variant="outline" className="bg-gray-50">
  //                   {skill}
  //                 </Badge>
  //               ))}
  //             </div>

  //             <div className="flex gap-3">
  //               <Button size="sm" variant="outline" className="gap-2">
  //                 <Github className="w-4 h-4" /> GitHub
  //               </Button>
  //               <Button size="sm" variant="outline" className="gap-2">
  //                 <Linkedin className="w-4 h-4" /> LinkedIn
  //               </Button>
  //               <Button size="sm" variant="outline" className="gap-2">
  //                 <Mail className="w-4 h-4" /> Email
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </motion.div>

  //     {/* Team Members Section */}
  //     <motion.div
  //       variants={containerVariants}
  //       initial="hidden"
  //       animate="visible"
  //       className="max-w-7xl mx-auto px-4 py-12"
  //     >
  //       <div className="text-center mb-12">
  //         <h2 className="text-3xl font-bold text-gray-800 mb-4">
  //           Meet the Developers
  //         </h2>
  //         <p className="text-gray-600 max-w-2xl mx-auto">
  //           Talented individuals working together to bring you the best job hunting experience
  //         </p>
  //       </div>

  //       <div className="grid md:grid-cols-2 gap-8">
  //         {developers.slice(1).map((dev, index) => (
  //           <motion.div
  //             key={dev.id}
  //             variants={itemVariants}
  //             onHoverStart={() => setHoveredDev(dev.id)}
  //             onHoverEnd={() => setHoveredDev(null)}
  //             className="group relative"
  //           >
  //             <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
  //               <div className="relative h-64 overflow-hidden">
  //                 <img 
  //                   src={dev.image} 
  //                   alt={dev.name}
  //                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  //                 />
  //                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
  //                 {/* Social Links Overlay */}
  //                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
  //                   <Button size="icon" variant="secondary" className="rounded-full w-8 h-8">
  //                     <Github className="w-4 h-4" />
  //                   </Button>
  //                   <Button size="icon" variant="secondary" className="rounded-full w-8 h-8">
  //                     <Linkedin className="w-4 h-4" />
  //                   </Button>
  //                   <Button size="icon" variant="secondary" className="rounded-full w-8 h-8">
  //                     <Mail className="w-4 h-4" />
  //                   </Button>
  //                 </div>
  //               </div>

  //               <div className="p-6">
  //                 <div className="flex justify-between items-start mb-3">
  //                   <div>
  //                     <h3 className="text-xl font-bold text-gray-800">{dev.name}</h3>
  //                     <p className="text-purple-600 font-medium">{dev.role}</p>
  //                   </div>
  //                   <Badge variant="outline" className="text-xs">
  //                     {dev.regNo}
  //                   </Badge>
  //                 </div>

  //                 <p className="text-gray-600 text-sm mb-4 line-clamp-2">
  //                   {dev.bio}
  //                 </p>

  //                 <div className="flex flex-wrap gap-2 mb-4">
  //                   {dev.expertise.map((skill, idx) => (
  //                     <Badge key={idx} variant="secondary" className="text-xs">
  //                       {skill}
  //                     </Badge>
  //                   ))}
  //                 </div>

  //                 <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
  //                   <div className="text-center">
  //                     <div className="text-sm font-semibold text-gray-800">{dev.projects}+</div>
  //                     <div className="text-xs text-gray-500">Projects</div>
  //                   </div>
  //                   <div className="text-center">
  //                     <div className="text-sm font-semibold text-gray-800">{dev.experience}</div>
  //                     <div className="text-xs text-gray-500">Experience</div>
  //                   </div>
  //                   <div className="text-center">
  //                     <div className="text-sm font-semibold text-gray-800">
  //                       {dev.achievements.length}
  //                     </div>
  //                     <div className="text-xs text-gray-500">Awards</div>
  //                   </div>
  //                 </div>

  //                 {/* Achievements Tooltip on Hover */}
  //                 <AnimatePresence>
  //                   {hoveredDev === dev.id && (
  //                     <motion.div
  //                       initial={{ opacity: 0, y: 10 }}
  //                       animate={{ opacity: 1, y: 0 }}
  //                       exit={{ opacity: 0, y: 10 }}
  //                       className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-900 
  //                         text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap z-10"
  //                     >
  //                       <div className="font-medium mb-1">Achievements:</div>
  //                       {dev.achievements.map((ach, idx) => (
  //                         <div key={idx} className="flex items-center gap-1">
  //                           <Award className="w-3 h-3 text-yellow-400" />
  //                           {ach}
  //                         </div>
  //                       ))}
  //                       <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
  //                         border-4 border-transparent border-t-gray-900" />
  //                     </motion.div>
  //                   )}
  //                 </AnimatePresence>
  //               </div>
  //             </div>
  //           </motion.div>
  //         ))}
  //       </div>
  //     </motion.div>

  //     {/* Technology Stack Section */}
  //     <motion.div
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       transition={{ delay: 0.6 }}
  //       className="bg-gray-50 py-16"
  //     >
  //       <div className="max-w-7xl mx-auto px-4 text-center">
  //         <h2 className="text-3xl font-bold text-gray-800 mb-4">
  //           Built With Modern Technologies
  //         </h2>
  //         <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
  //           We use the latest tools and frameworks to deliver the best experience
  //         </p>

  //         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  //           {[
  //             { name: "React", icon: "⚛️", color: "from-cyan-500 to-blue-500" },
  //             { name: "Node.js", icon: "🟢", color: "from-green-500 to-emerald-500" },
  //             { name: "MongoDB", icon: "🍃", color: "from-green-600 to-teal-500" },
  //             { name: "Tailwind", icon: "🎨", color: "from-sky-500 to-indigo-500" },
  //             { name: "Redux", icon: "🔄", color: "from-purple-500 to-pink-500" },
  //             { name: "Express", icon: "🚂", color: "from-gray-600 to-gray-800" },
  //             { name: "Figma", icon: "🎯", color: "from-red-500 to-orange-500" },
  //             { name: "Git", icon: "📦", color: "from-orange-500 to-red-500" }
  //           ].map((tech, index) => (
  //             <motion.div
  //               key={index}
  //               whileHover={{ scale: 1.05 }}
  //               className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
  //             >
  //               <div className={`text-4xl mb-2 bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
  //                 {tech.icon}
  //               </div>
  //               <div className="font-medium text-gray-700">{tech.name}</div>
  //             </motion.div>
  //           ))}
  //         </div>
  //       </div>
  //     </motion.div>

  //     {/* Contact Section */}
  //     <motion.div
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       transition={{ delay: 0.7 }}
  //       className="max-w-7xl mx-auto px-4 py-16 text-center"
  //     >
  //       <h2 className="text-3xl font-bold text-gray-800 mb-4">
  //         Want to Collaborate?
  //       </h2>
  //       <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
  //         We're always open to new opportunities and collaborations. 
  //         Feel free to reach out to any team member.
  //       </p>
  //       <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-6 text-lg">
  //         <Mail className="w-5 h-5 mr-2" />
  //         Contact Us
  //       </Button>
  //     </motion.div>
  //   </div>
  );
};

export default Creator;