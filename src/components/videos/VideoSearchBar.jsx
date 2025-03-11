import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import * as React from "react";

// Create a borderless input component that extends the base Input
const BorderlessInput = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          "border-0 rounded-none p-0 h-9 sm:h-10 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base placeholder:text-muted-foreground/70 bg-transparent flex-1",
          className
        )}
        {...props}
      />
    );
  }
);
BorderlessInput.displayName = "BorderlessInput";

const VideoSearchBar = ({ searchQuery, setSearchQuery, className }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setHasValue(searchQuery.length > 0);
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleSearchIconClick = () => {
    inputRef.current?.focus();
  };

  return (
    <motion.div 
      className={`relative w-full ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`
          flex items-center bg-background rounded-full overflow-hidden
          transition-all duration-300 shadow-sm hover:shadow-md
          ${isFocused ? 'ring-2 ring-primary/20' : ''}
          max-w-full
        `}
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div 
          className="p-2 sm:p-3 text-muted-foreground cursor-pointer"
          onClick={handleSearchIconClick}
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
        </div>
        
        <BorderlessInput
          ref={inputRef}
          type="text"
          placeholder="Search videos..."
          aria-label="Search videos by title, description, or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <AnimatePresence>
          {hasValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="pr-2 sm:pr-3"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-6 w-6 sm:h-7 sm:w-7 rounded-full flex-shrink-0 hover:bg-muted/80"
                aria-label="Clear search"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default VideoSearchBar; 