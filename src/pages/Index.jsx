import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, FileText, Video, Download, RefreshCw, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import NoteCard from "@/components/NoteCard";
import VideoCard from "@/components/VideoCard";
import { notes, videos, features, testimonials } from "@/lib/data";

const Index = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [visibleSections, setVisibleSections] = useState({
    features: false,
    notes: false,
    videos: false,
    testimonials: false,
    cta: false
  });
  
  useEffect(() => {
    // Set up intersection observer for animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);
  
  const handlePlayVideo = (youtubeId) => {
    setActiveVideo(youtubeId);
    // Smoothly scroll to the video player
    document.getElementById("video-player")?.scrollIntoView({ behavior: "smooth" });
  };
  
  const closeVideoPlayer = () => {
    setActiveVideo(null);
  };
  
  // Feature icons mapping with enhanced icons
  const featureIcons = {
    "FileText": <FileText className="h-5 w-5" />,
    "Video": <Video className="h-5 w-5" />,
    "Download": <Download className="h-5 w-5" />,
    "RefreshCw": <RefreshCw className="h-5 w-5" />,
    "Users": <Users className="h-5 w-5" />,
    "BookOpen": <BookOpen className="h-5 w-5" />,
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Video Player (Conditional Render) */}
        {activeVideo && (
          <div 
            id="video-player" 
            className="relative bg-black py-12 overflow-hidden scroll-mt-24"
          >
            <div className="max-w-4xl mx-auto px-6 md:px-10">
              <button 
                onClick={closeVideoPlayer}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors duration-200"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
                <iframe 
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                  className="absolute top-0 left-0 w-full h-full"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
        
        {/* Features Section */}
        <section 
          id="features" 
          className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/3 h-64 bg-premium/10 rounded-full filter blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-48 bg-note-blue/10 rounded-full filter blur-3xl opacity-20 animate-pulse-slow pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
            <div className={`text-center mb-10 sm:mb-16 max-w-3xl mx-auto transition-all duration-1000 ease-out ${visibleSections.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge variant="outline" className="mb-3 px-3 py-1.5 bg-premium/5 text-premium border-premium/20">Features</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Everything you need to excel</h2>
              <p className="text-base sm:text-lg text-muted-foreground">Our platform provides comprehensive tools and resources to support your learning journey and help you achieve your academic goals.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`bg-background rounded-xl p-5 sm:p-6 md:p-8 shadow-md border border-border hover:shadow-xl transition-all duration-300 group ${visibleSections.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-premium-light to-premium/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-premium">
                      {featureIcons[feature.icon]}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3 group-hover:text-premium transition-colors duration-300">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Notes Preview Section */}
        <section id="notes" className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-40 right-20 w-72 h-72 bg-note-green/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 md:mb-12 transition-all duration-1000 ease-out ${visibleSections.notes ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div>
                <Badge variant="outline" className="mb-3 px-3 py-1.5 bg-note-green/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">Notes Library</Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Featured Notes</h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">Browse our collection of carefully crafted notes to enhance your learning experience and boost your academic performance.</p>
              </div>
              <Link to="/notes" className="mt-4 md:mt-0">
                <Button variant="outline" className="gap-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-note-green/20">
                  View All Notes
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {notes.slice(0, 3).map((note, index) => (
                <div 
                  key={note.id} 
                  className={`transition-all duration-700 ease-out ${visibleSections.notes ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
            
            <div className={`mt-8 sm:mt-10 md:mt-12 text-center transition-all duration-1000 ease-out delay-500 ${visibleSections.notes ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link to="/notes">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 transition-all shadow-md hover:shadow-lg">
                  Explore All Notes
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Video Preview Section */}
        <section id="videos" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-20 left-0 w-1/3 h-64 bg-note-blue/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 md:mb-12 transition-all duration-1000 ease-out ${visibleSections.videos ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div>
                <Badge variant="outline" className="mb-3 px-3 py-1.5 bg-note-blue/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">Video Tutorials</Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Featured Videos</h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">Watch our educational videos to deepen your understanding of various topics and enhance your learning experience.</p>
              </div>
              <Link to="/videos" className="mt-4 md:mt-0">
                <Button variant="outline" className="gap-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-note-blue/20">
                  View All Videos
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {videos.slice(0, 3).map((video, index) => (
                <div 
                  key={video.id} 
                  className={`transition-all duration-700 ease-out ${visibleSections.videos ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <VideoCard video={video} onClick={handlePlayVideo} />
                </div>
              ))}
            </div>
            
            <div className={`mt-8 sm:mt-10 md:mt-12 text-center transition-all duration-1000 ease-out delay-500 ${visibleSections.videos ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link to="/videos">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 transition-all shadow-md hover:shadow-lg">
                  Explore All Videos
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/4 h-48 bg-note-purple/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-64 bg-premium/10 rounded-full filter blur-3xl opacity-20 animate-pulse-slow pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className={`text-center mb-16 transition-all duration-1000 ease-out ${visibleSections.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge variant="outline" className="mb-3 px-3 py-1.5 bg-note-purple/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800">Testimonials</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">What Our Users Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Discover how NotesNexus has helped students improve their learning experience and achieve academic success.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className={`bg-background rounded-xl p-8 shadow-md border border-border hover:shadow-xl transition-all duration-300 group ${visibleSections.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="mb-6 text-purple-500 group-hover:scale-110 transition-transform duration-300 origin-left">
                    <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="mb-6 text-foreground italic leading-relaxed">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3 text-purple-600 dark:text-purple-300">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section id="cta" className="py-16 sm:py-20 md:py-24 bg-[#3050d0] text-white relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-1/3 h-64 bg-blue-400/20 rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-64 bg-blue-500/20 rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 text-center relative z-10">
            <div className={`transition-all duration-1000 ease-out ${visibleSections.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready to enhance your learning experience?
              </h2>
              
              <p className="text-base sm:text-lg text-blue-100 mb-10 max-w-3xl mx-auto">
                Join thousands of students who are already benefiting from our comprehensive learning resources and take your academic journey to the next level.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="w-full sm:w-auto bg-black hover:bg-black/80 text-white transition-all shadow-lg hover:shadow-xl">
                    Get Started Now
                  </Button>
                </Link>
                <Link to="/notes">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10 transition-all">
                    Explore Resources
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
