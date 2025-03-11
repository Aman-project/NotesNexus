import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight, Home, BookOpen, Video, MessageSquare, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import UserProfile from "@/components/UserProfile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  const links = [
    { name: "Home", path: "/", icon: Home },
    { name: "Notes", path: "/notes", icon: BookOpen },
    { name: "Videos", path: "/videos", icon: Video },
    { name: "Chat", path: "/chat", icon: MessageCircle },
    { name: "Contact", path: "/contact", icon: MessageSquare },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
    
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [location.pathname, isMobileMenuOpen]);

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: { 
      opacity: 1,
      height: "100vh",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const mobileMenuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  const bottomNavVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 sm:px-6 md:px-10 py-3 md:py-4",
          isScrolled 
            ? "bg-background/90 backdrop-blur-md shadow-md border-b border-border" 
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="text-lg sm:text-xl font-bold text-foreground tracking-tight relative group"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/90">Notes</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-premium to-premium-dark">Nexus</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-premium to-premium-dark group-hover:w-full transition-all duration-300 ease-in-out"></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {links.map((link, index) => (
                <motion.div
                  key={link.path}
                  whileHover="hover"
                  variants={linkVariants}
                  custom={index}
                >
                  <Link
                    to={link.path}
                    className={cn(
                      "px-4 py-2 text-sm rounded-full transition-all duration-200 relative group",
                      location.pathname === link.path
                        ? "text-premium font-medium bg-premium/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <span className="absolute bottom-0 left-0 right-0 mx-auto w-1/2 h-0.5 bg-premium"></span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="ml-4 flex items-center space-x-3">
              <ThemeToggle />
              {currentUser ? (
                <UserProfile />
              ) : (
                <>
                  <Link to="/auth?mode=login">
                    <Button variant="outline" size="sm" className="rounded-full border-premium/20 text-premium hover:bg-premium/5 hover:text-premium-dark transition-all duration-200">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/auth?mode=signup">
                    <Button size="sm" className="rounded-full bg-gradient-to-r from-premium to-premium-dark hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle - Only visible on small screens but not on xs screens */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:flex md:hidden items-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-premium" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            )}
          </motion.button>
          
          {/* Mobile Actions - Only visible on xs screens */}
          <div className="flex sm:hidden items-center space-x-3">
            <ThemeToggle />
            {currentUser ? (
              <UserProfile />
            ) : (
              <Link to="/auth">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu - Fullscreen overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="md:hidden fixed top-[56px] left-0 right-0 bottom-0 bg-background/98 backdrop-blur-md z-50 border-b border-border overflow-hidden flex flex-col"
            >
              <div className="flex flex-col space-y-4 p-6 mt-4">
                {links.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.path}
                      custom={index}
                      variants={mobileMenuItemVariants}
                    >
                      <Link
                        to={link.path}
                        className={cn(
                          "px-4 py-4 text-base rounded-xl transition-all duration-200 flex items-center",
                          location.pathname === link.path
                            ? "text-premium font-medium bg-premium/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span>{link.name}</span>
                        {location.pathname === link.path && (
                          <ChevronRight className="h-4 w-4 text-premium ml-auto" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              
              <motion.div 
                variants={mobileMenuItemVariants}
                custom={links.length}
                className="flex flex-col space-y-4 p-6 mt-auto border-t border-border"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 rounded-xl">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
                
                {!currentUser && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Link to="/auth?mode=login" className="w-full">
                      <Button variant="outline" size="lg" className="w-full rounded-xl border-premium/20 text-premium hover:bg-premium/5">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup" className="w-full">
                      <Button size="lg" className="w-full rounded-xl bg-gradient-to-r from-premium to-premium-dark hover:opacity-90">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* Bottom Navigation for Mobile */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={bottomNavVariants}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border z-40 px-2 py-1"
      >
        <div className="flex justify-around items-center">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className="flex flex-col items-center justify-center py-2 px-1 w-full"
              >
                <div 
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg p-1 transition-all",
                    isActive 
                      ? "text-premium bg-premium/10" 
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 mb-1 transition-all",
                    isActive ? "text-premium" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-xs font-medium transition-all",
                    isActive ? "text-premium" : "text-muted-foreground"
                  )}>
                    {link.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
      
      {/* Bottom Padding to prevent content from being hidden behind the bottom nav */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Navbar;
