import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, SlidersHorizontal, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notes as dummyNotes } from "@/lib/data"; // Keep as fallback
import FilterBar from "@/components/notes/FilterBar";
import MobileFilterDialog from "@/components/notes/MobileFilterDialog";
import NotesGrid from "@/components/notes/NotesGrid";
import NotesHeader from "@/components/notes/NotesHeader";
import { motion } from "framer-motion";
import { Link, Routes, Route } from "react-router-dom";
import UploadNote from "@/components/notes/UploadNote";
import { getAllNotes, getFilePreview } from "@/lib/appwrite";
import { useToast } from "@/hooks/use-toast";

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const { toast } = useToast();
  
  // Fetch notes from Appwrite and combine with dummy notes
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const appwriteNotes = await getAllNotes();
        
        // Transform appwrite notes to match our app's format
        let formattedAppwriteNotes = [];
        if (appwriteNotes && appwriteNotes.length > 0) {
          formattedAppwriteNotes = appwriteNotes.map(note => {
            const createdAt = note.uploadedAt || note.$createdAt;
            const dateObj = new Date(createdAt);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            });
            
            return {
              id: note.$id,
              title: note.title,
              category: note.category,
              description: note.description,
              fileId: note.fileId,
              fileName: note.fileName,
              createdAt: createdAt,
              date: formattedDate,
              // Generate a random color for the note
              color: getRandomNoteColor(),
              // Set default values for fields not in Appwrite
              contents: ["PDF Document"],
              pages: "PDF",
              tags: [note.category, "PDF"],
              // Override standard download with appwrite file
              isAppwriteFile: true
            };
          });
          
          console.log("Notes fetched from Appwrite:", formattedAppwriteNotes);
        }
        
        // Combine appwrite notes with dummy notes
        const combinedNotes = [...formattedAppwriteNotes, ...dummyNotes];
        setAllNotes(combinedNotes);
        setFetchError(null);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setFetchError("Failed to fetch uploaded notes. Showing sample data only.");
        // Use dummy data as fallback
        setAllNotes(dummyNotes);
        
        toast({
          title: "Error fetching notes",
          description: "Could not load notes from the server. Showing sample data only.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [toast]);
  
  // Get random note color for styling
  const getRandomNoteColor = () => {
    const colors = ["note-blue", "note-green", "note-yellow", "note-purple", "note-pink", "note-orange"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  
  // Get unique categories - memoized to prevent recalculation
  const categories = useMemo(() => {
    return Array.from(new Set(allNotes.map((note) => note.category)));
  }, [allNotes]);
  
  // Filter and sort notes - memoized callback to prevent recreation
  const filterAndSortNotes = useCallback(() => {
    setIsLoading(true);
    
    // Use setTimeout to prevent UI blocking during filtering
    setTimeout(() => {
      let results = [...allNotes];
      
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
  }, [searchQuery, selectedCategory, sortOrder, allNotes]);
  
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
      
      <Routes>
        <Route path="/" element={
          <>
            <NotesHeader 
              searchQuery={searchQuery} 
              setSearchQuery={handleSearchChange} 
            >
              <Link to="/notes/upload">
                <Button className="hidden md:flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Note
                </Button>
              </Link>
            </NotesHeader>
            
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
                  <Link to="/notes/upload">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="rounded-full h-10 w-10 flex items-center justify-center"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </Link>
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
                
                {/* Error Message */}
                {fetchError && (
                  <motion.div 
                    className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 text-yellow-800 dark:text-yellow-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{fetchError}</p>
                  </motion.div>
                )}
                
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
          </>
        } />
        <Route path="upload" element={<UploadNote />} />
      </Routes>
      
      <Footer />
    </div>
  );
};

export default Notes;
