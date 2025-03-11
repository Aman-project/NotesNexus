import { useState, useEffect, useCallback, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { videos } from "@/lib/data";
import VideoHeader from "@/components/videos/VideoHeader";
import VideoSearchBar from "@/components/videos/VideoSearchBar";
import VideoFilterBar from "@/components/videos/VideoFilterBar";
import VideoGrid from "@/components/videos/VideoGrid";
import MobileVideoFilterDialog from "@/components/videos/MobileVideoFilterDialog";
import VideoPlayerModal from "@/components/videos/VideoPlayerModal";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const Videos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  // Get unique categories - memoized to prevent recalculation
  const categories = useMemo(() => {
    return Array.from(new Set(videos.map((video) => video.category)));
  }, []);
  
  // Filter videos - memoized callback to prevent recreation
  const filterAndSortVideos = useCallback(() => {
    setIsLoading(true);
    
    // Use setTimeout to prevent UI blocking during filtering
    setTimeout(() => {
      let results = [...videos];
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(
          (video) =>
            video.title.toLowerCase().includes(query) ||
            video.description.toLowerCase().includes(query) ||
            video.category.toLowerCase().includes(query)
        );
      }
      
      // Filter by category
      if (selectedCategory && selectedCategory !== "all") {
        results = results.filter((video) => video.category === selectedCategory);
      }
      
      // Sort videos
      switch (sortOrder) {
        case "newest":
          results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          break;
        case "oldest":
          results.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
          break;
        case "a-z":
          results.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "z-a":
          results.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }
      
      setFilteredVideos(results);
      setIsLoading(false);
    }, 10); // Small delay to allow UI to update
  }, [searchQuery, selectedCategory, sortOrder]);
  
  // Apply filters when dependencies change
  useEffect(() => {
    filterAndSortVideos();
  }, [filterAndSortVideos]);
  
  // Close video player when location changes
  useEffect(() => {
    if (activeVideo) {
      setActiveVideo(null);
    }
  }, [location.pathname]);
  
  // Ensure body overflow is reset when component unmounts
  useEffect(() => {
    return () => {
      // Force reset body overflow when component unmounts
      document.body.style.overflow = "auto";
    };
  }, []);
  
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
  
  // Handle video play
  const handlePlayVideo = useCallback((youtubeId) => {
    setActiveVideo(youtubeId);
    // Smoothly scroll to the video player
    document.getElementById("video-player")?.scrollIntoView({ behavior: "smooth" });
  }, []);
  
  // Close video player
  const closeVideoPlayer = useCallback(() => {
    setActiveVideo(null);
  }, []);
  
  // Check if any filters are applied
  const hasFilters = searchQuery !== "" || selectedCategory !== "all" || sortOrder !== "newest";
  
  // Handle search query change with debounce
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
      <Navbar />
      
      {/* Header Section */}
      <VideoHeader 
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
      />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          {/* Mobile Search and Filter */}
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <div className="relative flex-grow">
              <VideoSearchBar
                searchQuery={searchQuery}
                setSearchQuery={handleSearchChange}
                className="w-full"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsFilterDialogOpen(true)}
              className="rounded-full h-10 w-10 flex items-center justify-center border-border hover:bg-secondary/80"
            >
              <SlidersHorizontal className="h-5 w-5 text-blue-500" />
            </Button>
          </div>
          
          {/* Filter Bar (Desktop) */}
          <div className="hidden md:block">
            <VideoFilterBar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              categories={categories}
              clearFilters={clearFilters}
              hasFilters={hasFilters}
            />
          </div>
          
          {/* Results Count */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <p className="text-sm md:text-base text-foreground/80">
              Showing <span className="font-semibold text-foreground">{filteredVideos.length}</span> {filteredVideos.length === 1 ? "video" : "videos"}
              {selectedCategory !== "all" && <span> in <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedCategory}</span></span>}
              {searchQuery && <span> for "<span className="font-semibold text-blue-600 dark:text-blue-400">{searchQuery}</span>"</span>}
            </p>
          </motion.div>
          
          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-border animate-pulse">
                  <div className="aspect-video bg-background/80" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-background/80 rounded w-3/4" />
                    <div className="h-3 bg-background/80 rounded w-full" />
                    <div className="h-3 bg-background/80 rounded w-2/3" />
                    <div className="pt-2 flex justify-between">
                      <div className="h-3 bg-background/80 rounded w-1/4" />
                      <div className="h-3 bg-background/80 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Videos Grid */
            <VideoGrid 
              videos={filteredVideos}
              clearFilters={clearFilters}
              onVideoClick={handlePlayVideo}
            />
          )}
        </div>
      </main>
      
      {/* Video Player Modal */}
      <VideoPlayerModal 
        videoId={activeVideo}
        onClose={closeVideoPlayer}
      />
      
      {/* Mobile Filter Dialog */}
      <MobileVideoFilterDialog
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

export default Videos;
