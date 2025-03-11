import { useState, memo } from "react";
import { Play, Clock, Tag, Calendar, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const VideoCard = memo(({ video, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Category color mapping
  const categoryColors = {
    "Programming": {
      bg: "bg-blue-100/50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800/30",
      playBg: "bg-blue-500",
      shadow: "shadow-blue-200/30 dark:shadow-blue-900/20"
    },
    "Mathematics": {
      bg: "bg-green-100/50 dark:bg-green-900/20",
      text: "text-green-700 dark:text-green-400",
      border: "border-green-200 dark:border-green-800/30",
      playBg: "bg-green-500",
      shadow: "shadow-green-200/30 dark:shadow-green-900/20"
    },
    "Science": {
      bg: "bg-purple-100/50 dark:bg-purple-900/20",
      text: "text-purple-700 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800/30",
      playBg: "bg-purple-500",
      shadow: "shadow-purple-200/30 dark:shadow-purple-900/20"
    },
    "History": {
      bg: "bg-yellow-100/50 dark:bg-yellow-900/20",
      text: "text-yellow-700 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800/30",
      playBg: "bg-yellow-500",
      shadow: "shadow-yellow-200/30 dark:shadow-yellow-900/20"
    },
    "Language": {
      bg: "bg-pink-100/50 dark:bg-pink-900/20",
      text: "text-pink-700 dark:text-pink-400",
      border: "border-pink-200 dark:border-pink-800/30",
      playBg: "bg-pink-500",
      shadow: "shadow-pink-200/30 dark:shadow-pink-900/20"
    },
    "React": {
      bg: "bg-blue-100/50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800/30",
      playBg: "bg-blue-500",
      shadow: "shadow-blue-200/30 dark:shadow-blue-900/20"
    },
    "JavaScript": {
      bg: "bg-yellow-100/50 dark:bg-yellow-900/20",
      text: "text-yellow-700 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800/30",
      playBg: "bg-yellow-500",
      shadow: "shadow-yellow-200/30 dark:shadow-yellow-900/20"
    },
    "CSS": {
      bg: "bg-purple-100/50 dark:bg-purple-900/20",
      text: "text-purple-700 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800/30",
      playBg: "bg-purple-500",
      shadow: "shadow-purple-200/30 dark:shadow-purple-900/20"
    },
    "TypeScript": {
      bg: "bg-blue-100/50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800/30",
      playBg: "bg-blue-500",
      shadow: "shadow-blue-200/30 dark:shadow-blue-900/20"
    }
  };

  const colorStyle = categoryColors[video.category] || {
    bg: "bg-gray-100/50 dark:bg-gray-800/20",
    text: "text-gray-700 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700/30",
    playBg: "bg-blue-500",
    shadow: "shadow-gray-200/30 dark:shadow-gray-800/20"
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
      layout
    >
      <Card 
        className={cn(
          "overflow-hidden border h-full flex flex-col backdrop-blur-sm bg-white/90 dark:bg-gray-900/90",
          "transition-all duration-300 cursor-pointer group",
          isHovered ? `shadow-lg ${colorStyle.shadow}` : "shadow-sm"
        )}
        onClick={() => onClick(video.youtubeId)}
      >
        {/* Thumbnail with play button overlay */}
        <div className="relative aspect-video overflow-hidden">
          {/* Optimized image loading with blur placeholder */}
          <div className={cn("absolute inset-0", colorStyle.bg, "animate-pulse")} />
          <img 
            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onLoad={(e) => {
              e.target.previousSibling.classList.remove("animate-pulse");
            }}
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
            <motion.div 
              className={`rounded-full ${colorStyle.playBg} p-2 sm:p-3`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-white" />
            </motion.div>
          </div>
          
          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <Badge 
              className={cn(
                "text-xs font-medium px-2 py-0.5 bg-white/90 dark:bg-black/70 backdrop-blur-sm",
                colorStyle.text
              )}
            >
              <Tag className="h-3 w-3 mr-1" />
              {video.category}
            </Badge>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="text-xs font-medium px-1.5 py-0.5 bg-black/70 text-white backdrop-blur-sm">
              {video.duration}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-3 sm:p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2 text-foreground/90 group-hover:text-premium transition-colors duration-200">
            {video.title}
          </h3>
          
          <p className="text-sm sm:text-base text-foreground/80 mb-3 line-clamp-2">
            {video.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-2 text-xs font-medium text-muted-foreground/90">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span>{formatDate(video.date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {video.views && (
                <div className="flex items-center">
                  <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                  <span>{video.views}</span>
                </div>
              )}
              <span className={cn(
                "text-xs font-medium px-1.5 py-0.5 rounded-full",
                colorStyle.bg,
                colorStyle.text
              )}>
                {video.level}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

VideoCard.displayName = "VideoCard";

export default VideoCard;
