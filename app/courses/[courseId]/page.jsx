"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, Star, Play, Pause, RotateCcw, RotateCw, BookOpen, Clock, Users, Flame, BrainCircuit, Dribbble, Target, Sparkles, LayoutDashboard, ListFilter, MessageSquare, FileText, FolderOpen, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import SiteHeader from "@/components/site-header"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

// Mock Course Data - Ideally fetched from an API
const mockCourses = [
  {
    id: 1,
    title: "Poi Spinning Fundamentals",
    instructor: "Maya Chen",
    rating: 4.8,
    students: 1240,
    lessons: 12,
    overallProgress: 75,
    overview: {
      description: "Master the basics of poi spinning with flowing movements and fundamental techniques.",
      learnings: [
        "Basic techniques and proper form",
        "Timing and rhythm for smooth transitions",
        "Common mistakes and how to avoid them",
        "Practice exercises to build muscle memory",
      ],
    },
    content: [
      { id: "01", title: "Introduction to Poi", duration: "10:30", description: "Welcome to Poi Spinning Fundamentals!" },
      { id: "02", title: "Basic Poi Weaves", duration: "14:20" },
      { id: "03", title: "Planes and Rotations", duration: "16:45" },
      { id: "04", title: "Combinations & Flow", duration: "18:30" },
      { id: "05", title: "Advanced Techniques", duration: "12:00" },
      { id: "06", title: "Performance Tips", duration: "9:00" },
      { id: "07", title: "Safety Practices", duration: "7:00" },
      { id: "08", title: "Flow Theory", duration: "11:00" },
      { id: "09", title: "Poi Maintenance", duration: "5:00" },
      { id: "10", title: "Practice Drills", duration: "13:00" },
      { id: "11", title: "Troubleshooting", duration: "8:00" },
      { id: "12", title: "Final Project", duration: "20:00" },
    ],
  },
  {
    id: 2,
    title: "Fire Staff Mastery",
    instructor: "Alex Rivera",
    rating: 4.9,
    students: 856,
    lessons: 18,
    overallProgress: 30,
    overview: {
      description: "Advanced fire staff techniques for experienced flow artists seeking to elevate their practice.",
      learnings: [
        "Advanced spinning techniques",
        "Safety protocols for fire performance",
        "Choreography and transitions",
        "Prop care and maintenance",
      ],
    },
    content: [
      { id: "01", title: "Introduction to Fire Staff", duration: "15:00", description: "Welcome to Fire Staff Mastery!" },
      { id: "02", title: "Basic Grips and Spins", duration: "12:00" },
      { id: "03", title: "Flow Patterns", duration: "18:00" },
      { id: "04", title: "Advanced Isolations", duration: "20:00" },
      { id: "05", title: "Fire Safety", duration: "10:00" },
      { id: "06", title: "Staff Manipulation", duration: "16:00" },
      { id: "07", title: "Contact Staff Basics", duration: "14:00" },
      { id: "08", title: "Dragon Staff Moves", duration: "19:00" },
      { id: "09", title: "Performance Routines", duration: "22:00" },
      { id: "10", title: "Troubleshooting and Practice", duration: "11:00" },
      { id: "11", title: "Advanced Combos", duration: "17:00" },
      { id: "12", title: "Prop Maintenance", duration: "8:00" },
      { id: "13", title: "Fire Staff History", duration: "9:00" },
      { id: "14", title: "Fire Breathing Intro", duration: "25:00" },
      { id: "15", title: "Safety Gear Review", duration: "10:00" },
      { id: "16", title: "Advanced Fire Staff Flow", duration: "20:00" },
      { id: "17", title: "Fire Staff Choreography", duration: "18:00" },
      { id: "18", title: "Mastering the Fire Staff", duration: "22:00" },
    ],
  },
  {
    id: 3,
    title: "Rope Dart Flow",
    instructor: "Jin Wu",
    rating: 4.7,
    students: 642,
    lessons: 15,
    overallProgress: 50,
    overview: {
      description: "Explore the ancient art of rope dart with modern flow techniques and safety practices.",
      learnings: [
        "Basic rope dart handling",
        "Flow patterns and sequences",
        "Target practice and accuracy",
        "Safety guidelines and awareness",
      ],
    },
    content: [
      { id: "01", title: "Introduction to Rope Dart", duration: "12:00", description: "Welcome to Rope Dart Flow!" },
      { id: "02", title: "Basic Wraps and Unwraps", duration: "15:00" },
      { id: "03", title: "Figure 8s and Spirals", duration: "17:00" },
      { id: "04", title: "Stances and Footwork", duration: "10:00" },
      { id: "05", title: "Short Range Techniques", duration: "14:00" },
      { id: "06", title: "Long Range Techniques", duration: "18:00" },
      { id: "07", title: "Target Drills", duration: "13:00" },
      { id: "08", title: "Flow Combos", duration: "20:00" },
      { id: "09", title: "Safety and Awareness", duration: "9:00" },
      { id: "10", title: "Rope Dart Maintenance", duration: "6:00" },
      { id: "11", title: "Advanced Techniques", duration: "22:00" },
      { id: "12", title: "Performance Flow", duration: "16:00" },
      { id: "13", title: "Two-Handed Techniques", duration: "19:00" },
      { id: "14", title: "Rope Dart History", duration: "8:00" },
      { id: "15", title: "Mastering Rope Dart", duration: "25:00" },
    ],
  },
  {
    id: 4,
    title: "Hoop Dance Basics",
    instructor: "Luna Star",
    rating: 4.6,
    students: 1580,
    lessons: 10,
    overallProgress: 90,
    overview: {
      description: "Graceful movements and fundamental techniques for hoop dance beginners.",
      learnings: [
        "Basic waist hooping",
        "On-body and off-body moves",
        "Transitions and combinations",
        "Developing your unique flow style",
      ],
    },
    content: [
      { id: "01", title: "Introduction to Hoop Dance", duration: "8:00", description: "Welcome to Hoop Dance Basics!" },
      { id: "02", title: "Waist Hooping Fundamentals", duration: "10:00" },
      { id: "03", title: "Hand Hooping", duration: "12:00" },
      { id: "04", title: "On-Body Isolations", duration: "15:00" },
      { id: "05", title: "Off-Body Hooping", duration: "13:00" },
      { id: "06", title: "Hoop Dance Combinations", duration: "18:00" },
      { id: "07", title: "Hoop Tricks and Flow", duration: "20:00" },
      { id: "08", title: "Practice and Conditioning", duration: "9:00" },
      { id: "09", title: "Hoop Selection and Care", duration: "7:00" },
      { id: "10", title: "Your First Routine", duration: "25:00" },
    ],
  },
  {
    id: 5,
    title: "Contact Ball Meditation",
    instructor: "Zen Master Ko",
    rating: 4.9,
    students: 423,
    lessons: 8,
    overallProgress: 0,
    overview: {
      description: "Mindful movement and meditation through contact ball manipulation.",
      learnings: [
        "Basic techniques and proper form",
        "Timing and rhythm for smooth transitions",
        "Common mistakes and how to avoid them",
        "Practice exercises to build muscle memory",
      ],
    },
    content: [
      { id: "01", title: "Introduction to Contact Ball", duration: "10:30", description: "Mindful movement and meditation through contact ball manipulation." },
      { id: "02", title: "Basic Ball Manipulation", duration: "14:20" },
      { id: "03", title: "Body Rolls and Isolations", duration: "16:45" },
      { id: "04", title: "Advanced Contact Techniques", duration: "18:30" },
      { id: "05", title: "Multi-Ball Contact", duration: "15:00" },
      { id: "06", title: "Contact Ball Flow", duration: "17:00" },
      { id: "07", title: "Practice Drills", duration: "11:00" },
      { id: "08", title: "Performance Concepts", duration: "20:00" },
    ],
  },
  {
    id: 6,
    title: "Juggling Fundamentals",
    instructor: "Carlo Tosser",
    rating: 4.5,
    students: 2100,
    lessons: 14,
    overallProgress: 10,
    overview: {
      description: "Learn the art of juggling from basic throws to complex patterns.",
      learnings: [
        "Basic three-ball cascade",
        "Juggling patterns and tricks",
        "Recovery techniques",
        "Developing hand-eye coordination",
      ],
    },
    content: [
      { id: "01", title: "Introduction to Juggling", duration: "9:00", description: "Welcome to Juggling Fundamentals!" },
      { id: "02", title: "Two-Ball Juggling", duration: "11:00" },
      { id: "03", title: "Three-Ball Cascade", duration: "13:00" },
      { id: "04", title: "Columns and Fountains", duration: "15:00" },
      { id: "05", title: "Showers and Mills Mess", duration: "17:00" },
      { id: "06", title: "Juggling with Props", duration: "14:00" },
      { id: "07", title: "Juggling Theory", duration: "10:00" },
      { id: "08", title: "Practice Drills", duration: "12:00" },
      { id: "09", title: "Advanced Patterns", duration: "18:00" },
      { id: "10", title: "Passing and Sharing", duration: "16:00" },
      { id: "11", title: "Juggling for Performance", duration: "20:00" },
      { id: "12", title: "Troubleshooting Drops", duration: "8:00" },
      { id: "13", title: "Juggling Games", duration: "11:00" },
      { id: "14", title: "Mastering Juggling", duration: "22:00" },
    ],
  },
  {
    id: 7,
    title: "FLOWCHAKRA TUTORIALS",
    instructor: "Flow Chakra (YouTube)",
    rating: 5.0,
    students: 0,
    lessons: 6,
    overallProgress: 0,
    overview: {
      description: "A curated playlist of Flow Chakra tutorials from YouTube.",
      learnings: [
        "Basic wrist movement techniques",
        "Hand movement for juggling",
        "Intermediate and advanced flow moves",
        "Exploring vertical planes and more"
      ],
    },
    content: [
      { id: "01", title: "BASIC WRIST MOVEMENT 1", duration: "1:59", views: "14K", published: "2 years ago", url: "https://www.youtube.com/embed/TkZD1_mYbZo?rel=0" },
      { id: "02", title: "HAND MOVEMENT TO JUGGLE THE FLOWCHAKRA", duration: "1:44", views: "8.3K", published: "2 years ago", url: "https://www.youtube.com/embed/JXQnONhvy8U?rel=0" },
      { id: "03", title: "Intermediate moves - Flick the wrist", duration: "1:52", views: "10K", published: "2 years ago", url: "https://www.youtube.com/embed/YGvtt9B_3Wg?rel=0" },
      { id: "04", title: "Intermediate moves - Behind the back", duration: "1:54", views: "5.4K", published: "2 years ago", url: "https://www.youtube.com/embed/YdgE4k8IdiU?rel=0" },
      { id: "05", title: "Advanced - Double hand steering wheel", duration: "3:01", views: "10K", published: "1 year ago", url: "https://www.youtube.com/embed/TKBQwruJ_LA?rel=0" },
      { id: "06", title: "Exploring the vertical plane", duration: "2:56", views: "134", published: "8 days ago", url: "https://www.youtube.com/embed/1RGUYtlHPJg?rel=0" },
    ],
    isPlaylist: true,
    playlistId: "PLguV1vYQuOqh8LAm3CvlTpggarTWkkM3t"
  },
];

// Extract sidebar content to a component
function CourseSidebar({ course, currentLesson, setCurrentLesson }) {
  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex-shrink-0 p-6 overflow-y-auto h-full">
          <Link href="/" className="flex items-center text-gray-400 hover:text-purple-400 mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          <div className="mb-6">
            <div className="flex items-center justify-between text-gray-400 text-sm mb-2">
              <span>Overall Progress</span>
              <span>{course.overallProgress}%</span>
            </div>
            <Progress value={course.overallProgress} className="w-full bg-gray-700 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-purple-500 [&::-webkit-progress-value]:to-pink-500" />
            <p className="text-gray-500 text-xs mt-1">0 of {course.lessons} lessons completed</p>
          </div>
          <div className="space-y-4">
            {course.content.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${currentLesson.id === lesson.id ? "bg-purple-600/20 text-purple-300" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                onClick={() => setCurrentLesson(lesson)}
              >
                <span className="text-sm font-bold">{lesson.id}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{lesson.title}</p>
                  <p className="text-xs text-gray-500">{lesson.duration}</p>
                </div>
                {currentLesson.id === lesson.id && (
                  <span className="text-xs font-semibold text-purple-400 bg-purple-200/20 px-2 py-1 rounded-full">Current</span>
                )}
              </div>
            ))}
          </div>
        </div>
  )
}

export default function CourseContentPage({ params }) {
  const { courseId } = params;
  console.log('courseId from params:', courseId);
  const course = mockCourses.find((c) => c.id === parseInt(courseId));
  console.log('Parsed courseId:', parseInt(courseId));
  console.log('Found course:', course);

  if (!course) {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Course not found</div>;
  }

  if (course.isPlaylist) {
    const [currentLesson, setCurrentLesson] = useState(course.content[0]);
    const sidebarToggle = (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="bg-gray-900/80 backdrop-blur-sm border-gray-700 text-gray-100 hover:bg-gray-800 w-10 h-10 p-0 flex items-center justify-center">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open Course Content</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-gray-900 border-gray-800">
          <div className="w-80 bg-gray-900 border-r border-gray-800 flex-shrink-0 p-6 overflow-y-auto h-full">
            <Link href="/" className="flex items-center text-gray-400 hover:text-purple-400 mb-6">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.content.map((video, idx) => (
                <div
                  key={video.id}
                  className={`flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-colors ${currentLesson.id === video.id ? "bg-purple-600/20 text-purple-300" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                  onClick={() => setCurrentLesson(video)}
                >
                  <span className="font-medium">{idx + 1}. {video.title}</span>
                  <span className="text-xs text-gray-400">{video.duration} • {video.views} views • {video.published}</span>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <SiteHeader sidebarToggle={sidebarToggle} />
        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block h-full">
            <div className="w-80 bg-gray-900 border-r border-gray-800 flex-shrink-0 p-6 overflow-y-auto h-full">
              <Link href="/" className="flex items-center text-gray-400 hover:text-purple-400 mb-6">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Link>
              <h2 className="text-xl font-semibold mb-4">Course Content</h2>
              <div className="space-y-4">
                {course.content.map((video, idx) => (
                  <div
                    key={video.id}
                    className={`flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-colors ${currentLesson.id === video.id ? "bg-purple-600/20 text-purple-300" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                    onClick={() => setCurrentLesson(video)}
                  >
                    <span className="font-medium">{idx + 1}. {video.title}</span>
                    <span className="text-xs text-gray-400">{video.duration} • {video.views} views • {video.published}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Main Content Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            {/* Course Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-200">{course.title}</h1>
                <p className="text-gray-400 mt-1">
                  by {course.instructor} • <Star className="h-4 w-4 inline-block fill-yellow-400 text-yellow-400" /> {course.rating} • {course.students} students
                </p>
              </div>
              <span className="text-lg font-semibold text-purple-400">
                {course.overallProgress}% Complete <span className="text-gray-500 text-sm">Keep going!</span>
              </span>
            </div>
            {/* Video Player */}
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-8">
              <iframe
                width="100%"
                height="100%"
                src={currentLesson.url}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-lg"
              ></iframe>
            </div>
            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-b border-gray-700 rounded-none">
                <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Overview</TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Notes</TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Resources</TabsTrigger>
                <TabsTrigger value="community" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Community</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg">
                <p className="text-gray-400 mb-4">{course.overview.description}</p>
                <h3 className="text-lg font-semibold text-gray-300 mb-3">What you'll learn in this course:</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {course.overview.learnings.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="notes" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg">
                <h3 className="text-xl font-semibold text-gray-300">Notes</h3>
                <p className="text-gray-400 mt-2">This section is for your personal notes on the course content.</p>
              </TabsContent>
              <TabsContent value="resources" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg">
                <h3 className="text-xl font-semibold text-gray-300">Resources</h3>
                <p className="text-gray-400 mt-2">Here you'll find additional resources for this course.</p>
              </TabsContent>
              <TabsContent value="community" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg">
                <h3 className="text-xl font-semibold text-gray-300">Community</h3>
                <p className="text-gray-400 mt-2">Engage with other learners and ask questions here!</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }

  const [currentLesson, setCurrentLesson] = useState(course.content[0]);

  const sidebarToggle = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-gray-900/80 backdrop-blur-sm border-gray-700 text-gray-100 hover:bg-gray-800 w-10 h-10 p-0 flex items-center justify-center">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open Course Content</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 bg-gray-900 border-gray-800">
        <CourseSidebar course={course} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} />
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <SiteHeader sidebarToggle={sidebarToggle} />
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-full">
          <CourseSidebar course={course} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} />
        </div>
        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Course Header */} 
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-200">{course.title}</h1>
              <p className="text-gray-400 mt-1">
                by {course.instructor} • <Star className="h-4 w-4 inline-block fill-yellow-400 text-yellow-400" /> {course.rating} • {course.students} students
              </p>
            </div>
            <span className="text-lg font-semibold text-purple-400">
              {course.overallProgress}% Complete <span className="text-gray-500 text-sm">Keep going!</span>
            </span>
          </div>

          {/* Video Player */}
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-8">
            {/* Placeholder for video player */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="h-20 w-20 text-white/70" />
            </div>
            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <Play className="h-8 w-8" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <RotateCw className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Lesson Title */}
          <h2 className="text-2xl font-semibold mb-2">{currentLesson.title}</h2>
          <p className="text-gray-400 mb-8">{currentLesson.description}</p>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-b border-gray-700 rounded-none">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Overview</TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Notes</TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Resources</TabsTrigger>
              <TabsTrigger value="community" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Community</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg">
              <p className="text-gray-400 mb-4">{course.overview.description}</p>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">What you'll learn in this lesson:</h3>
              <ul className="list-none space-y-2">
                {course.overview.learnings.map((learning, index) => (
                  <li key={index} className="flex items-start text-gray-400">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{learning}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="notes" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg">
              <h3 className="text-xl font-semibold text-gray-300">Notes</h3>
              <p className="text-gray-400 mt-2">This section is for your personal notes on the course content.</p>
            </TabsContent>
            <TabsContent value="resources" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg">
              <h3 className="text-xl font-semibold text-gray-300">Resources</h3>
              <p className="text-gray-400 mt-2">Here you'll find additional resources for this course.</p>
            </TabsContent>
            <TabsContent value="community" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg">
              <h3 className="text-xl font-semibold text-gray-300">Community</h3>
              <p className="text-gray-400 mt-2">Engage with other learners and ask questions here!</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 