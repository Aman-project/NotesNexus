import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const NotesHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <motion.header 
      className="relative py-16 md:py-24 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/80 dark:from-primary/10 dark:to-background/95 z-0" />
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-repeat opacity-5 dark:opacity-10 z-0" />
      
      {/* Content container */}
      <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Knowledge Hub Button */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              variant="outline" 
              className="rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-background/90"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Knowledge Hub
            </Button>
          </motion.div>
          
          {/* Animated title */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Notes Library
          </motion.h1>
          
          {/* Animated subtitle */}
          <motion.p 
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Access our comprehensive collection of expertly crafted notes to enhance your learning experience and achieve academic excellence.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div
            className="max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search notes by title, content, or category..."
                className="pl-10 pr-4 h-12 rounded-full border-border bg-background/80 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-primary/10 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.7 }}
      />
    </motion.header>
  );
};

export default NotesHeader;
