import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Filter, Video, SortAsc, SortDesc, X, Check, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { memo } from "react";

const MobileVideoFilterDialog = memo(({
  isOpen,
  setIsOpen,
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
  categories,
  clearFilters,
  applyFilters,
}) => {
  // Get the appropriate sort icon based on the current sort order
  const getSortIcon = () => {
    switch (sortOrder) {
      case "newest":
      case "a-z":
        return <SortAsc className="h-4 w-4" />;
      case "oldest":
      case "z-a":
        return <SortDesc className="h-4 w-4" />;
      default:
        return <SortAsc className="h-4 w-4" />;
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-background/95 backdrop-blur-md border-border rounded-xl max-w-sm mx-auto shadow-lg">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Video className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300">
            Filter Videos
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Customize your video view with the options below
          </DialogDescription>
        </DialogHeader>
        
        <Separator className="my-3" />
        
        <motion.div 
          className="space-y-6 py-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.div className="space-y-3" variants={itemVariants}>
            <div className="flex items-center">
              <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-full p-1.5 mr-2">
                <Tag className="h-4 w-4 text-blue-500" />
              </div>
              <label className="text-sm font-medium">Category</label>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full border-border bg-background/80 focus:ring-blue-500/20 rounded-lg">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border bg-background/95 backdrop-blur-sm">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedCategory !== "all" && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 mt-2 rounded-full">
                <Tag className="h-3 w-3 mr-1.5" />
                {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory("all")} 
                  className="ml-1.5 hover:bg-blue-500/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </motion.div>
          
          <motion.div className="space-y-3" variants={itemVariants}>
            <div className="flex items-center">
              <div className="bg-blue-400/10 dark:bg-blue-400/20 rounded-full p-1.5 mr-2">
                {getSortIcon()}
              </div>
              <label className="text-sm font-medium">Sort by</label>
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full border-border bg-background/80 focus:ring-blue-400/20 rounded-lg">
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border bg-background/95 backdrop-blur-sm">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
              </SelectContent>
            </Select>
            
            {sortOrder !== "newest" && (
              <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/20 px-3 py-1 mt-2 rounded-full">
                {getSortIcon()}
                {sortOrder === "oldest" ? "Oldest First" : 
                 sortOrder === "a-z" ? "A-Z" : "Z-A"}
                <button 
                  onClick={() => setSortOrder("newest")} 
                  className="ml-1.5 hover:bg-blue-400/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </motion.div>
        </motion.div>
        
        <Separator className="my-3" />
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            variant="outline" 
            className="w-full rounded-full border-border hover:bg-secondary/80 flex items-center justify-center" 
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:opacity-90 transition-all rounded-full flex items-center justify-center" 
            onClick={() => {
              applyFilters();
              setIsOpen(false);
            }}
          >
            <Check className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

MobileVideoFilterDialog.displayName = "MobileVideoFilterDialog";

export default MobileVideoFilterDialog; 