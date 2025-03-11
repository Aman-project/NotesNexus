import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

const VideoPlayerModal = ({ videoId, onClose }) => {
  const modalRef = useRef(null);

  // Handle click outside
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Add keyboard event listener to close modal on Escape key
  useEffect(() => {
    if (!videoId) return;
    
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Store original overflow style
    const originalOverflow = document.body.style.overflow;
    
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
    
    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    
    // Clean up
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoId, onClose]);

  return (
    <AnimatePresence>
      {videoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl bg-background rounded-xl shadow-xl overflow-hidden"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            
            <div className="relative pb-[56.25%] h-0 overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                className="absolute top-0 left-0 w-full h-full"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VideoPlayerModal; 