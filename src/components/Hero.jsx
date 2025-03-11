import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoPlayerModal from "@/components/videos/VideoPlayerModal";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  const handlePlayVideo = (videoId) => {
    setActiveVideo(videoId);
  };

  const closeVideoPlayer = () => {
    setActiveVideo(null);
  };

  // Demo video ID - replace with your actual video ID
  const demoVideoId = "PkZNo7MFNFg"; // JavaScript Crash Course video

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/30">
        {/* Enhanced animated background elements - responsive positioning */}
        <div className="absolute top-20 right-0 w-2/3 h-64 bg-premium/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
        <div className="absolute -top-20 left-10 w-32 h-32 bg-note-blue/30 rounded-full filter blur-xl opacity-20 animate-float pointer-events-none"></div>
        <div className="absolute bottom-10 left-0 w-1/2 h-64 bg-note-purple/30 rounded-full filter blur-3xl opacity-20 animate-pulse-slow pointer-events-none"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-note-green/30 rounded-full filter blur-xl opacity-30 animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-premium/30"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            ></div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className={`w-full md:w-1/2 md:pr-6 lg:pr-12 space-y-4 sm:space-y-6 mb-10 sm:mb-12 md:mb-0 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="inline-block">
                <span className="inline-flex items-center rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gradient-to-r from-premium-light to-premium/10 text-premium border border-premium/20 shadow-sm">
                  <span className="mr-2 flex h-2 w-2 rounded-full bg-premium animate-pulse"></span>
                  Unlock your learning potential
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Elevate Your Learning with
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-premium to-premium-dark">
                  Premium Study Resources
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Access a comprehensive library of expertly crafted notes and educational videos designed to enhance your learning journey and help you achieve academic excellence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Link to="/notes" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-premium to-premium-dark hover:opacity-90 transition-all shadow-md hover:shadow-lg">
                    Explore Notes <ArrowRight className="ml-2 h-4 w-4 animate-bounce-x" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-premium/20 text-premium hover:bg-premium/5 transition-all"
                  onClick={() => handlePlayVideo(demoVideoId)}
                >
                  <Play className="mr-2 h-4 w-4" /> Watch Demo
                </Button>
              </div>
              
              <div className="flex items-center pt-4 sm:pt-6 text-xs sm:text-sm text-muted-foreground">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Join over <span className="font-medium text-foreground">10,000+</span> students worldwide</span>
              </div>
            </div>
            
            <div className={`w-full md:w-1/2 relative transition-all duration-1000 ease-out delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
                {/* Main Note Card with enhanced design */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 sm:p-6 border border-border z-20 relative transform hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="inline-block bg-gradient-to-r from-note-blue to-premium/20 text-xs font-medium rounded-full px-2 sm:px-3 py-1 mb-2 border border-note-blue/20">
                        Programming
                      </div>
                      <h3 className="text-base sm:text-lg font-medium">Introduction to React</h3>
                    </div>
                    <div className="bg-primary/10 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-premium" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 13.5C13.933 13.5 15.5 11.933 15.5 10C15.5 8.067 13.933 6.5 12 6.5C10.067 6.5 8.5 8.067 8.5 10C8.5 11.933 10.067 13.5 12 13.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.2955 10C20.2955 14.5819 16.5819 18.2955 12 18.2955C7.41811 18.2955 3.70454 14.5819 3.70454 10C3.70454 5.41811 7.41811 1.70454 12 1.70454C16.5819 1.70454 20.2955 5.41811 20.2955 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    Learn the fundamentals of React and how to build component-based UIs. This note covers state, props, and lifecycle methods.
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-muted-foreground">Updated Aug 15, 2023</span>
                    <Button variant="ghost" size="sm" className="text-xs px-2 text-premium hover:text-premium-dark hover:bg-premium-light/50">
                      Download
                    </Button>
                  </div>
                </div>
                
                {/* Decorative Note Cards with animations - hidden on smallest screens */}
                <div className="absolute top-8 -left-6 bg-gradient-to-br from-note-green to-note-green/60 rounded-2xl p-5 w-48 sm:w-64 h-24 sm:h-28 shadow-sm border border-border transform -rotate-6 z-10 opacity-70 hover:rotate-0 transition-all duration-300 hidden xs:block"></div>
                <div className="absolute -bottom-4 -right-6 bg-gradient-to-br from-note-yellow to-note-yellow/60 rounded-2xl p-5 w-48 sm:w-64 h-24 sm:h-28 shadow-sm border border-border transform rotate-6 z-10 opacity-70 hover:rotate-0 transition-all duration-300 hidden xs:block"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <VideoPlayerModal 
          videoId={activeVideo}
          onClose={closeVideoPlayer}
        />
      )}
    </>
  );
};

export default Hero;
