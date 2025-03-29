import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NoteViewModal = ({ isOpen, onClose, note }) => {
  if (!note) return null;

  // Map color string to Tailwind class and gradient (same as in NoteCard)
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
  
  const handleDownload = () => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-background border border-border w-full max-w-2xl rounded-xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={cn(
              "p-5 bg-gradient-to-br relative", 
              colorStyle.gradient
            )}>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <Badge 
                variant="outline" 
                className={cn(
                  "bg-white/80 dark:bg-background/80 text-xs font-medium border backdrop-blur-sm mb-2",
                  colorStyle.border,
                  colorStyle.text
                )}
              >
                <Tag className="h-3 w-3 mr-1" />
                {note.category}
              </Badge>
              
              <h2 className="text-2xl font-bold">{note.title}</h2>
              <p className="mt-2 text-foreground/80">{note.content}</p>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <div className="flex items-start mb-4">
                <FileText className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-base font-medium text-foreground/90">Contents:</p>
                  <ul className="text-sm text-foreground/80 mt-1 space-y-1 list-disc list-inside">
                    {note.contents && note.contents.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {note.tags && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {note.tags.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="text-xs font-medium bg-secondary/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-5 border-t border-border bg-muted/30">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {note.date || note.createdAt}
                </span>
                <Button
                  onClick={handleDownload}
                  className={cn(
                    "text-white",
                    colorStyle.text,
                    "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
                    "shadow-sm hover:shadow-md transition-all"
                  )}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoteViewModal; 