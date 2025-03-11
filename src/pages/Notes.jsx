import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notes } from "@/lib/data";
import FilterBar from "@/components/notes/FilterBar";
import MobileFilterDialog from "@/components/notes/MobileFilterDialog";
import NotesGrid from "@/components/notes/NotesGrid";
import NotesHeader from "@/components/notes/NotesHeader";
import { motion } from "framer-motion";

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get unique categories - memoized to prevent recalculation
  const categories = useMemo(() => {
    return Array.from(new Set(notes.map((note) => note.category)));
  }, []);
  
  // Filter and sort notes - memoized callback to prevent recreation
  const filterAndSortNotes = useCallback(() => {
    setIsLoading(true);
    
    // Use setTimeout to prevent UI blocking during filtering
    setTimeout(() => {
      let results = [...notes];
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(
          (note) =>
            note.title.toLowerCase().includes(query) ||
            note.excerpt?.toLowerCase().includes(query) ||
            note.content?.toLowerCase().includes(query) ||
            note.category.toLowerCase().includes(query) ||
            note.description?.toLowerCase().includes(query)
        );
      }
      
      // Filter by category
      if (selectedCategory && selectedCategory !== "all") {
        results = results.filter((note) => note.category === selectedCategory);
      }
      
      // Sort notes
      if (sortOrder === "newest") {
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortOrder === "oldest") {
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (sortOrder === "a-z") {
        results.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOrder === "z-a") {
        results.sort((a, b) => b.title.localeCompare(a.title));
      }
      
      setFilteredNotes(results);
      setIsLoading(false);
    }, 10); // Small delay to allow UI to update
  }, [searchQuery, selectedCategory, sortOrder]);
  
  // Apply filters when dependencies change
  useEffect(() => {
    filterAndSortNotes();
  }, [filterAndSortNotes]);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortOrder("newest");
    setIsFilterDialogOpen(false);
  }, []);
  
  // Apply filters (mobile)
  const applyFilters = useCallback(() => {
    setIsFilterDialogOpen(false);
  }, []);

  // Check if filters are applied
  const hasFilters = searchQuery || selectedCategory !== "all" || sortOrder !== "newest";
  
  // Handle search query change with debounce
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
      <Navbar />
      
      <NotesHeader 
        searchQuery={searchQuery} 
        setSearchQuery={handleSearchChange} 
      />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          {/* Mobile Search and Filter */}
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsFilterDialogOpen(true)}
              className="rounded-full h-10 w-10 flex items-center justify-center"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Filter Bar (Desktop) */}
          <FilterBar 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            categories={categories}
            clearFilters={clearFilters}
            hasFilters={!!hasFilters}
          />
          
          {/* Results Count */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <p className="text-sm md:text-base text-foreground/80">
              Showing <span className="font-semibold text-foreground">{filteredNotes.length}</span> {filteredNotes.length === 1 ? "note" : "notes"}
              {selectedCategory !== "all" && <span> in <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedCategory}</span></span>}
              {searchQuery && <span> for "<span className="font-semibold text-blue-600 dark:text-blue-400">{searchQuery}</span>"</span>}
            </p>
          </motion.div>
          
          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index} 
                  className="h-64 rounded-lg bg-background/80 border border-border animate-pulse"
                />
              ))}
            </div>
          ) : (
            /* Notes Grid */
            <NotesGrid notes={filteredNotes} clearFilters={clearFilters} />
          )}
        </div>
      </main>
      
      {/* Mobile Filter Dialog */}
      <MobileFilterDialog 
        isOpen={isFilterDialogOpen}
        setIsOpen={setIsFilterDialogOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        categories={categories}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
      />
      
      <Footer />
    </div>
  );
};

export default Notes;
