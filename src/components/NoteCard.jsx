import { useState, memo } from "react";
import { Download, FileText, ChevronDown, ChevronUp, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import NoteViewModal from "./NoteViewModal";

const NoteCard = memo(({ note }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Map color string to Tailwind class and gradient
  const colorMap = {
    "note-blue": {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      gradient: "from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-950/10",
      border: "border-blue-200 dark:border-blue-800/30",
      text: "text-blue-700 dark:text-blue-400",
      shadow: "shadow-blue-100/50 dark:shadow-blue-900/20"
    },
    "note-green": {
      bg: "bg-green-50 dark:bg-green-950/40",
      gradient: "from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-950/10",
      border: "border-green-200 dark:border-green-800/30",
      text: "text-green-700 dark:text-green-400",
      shadow: "shadow-green-100/50 dark:shadow-green-900/20"
    },
    "note-yellow": {
      bg: "bg-yellow-50 dark:bg-yellow-950/40",
      gradient: "from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-950/10",
      border: "border-yellow-200 dark:border-yellow-800/30",
      text: "text-yellow-700 dark:text-yellow-400",
      shadow: "shadow-yellow-100/50 dark:shadow-yellow-900/20"
    },
    "note-purple": {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      gradient: "from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-950/10",
      border: "border-purple-200 dark:border-purple-800/30",
      text: "text-purple-700 dark:text-purple-400",
      shadow: "shadow-purple-100/50 dark:shadow-purple-900/20"
    },
    "note-pink": {
      bg: "bg-pink-50 dark:bg-pink-950/40",
      gradient: "from-pink-100 to-pink-50 dark:from-pink-900/20 dark:to-pink-950/10",
      border: "border-pink-200 dark:border-pink-800/30",
      text: "text-pink-700 dark:text-pink-400",
      shadow: "shadow-pink-100/50 dark:shadow-pink-900/20"
    },
    "note-orange": {
      bg: "bg-orange-50 dark:bg-orange-950/40",
      gradient: "from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-950/10",
      border: "border-orange-200 dark:border-orange-800/30",
      text: "text-orange-700 dark:text-orange-400",
      shadow: "shadow-orange-100/50 dark:shadow-orange-900/20"
    },
  };
  
  const colorStyle = colorMap[note.color] || colorMap["note-blue"];
  
  // Map note title to PDF filename
  const getPdfFilename = (title) => {
    const titleMap = {
      "Introduction to Html": "Html.pdf",
      "Modern JavaScript Concepts": "javascript.pdf",
      "Advanced CSS Techniques": "CSS_Complete_Notes.pdf",
      "C Language Principles": "C_Complete_Notes.pdf",
      "Python Fundamentals": "Python.pdf",
      "Data Structures and Algorithms": "DSA.pdf"
    };
    
    return titleMap[title] || null;
  };
  
  const handleDownload = (e) => {
    e.stopPropagation(); // Prevent card click
    const pdfFilename = getPdfFilename(note.title);
    if (pdfFilename) {
      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = `/Notes/${pdfFilename}`;
      link.download = pdfFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleCardClick = () => {
    setIsModalOpen(true);
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full cursor-pointer"
        layout
        onClick={handleCardClick}
      >
        <Card className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out border h-full flex flex-col",
          expanded ? `shadow-lg ${colorStyle.shadow}` : "shadow-sm",
          isHovered ? `shadow-md ${colorStyle.shadow}` : "",
          colorStyle.border,
          "backdrop-blur-sm bg-white/90 dark:bg-gray-900/90"
        )}>
          <CardHeader className={cn(
            "p-3 sm:p-4 pb-2 bg-gradient-to-br", 
            colorStyle.gradient
          )}>
            <div className="flex justify-between items-start">
              <Badge 
                variant="outline" 
                className={cn(
                  "bg-white/80 dark:bg-background/80 text-xs font-medium border backdrop-blur-sm",
                  colorStyle.border,
                  colorStyle.text
                )}
              >
                <Tag className="h-3 w-3 mr-1" />
                {note.category}
              </Badge>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/80 dark:bg-background/80 backdrop-blur-sm",
                    colorStyle.text
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                >
                  {expanded ? <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />}
                </Button>
              </motion.div>
            </div>
            <h3 className="font-semibold text-base sm:text-lg mt-2 line-clamp-2 text-foreground/90 group-hover:text-foreground transition-colors">{note.title}</h3>
          </CardHeader>
          
          <CardContent className="p-3 sm:p-4 pt-2 flex-grow">
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground/90 mb-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>{note.date}</span>
            </div>
            
            <p className="text-sm sm:text-base text-foreground/80 line-clamp-2">
              {note.description}
            </p>
            
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 pt-3 border-t border-border"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm sm:text-base font-medium text-foreground/90">Contents:</p>
                        <ul className="text-sm text-foreground/80 mt-1 space-y-1 list-disc list-inside">
                          {note.contents.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.map((tag, index) => (
                        <Badge 
                          key={index}
                          variant="secondary"
                          className="text-xs font-medium bg-secondary/50 hover:bg-secondary/70 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="p-3 sm:p-4 pt-2 border-t border-border mt-auto">
            <div className="w-full flex justify-between items-center">
              <span className="text-xs font-medium text-muted-foreground/90">
                {note.pages} pages
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "text-xs font-medium h-7 sm:h-8 px-2 rounded-full transition-all",
                  colorStyle.text,
                  "hover:scale-105",
                  "bg-primary/10 hover:bg-primary/20"
                )}
                onClick={handleDownload}
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Download
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      
      <NoteViewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={note}
      />
    </>
  );
});

NoteCard.displayName = "NoteCard";

export default NoteCard;
