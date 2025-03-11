import { useState } from "react";
import { Check, ChevronDown, Tag, ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const VideoFilterBar = ({
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
  categories,
  clearFilters,
  hasFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
  ];

  // Get current sort label
  const currentSortLabel = sortOptions.find(
    (option) => option.value === sortOrder
  )?.label;

  return (
    <motion.div
      className="hidden md:flex items-center justify-between mb-8 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        {/* Category Filter */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-full border-border bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <Tag className="h-4 w-4" />
                <span>Category:</span>
                <span className="font-medium">
                  {selectedCategory === "all"
                    ? "All Categories"
                    : selectedCategory}
                </span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem
                className={`flex items-center gap-2 ${
                  selectedCategory === "all" ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                {selectedCategory === "all" && (
                  <Check className="h-4 w-4 text-primary" />
                )}
                <span className={selectedCategory === "all" ? "ml-0" : "ml-6"}>
                  All Categories
                </span>
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  className={`flex items-center gap-2 ${
                    selectedCategory === category ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {selectedCategory === category && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                  <span
                    className={
                      selectedCategory === category ? "ml-0" : "ml-6"
                    }
                  >
                    {category}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sort Order */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-full border-border bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort by:</span>
                <span className="font-medium">{currentSortLabel}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className={`flex items-center gap-2 ${
                    sortOrder === option.value ? "bg-accent" : ""
                  }`}
                  onClick={() => setSortOrder(option.value)}
                >
                  {sortOrder === option.value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                  <span
                    className={
                      sortOrder === option.value ? "ml-0" : "ml-6"
                    }
                  >
                    {option.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Clear Filters Button */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default VideoFilterBar; 