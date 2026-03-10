import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { 
  LogOut, 
  User2, 
  Briefcase, 
  Home, 
  Compass, 
  Info, 
  Building2,
  ChevronDown,
  Bell,
  Settings,
  Palette,
  Sun,
  Moon,
  Sparkles
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";
import { motion, AnimatePresence } from "framer-motion";

// Theme configurations
const themes = {
  light: {
    name: "Light",
    icon: Sun,
    bg: "bg-white",
    text: "text-gray-900",
    muted: "text-gray-600",
    border: "border-gray-200",
    hover: "hover:bg-gray-100",
    primary: "from-blue-600 to-purple-600",
    secondary: "from-gray-900 to-gray-700",
    card: "bg-white",
    shadow: "shadow-lg",
    gradient: "from-blue-600 to-purple-600"
  },
  dark: {
    name: "Dark",
    icon: Moon,
    bg: "bg-gray-900",
    text: "text-white",
    muted: "text-gray-300",
    border: "border-gray-700",
    hover: "hover:bg-gray-800",
    primary: "from-blue-400 to-purple-400",
    secondary: "from-gray-700 to-gray-600",
    card: "bg-gray-800",
    shadow: "shadow-xl shadow-black/20",
    gradient: "from-blue-400 to-purple-400"
  },
  ocean: {
    name: "Ocean",
    icon: () => <span className="text-blue-400">🌊</span>,
    bg: "bg-blue-50",
    text: "text-blue-900",
    muted: "text-blue-700",
    border: "border-blue-200",
    hover: "hover:bg-blue-100",
    primary: "from-blue-500 to-cyan-400",
    secondary: "from-blue-800 to-cyan-700",
    card: "bg-white",
    shadow: "shadow-lg shadow-blue-200",
    gradient: "from-blue-500 to-cyan-400"
  },
  sunset: {
    name: "Sunset",
    icon: () => <span className="text-orange-400">🌅</span>,
    bg: "bg-orange-50",
    text: "text-orange-900",
    muted: "text-orange-700",
    border: "border-orange-200",
    hover: "hover:bg-orange-100",
    primary: "from-orange-500 to-pink-500",
    secondary: "from-orange-800 to-pink-700",
    card: "bg-white",
    shadow: "shadow-lg shadow-orange-200",
    gradient: "from-orange-500 to-pink-500"
  },
  forest: {
    name: "Forest",
    icon: () => <span className="text-green-400">🌲</span>,
    bg: "bg-green-50",
    text: "text-green-900",
    muted: "text-green-700",
    border: "border-green-200",
    hover: "hover:bg-green-100",
    primary: "from-green-500 to-emerald-400",
    secondary: "from-green-800 to-emerald-700",
    card: "bg-white",
    shadow: "shadow-lg shadow-green-200",
    gradient: "from-green-500 to-emerald-400"
  },
  lavender: {
    name: "Lavender",
    icon: () => <span className="text-purple-400">💜</span>,
    bg: "bg-purple-50",
    text: "text-purple-900",
    muted: "text-purple-700",
    border: "border-purple-200",
    hover: "hover:bg-purple-100",
    primary: "from-purple-500 to-pink-400",
    secondary: "from-purple-800 to-pink-700",
    card: "bg-white",
    shadow: "shadow-lg shadow-purple-200",
    gradient: "from-purple-500 to-pink-400"
  },
  midnight: {
    name: "Midnight",
    icon: () => <span className="text-indigo-400">🌙</span>,
    bg: "bg-indigo-950",
    text: "text-white",
    muted: "text-indigo-200",
    border: "border-indigo-800",
    hover: "hover:bg-indigo-900",
    primary: "from-indigo-400 to-purple-400",
    secondary: "from-indigo-800 to-purple-800",
    card: "bg-indigo-900",
    shadow: "shadow-xl shadow-indigo-900/50",
    gradient: "from-indigo-400 to-purple-400"
  }
};

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Interactive states
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isThemePopoverOpen, setIsThemePopoverOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [currentTheme, setCurrentTheme] = useState("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("nexthire-theme") || "light";
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Apply theme to document
  const applyTheme = (themeKey) => {
    const theme = themes[themeKey];
    if (!theme) return;

    // Remove previous theme classes
    document.documentElement.classList.remove(
      'theme-light', 'theme-dark', 'theme-ocean', 'theme-sunset', 
      'theme-forest', 'theme-lavender', 'theme-midnight'
    );
    
    // Add new theme class
    document.documentElement.classList.add(`theme-${themeKey}`);
    
    // Save to localStorage
    localStorage.setItem("nexthire-theme", themeKey);
  };

  const changeTheme = (themeKey) => {
    setCurrentTheme(themeKey);
    applyTheme(themeKey);
    toast.success(`${themes[themeKey].name} theme applied!`);
    setIsThemePopoverOpen(false);
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      if (res && res.data && res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Error logging out. Please try again.");
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = user && user.role === "Recruiter" ? [
    { path: "/admin/companies", label: "Companies", icon: Building2, description: "Manage your companies" },
    { path: "/admin/jobs", label: "Jobs", icon: Briefcase, description: "Post and manage jobs" }
  ] : [
    { path: "/Home", label: "Home", icon: Home, description: "Go to dashboard" },
    { path: "/Browse", label: "Browse", icon: Compass, description: "Discover opportunities" },
    { path: "/Jobs", label: "Jobs", icon: Briefcase, description: "Find your dream job" },
    { path: "/Creator", label: "About", icon: Info, description: "Learn about us" }
  ];

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.fullname) return "U";
    return user.fullname.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const theme = themes[currentTheme];

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? `${theme.bg}/95 backdrop-blur-xl ${theme.shadow}` 
          : `${theme.bg}/80 backdrop-blur-md border-b ${theme.border}`
      } ${theme.text}`}
    >
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        {/* Interactive Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
        >
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: hoveredItem === "logo" ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className={`w-8 h-8 bg-gradient-to-br ${theme.primary} rounded-lg flex items-center justify-center`}
            >
              <span className="text-white font-bold text-lg">N</span>
            </motion.div>
            <div 
              className="relative"
              onMouseEnter={() => setHoveredItem("logo")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <h1 className="text-xl font-bold tracking-tight">
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.primary}`}>
                  Next
                </span>
                <span className={theme.text}>Hire</span>
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: hoveredItem === "logo" ? "100%" : 0 }}
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${theme.primary}`}
              />
            </div>
          </Link>
        </motion.div>

        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredItem(item.path)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Link to={item.path}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 rounded-xl transition-all duration-200 
                      flex items-center gap-3 group cursor-pointer
                      ${isActive(item.path) 
                        ? `text-${currentTheme === 'light' ? 'blue-600' : 'white'} bg-${currentTheme === 'light' ? 'blue-50' : 'white/10'}` 
                        : `${theme.muted} ${theme.hover}`
                      }
                    `}
                  >
                    <motion.div
                      animate={{ 
                        rotate: hoveredItem === item.path ? [0, -10, 10, -5, 5, 0] : 0 
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className={`w-4 h-4 transition-colors duration-200
                        ${isActive(item.path) 
                          ? `text-${currentTheme === 'light' ? 'blue-600' : 'white'}` 
                          : `text-${currentTheme === 'light' ? 'gray-400' : 'gray-500'} group-hover:text-${currentTheme === 'light' ? 'blue-600' : 'white'}`
                        }
                      `} />
                    </motion.div>
                    
                    <span className="text-sm font-medium">{item.label}</span>
                    
                    {/* Tooltip on hover */}
                    <AnimatePresence>
                      {hoveredItem === item.path && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                            ${currentTheme === 'dark' || currentTheme === 'midnight' 
                              ? 'bg-white text-gray-900' 
                              : 'bg-gray-900 text-white'} 
                            text-xs py-1 px-2 rounded whitespace-nowrap`}
                        >
                          {item.description}
                          <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 
                            border-4 border-transparent 
                            ${currentTheme === 'dark' || currentTheme === 'midnight' 
                              ? 'border-b-white' 
                              : 'border-b-gray-900'}`} 
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Active indicator */}
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.primary} rounded-full`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Notification Bell */}
          {user && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative p-2 rounded-full ${theme.hover} transition-colors`}
              onClick={() => toast.info("Notifications coming soon!")}
            >
              <Bell className={`w-5 h-5 ${theme.muted}`} />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white 
                    text-xs rounded-full flex items-center justify-center"
                >
                  {notificationCount}
                </motion.span>
              )}
            </motion.button>
          )}

          {/* Theme Selector Popover */}
          <Popover open={isThemePopoverOpen} onOpenChange={setIsThemePopoverOpen}>
            <PopoverTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`relative p-2 rounded-full ${theme.hover} transition-colors`}
              >
                <Palette className={`w-5 h-5 ${theme.muted}`} />
              </motion.button>
            </PopoverTrigger>
            
            <PopoverContent className={`w-64 p-3 ${theme.card} border ${theme.border} rounded-xl shadow-xl`}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h3 className={`text-sm font-semibold mb-2 px-2 ${theme.text}`}>Choose Theme</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(themes).map(([key, t]) => {
                    const Icon = t.icon;
                    const isActive = currentTheme === key;
                    
                    return (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => changeTheme(key)}
                        className={`p-2 rounded-lg flex items-center gap-2 transition-all duration-200
                          ${isActive 
                            ? `bg-gradient-to-r ${t.primary} text-white` 
                            : `${t.bg} ${t.text} hover:bg-opacity-80`
                          }`}
                      >
                        <span className="text-lg">
                          {typeof Icon === 'function' ? <Icon /> : <Icon className="w-4 h-4" />}
                        </span>
                        <span className="text-xs font-medium">{t.name}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <Sparkles className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                
                {/* Preview section */}
                <div className={`mt-3 pt-3 border-t ${theme.border}`}>
                  <p className={`text-xs ${theme.muted} text-center`}>
                    Click to preview themes
                  </p>
                  <div className="flex justify-center gap-1 mt-2">
                    {['light', 'dark', 'ocean', 'sunset', 'forest', 'lavender', 'midnight'].map((key) => (
                      <div
                        key={key}
                        onClick={() => changeTheme(key)}
                        className={`w-4 h-4 rounded-full cursor-pointer transition-transform hover:scale-125
                          bg-gradient-to-r ${themes[key].primary}`}
                        title={themes[key].name}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </PopoverContent>
          </Popover>

          {!user ? (
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link to="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    className={`${theme.muted} ${theme.hover} transition-all duration-200 relative overflow-hidden group`}
                  >
                    <span className="relative z-10">Login</span>
                    <motion.div
                      className={`absolute inset-0 ${theme.hover.replace('hover:', '')}`}
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: [
                      "0px 0px 0px rgba(37, 99, 235, 0)", 
                      `0px 5px 15px ${currentTheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(37, 99, 235, 0.3)'}`, 
                      "0px 0px 0px rgba(37, 99, 235, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Button 
                    className={`bg-gradient-to-r ${theme.primary} text-white 
                      hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow`}
                  >
                    Register
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          ) : (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative cursor-pointer"
                >
                  <Avatar className={`ring-2 ring-transparent hover:ring-${currentTheme === 'light' ? 'blue' : 'white'}-300 
                    transition-all duration-200`}>
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt={user?.fullname}
                      className="object-cover"
                    />
                    <AvatarFallback className={`bg-gradient-to-br ${theme.primary} text-white`}>
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    animate={{ rotate: isPopoverOpen ? 180 : 0 }}
                    className={`absolute -bottom-1 -right-1 ${theme.card} rounded-full p-0.5 shadow-md`}
                  >
                    <ChevronDown className={`w-3 h-3 ${theme.muted}`} />
                  </motion.div>
                </motion.div>
              </PopoverTrigger>
              
              <PopoverContent className={`w-72 p-0 overflow-hidden border-0 shadow-xl rounded-xl ${theme.card}`}>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* User header with animated gradient */}
                  <div className={`bg-gradient-to-r ${theme.primary} p-4 text-white`}>
                    <motion.div 
                      className="flex items-center gap-3"
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                    >
                      <Avatar className="w-12 h-12 ring-2 ring-white/50">
                        <AvatarImage src={user?.profile?.profilePhoto} />
                        <AvatarFallback className="bg-white text-blue-600">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <motion.h3 
                          className="font-semibold"
                          animate={{ opacity: [0.5, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          {user?.fullname}
                        </motion.h3>
                        <p className="text-xs text-white/80">{user?.email}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Menu items with staggered animation */}
                  <div className="p-2">
                    {user && user.role === "Student" && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Link to="/Profile">
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start gap-3 ${theme.hover} ${theme.text} transition-all duration-200 group`}
                          >
                            <User2 className={`w-4 h-4 ${theme.muted} group-hover:scale-110 transition-transform`} />
                            <span>Profile</span>
                            <motion.div
                              className="ml-auto text-xs text-gray-400"
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              →
                            </motion.div>
                          </Button>
                        </Link>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start gap-3 ${theme.hover} ${theme.text} transition-all duration-200 group`}
                        onClick={() => toast.info("Settings coming soon!")}
                      >
                        <Settings className={`w-4 h-4 ${theme.muted} group-hover:rotate-90 transition-transform duration-500`} />
                        <span>Settings</span>
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button 
                        onClick={logoutHandler}
                        variant="ghost" 
                        className="w-full justify-start gap-3 text-red-600 
                          hover:text-red-700 hover:bg-red-50 transition-all duration-200 group"
                      >
                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <span>Logout</span>
                      </Button>
                    </motion.div>
                  </div>

                  {/* Footer with animation */}
                  <motion.div 
                    className={`p-3 ${theme.bg} text-xs ${theme.muted} text-center border-t ${theme.border}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Signed in as {user?.role}
                  </motion.div>
                </motion.div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Progress bar for scroll position */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.primary}`}
        style={{ scaleX: isScrolled ? 1 : 0, transformOrigin: "0%" }}
      />
    </motion.div>
  );
};

export default Navbar;