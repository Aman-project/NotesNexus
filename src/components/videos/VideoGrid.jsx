import { memo } from "react";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FileQuestion, RefreshCw, VideoOff } from "lucide-react";

const VideoGrid = memo(({ videos, clearFilters, onVideoClick }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  if (videos.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20"
      >
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-8 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <VideoOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No videos found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any videos matching your current filters.
          </p>
          <Button 
            onClick={clearFilters}
            variant="outline" 
            className="gap-2 hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="videos-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      >
        {videos.map((video) => (
          <motion.div
            key={video.id}
            layout
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
            }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <VideoCard 
              video={video} 
              onClick={() => onVideoClick(video.youtubeId)} 
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
});

VideoGrid.displayName = "VideoGrid";

export default VideoGrid; 