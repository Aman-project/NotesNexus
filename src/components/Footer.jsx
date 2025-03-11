import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const socialVariants = {
    hover: { 
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-background to-secondary/30 border-t border-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-64 bg-premium/5 rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-48 bg-note-blue/10 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10 sm:py-12 md:py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10"
        >
          <motion.div variants={itemVariants} className="col-span-2 space-y-4 sm:space-y-6">
            <Link to="/" className="inline-block">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/90">Notes</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-premium to-premium-dark">Nexus</span>
              </h3>
            </Link>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Empowering learning through comprehensive notes and educational videos. Join our community of learners and elevate your academic journey.
            </p>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2 sm:mb-3">Subscribe to our newsletter</h4>
              <div className="flex flex-col xs:flex-row gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="rounded-full bg-background/50 border-border focus:border-premium"
                />
                <Button className="rounded-full bg-gradient-to-r from-premium to-premium-dark hover:opacity-90 transition-all whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-3 sm:space-x-4 pt-3 sm:pt-4">
              {[
                { icon: <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />, href: "#" },
                { icon: <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />, href: "#" },
                { icon: <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />, href: "#" },
                { icon: <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />, href: "#" },
                { icon: <Github className="h-4 w-4 sm:h-5 sm:w-5" />, href: "#" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover="hover"
                  variants={socialVariants}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-premium hover:shadow-md transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 sm:mb-5 text-foreground">Resources</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              {[
                { name: "Notes Library", path: "/notes" },
                { name: "Video Tutorials", path: "/videos" },
                { name: "Study Guides", path: "#" },
                { name: "Practice Tests", path: "#" },
                { name: "Learning Paths", path: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-muted-foreground hover:text-premium transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 sm:mb-5 text-foreground">Company</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              {[
                { name: "About Us", path: "#" },
                { name: "Our Team", path: "#" },
                { name: "Careers", path: "#" },
                { name: "Press", path: "#" },
                { name: "Contact", path: "/contact" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-muted-foreground hover:text-premium transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 sm:mb-5 text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-premium shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Gla University
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-premium shrink-0" />
                <span className="text-muted-foreground">
                  <a href="tel:+918273843092">+91 8273843092</a>
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-premium shrink-0" />
                <span className="text-muted-foreground">
                  <a href="mailto:info@notesnexus.com">info@notesnexus.com</a>
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="border-t border-border mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center"
        >
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} NotesNexus. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0 text-xs sm:text-sm">
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
