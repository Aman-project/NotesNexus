// Mock notes data
export const notes = [
  {
    id: "1",
    title: "Introduction to Html",
    excerpt: "Learn the fundamentals of HTML and how to structure web content effectively.",
    content: "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It provides the basic structure of sites using a system of tags and attributes to define different types of content like headings, paragraphs, images, and links.",
    category: "Programming", 
    color: "note-blue",
    createdAt: "2023-08-15",
    date: "Aug 15, 2023",
    description: "Comprehensive guide covering all HTML fundamentals",
    pages: 42,
    downloadUrl: "/Notes/Html.pdf",
    contents: [
      "Introduction to HTML structure",
      "HTML elements and attributes",
      "Forms and input types",
      "Semantic HTML5 elements",
      "Accessibility best practices"
    ],
    tags: ["HTML", "Web Development", "Frontend", "Beginner"]
  },
  {
    id: "2",
    title: "Modern JavaScript Concepts",
    excerpt: "Explore advanced JavaScript concepts including ES6 features and beyond.",
    content: "ES6 introduced many features like arrow functions, destructuring, spread operators, and more that revolutionized JavaScript development. This comprehensive guide covers all the modern JavaScript concepts you need to know to build robust web applications.",
    category: "Programming",
    color: "note-green",
    createdAt: "2023-09-20",
    date: "Sep 20, 2023",
    description: "Advanced JavaScript concepts and best practices",
    pages: 78,
    downloadUrl: "/Notes/javascript.pdf",
    contents: [
      "ES6+ features and syntax",
      "Promises and async/await",
      "Modern module patterns",
      "Functional programming concepts",
      "Performance optimization"
    ],
    tags: ["JavaScript", "ES6", "Web Development", "Advanced"]
  },
  {
    id: "3",
    title: "Advanced CSS Techniques",
    excerpt: "Master modern CSS with flexbox, grid, and CSS custom properties.",
    content: "CSS has evolved significantly with modern layout techniques like Flexbox and Grid that make complex layouts simpler to implement. This guide covers advanced CSS concepts to help you create beautiful, responsive designs with ease.",
    category: "Design",
    color: "note-purple",
    createdAt: "2023-10-05",
    date: "Oct 5, 2023",
    description: "Modern CSS layout and styling techniques",
    pages: 65,
    downloadUrl: "/Notes/CSS_Complete_Notes.pdf",
    contents: [
      "Flexbox and Grid layouts",
      "CSS custom properties",
      "Advanced animations and transitions",
      "Responsive design patterns",
      "CSS architecture (BEM, SMACSS, etc.)"
    ],
    tags: ["CSS", "Web Design", "Frontend", "Responsive"]
  },
  {
    id: "4",
    title: "C Language Principles",
    excerpt: "Understand the core principles of effective programming in C.",
    content: "Good programming in C follows principles like modularity, data abstraction, and efficient memory management to create reliable and maintainable software. This comprehensive guide covers everything from basic syntax to advanced memory management techniques.",
    category: "Programming",
    color: "note-pink",
    createdAt: "2023-11-12",
    date: "Nov 12, 2023",
    description: "Complete guide to C programming language",
    pages: 94,
    downloadUrl: "/Notes/C_Complete_Notes.pdf",
    contents: [
      "C syntax and data types",
      "Memory management and pointers",
      "Data structures implementation",
      "File I/O operations",
      "Debugging and optimization techniques"
    ],
    tags: ["C", "Programming", "System Programming", "Memory Management"]
  },
  {
    id: "5",
    title: "Python Fundamentals",
    excerpt: "Get started with Python and learn the basics of programming.",
    content: "Python is a versatile programming language that emphasizes readability and simplicity, making it an excellent choice for beginners and experienced developers alike. This guide covers Python fundamentals from basic syntax to more advanced concepts like decorators and context managers.",
    category: "Programming",
    color: "note-yellow",
    createdAt: "2023-12-01",
    date: "Dec 1, 2023",
    description: "Beginner-friendly introduction to Python",
    pages: 58,
    downloadUrl: "/Notes/Python.pdf",
    contents: [
      "Python syntax and data structures",
      "Functions and object-oriented programming",
      "Working with modules and packages",
      "File operations and error handling",
      "Introduction to popular libraries"
    ],
    tags: ["Python", "Programming", "Data Science", "Beginner"]
  },
  {
    id: "6",
    title: "Data Structures and Algorithms",
    excerpt: "Dive into the world of data structures and algorithms to enhance your programming skills.",
    content: "Understanding data structures and algorithms is crucial for efficient problem-solving and optimizing code performance. This course covers essential concepts like arrays, linked lists, trees, sorting algorithms, and more, with practical examples to help you apply these concepts in real-world scenarios.",
    category: "Programming",
    color: "note-orange",
    createdAt: "2024-01-18",
    date: "Jan 18, 2024",
    description: "Comprehensive guide to DSA concepts",
    pages: 120,
    downloadUrl: "/Notes/DSA.pdf",
    contents: [
      "Array and linked list implementations",
      "Trees, graphs, and hash tables",
      "Sorting and searching algorithms",
      "Algorithm analysis and big O notation",
      "Dynamic programming and greedy algorithms"
    ],
    tags: ["DSA", "Algorithms", "Computer Science", "Interview Prep"]
  },
];

// Mock videos data
export const videos = [
  {
    id: "1",
    title: "Getting Started with React",
    description: "Learn the fundamentals of React in this beginner-friendly tutorial.",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    youtubeId: "w7ejDZ8SWv8",
    category: "React",
    duration: "12:45",
    publishedAt: "2023-08-15",
  },
  {
    id: "2",
    title: "JavaScript Array Methods",
    description: "Master JavaScript array methods like map, filter, and reduce.",
    thumbnailUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    youtubeId: "R8rmfD9Y5-c",
    category: "JavaScript",
    duration: "15:32",
    publishedAt: "2023-09-20",
  },
  {
    id: "3",
    title: "CSS Grid Layout Tutorial",
    description: "Learn how to create complex layouts with CSS Grid.",
    thumbnailUrl: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    youtubeId: "jV8B24rSN5o",
    category: "CSS",
    duration: "18:10",
    publishedAt: "2023-10-05",
  },
  {
    id: "4",
    title: "TypeScript Crash Course",
    description: "Get up to speed with TypeScript in less than 30 minutes.",
    thumbnailUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    youtubeId: "BCg4U1FzODs",
    category: "TypeScript",
    duration: "27:22",
    publishedAt: "2023-11-12",
  },
  {
    id: "5",
    title: "React Hooks Explained",
    description: "Understand how to use React Hooks effectively in your applications.",
    thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    youtubeId: "TNhaISOUy6Q",
    category: "React",
    duration: "21:15",
    publishedAt: "2023-12-01",
  },
  {
    id: "6",
    title: "Build a Portfolio with Tailwind CSS",
    description: "Create a beautiful portfolio website using Tailwind CSS.",
    thumbnailUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    youtubeId: "4wGmylafgM4",
    category: "CSS",
    duration: "34:48",
    publishedAt: "2024-01-18",
  },
];

// Features for the landing page
export const features = [
  {
    title: "Comprehensive Notes",
    description: "Access our extensive library of well-structured notes covering a wide range of topics.",
    icon: "FileText",
  },
  {
    title: "Video Tutorials",
    description: "Watch detailed video explanations to enhance your understanding of complex subjects.",
    icon: "Video",
  },
  {
    title: "Downloadable Content",
    description: "Download notes for offline access and study anywhere, anytime without internet connection.",
    icon: "Download",
  },
  {
    title: "Regularly Updated",
    description: "Our content is frequently updated to ensure you have access to the latest information.",
    icon: "RefreshCw",
  },
];

// Testimonials for the landing page
export const testimonials = [
  {
    quote: "I love how well-organized and concise the notes are. Saved me hours of study time!",
    author: "Anmol Sharma",
    role: "Medical Student",
  },
  {
    quote: "These notes transformed my study habits and improved my grades significantly.",
    author: "Aman Usmani",
    role: "Computer Science Student",
  },
  {
    quote: "The combination of notes and videos helped me understand complex topics with ease.",
    author: "Aryan",
    role: "Engineering Major",
  },
  {
    quote: "The notes were a game-changer for me. They made learning complex topics a breeze.",
    author: "Alok",
    role: "Engineering Student",
  },
  {
    quote: "The videos were a game-changer for me. They made learning complex topics a breeze.",
    author: "Anuj Verma",
    role: "Engineering Student",
  },
];
