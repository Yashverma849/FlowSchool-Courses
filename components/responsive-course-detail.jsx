"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  CheckCircle,
  Circle,
  Star,
  Users,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const courseData = {
  title: "Poi Spinning Fundamentals",
  instructor: "Maya Chen",
  rating: 4.9,
  students: 1247,
  progress: 75,
  completedLessons: 2,
  totalLessons: 18,
  currentLesson: {
    id: 3,
    title: "Basic Stalls and Holds",
    duration: "15:45",
  },
  lessons: [
    {
      id: 1,
      title: "Welcome to Poi Spinning",
      duration: "8:30",
      completed: true,
    },
    {
      id: 2,
      title: "Choosing Your First Poi",
      duration: "12:15",
      completed: true,
    },
    {
      id: 3,
      title: "Basic Stalls and Holds",
      duration: "15:45",
      completed: false,
      current: true,
    },
    {
      id: 4,
      title: "Forward and Backward Weaves",
      duration: "18:20",
      completed: false,
    },
    {
      id: 5,
      title: "Butterfly Pattern Basics",
      duration: "16:55",
      completed: false,
    },
    {
      id: 6,
      title: "Introduction to Flowers",
      duration: "22:10",
      completed: false,
    },
  ],
}

function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(945) // 15:45 in seconds
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (value) => {
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value) => {
    setVolume(value[0])
    setIsMuted(value[0] === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const skipBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 10))
  }

  const skipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10))
  }

  // Simulate video progress
  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return duration
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  return (
    <div className="relative w-full">
      <div className="relative w-full aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 overflow-hidden">
        {/* Video Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
          <div className="text-center text-white max-w-full">
            <div className="mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <Play className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white ml-0.5" />
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 mb-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 border border-white/30 h-8 w-8 sm:h-10 sm:w-10 p-0"
                  onClick={skipBackward}
                >
                  <div className="flex flex-col items-center">
                    <SkipBack className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs hidden sm:block">10s</span>
                  </div>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/20 border border-white/30 h-12 w-12 sm:h-14 sm:w-14 p-0"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 border border-white/30 h-8 w-8 sm:h-10 sm:w-10 p-0"
                  onClick={skipForward}
                >
                  <div className="flex flex-col items-center">
                    <SkipForward className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs hidden sm:block">10s</span>
                  </div>
                </Button>
              </div>
            </div>
            <div className="max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
              <h2 className="text-sm sm:text-lg lg:text-2xl font-semibold mb-1 sm:mb-2 line-clamp-2">
                {courseData.currentLesson.title}
              </h2>
              <p className="text-xs sm:text-sm lg:text-lg opacity-90 mb-1 truncate">{courseData.title}</p>
              <p className="text-xs sm:text-sm opacity-75">with {courseData.instructor}</p>
            </div>
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-3 lg:p-4 transition-opacity">
          {/* Progress Bar */}
          <div className="mb-2 sm:mb-3">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleProgressChange}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-6 w-6 sm:h-8 sm:w-8 p-0"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>

            {/* 10s Skip Buttons */}
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-6 w-6 sm:h-8 sm:w-8 p-0 hidden xs:flex"
              onClick={skipBackward}
            >
              <SkipBack className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-6 w-6 sm:h-8 sm:w-8 p-0 hidden xs:flex"
              onClick={skipForward}
            >
              <SkipForward className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <div className="hidden sm:flex items-center gap-1 lg:gap-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-6 w-6 sm:h-8 sm:w-8 p-0"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
              <div className="w-12 sm:w-16 lg:w-24">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex-1" />

            <span className="text-xs sm:text-sm text-white font-medium whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="hidden sm:flex items-center gap-1 lg:gap-2">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 h-6 w-6 sm:h-8 sm:w-8 p-0">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 h-6 w-6 sm:h-8 sm:w-8 p-0">
                <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseSidebar({ course }) {
  const courseData = course || {
    title: "Poi Spinning Fundamentals",
    instructor: "Maya Chen",
    rating: 4.9,
    students: 1247,
    progress: 75,
    completedLessons: 2,
    totalLessons: 18,
    currentLesson: {
      id: 3,
      title: "Basic Stalls and Holds",
      duration: "15:45",
    },
    lessons: [
      { id: 1, title: "Welcome to Poi Spinning", duration: "8:30", completed: true },
      { id: 2, title: "Choosing Your First Poi", duration: "12:15", completed: true },
      { id: 3, title: "Basic Stalls and Holds", duration: "15:45", completed: false, current: true },
      { id: 4, title: "Forward and Backward Weaves", duration: "18:20", completed: false },
      { id: 5, title: "Butterfly Pattern Basics", duration: "16:55", completed: false },
      { id: 6, title: "Introduction to Flowers", duration: "22:10", completed: false },
    ],
  }

  // Generate dynamic lesson data based on the course
  const generateLessonsForCourse = (course) => {
    if (!course) return courseData.lessons

    const lessonTemplates = {
      "Poi Spinning Fundamentals": [
        { title: "Welcome to Poi Spinning", duration: "8:30" },
        { title: "Choosing Your First Poi", duration: "12:15" },
        { title: "Basic Stalls and Holds", duration: "15:45" },
        { title: "Forward and Backward Weaves", duration: "18:20" },
        { title: "Butterfly Pattern Basics", duration: "16:55" },
        { title: "Introduction to Flowers", duration: "22:10" },
      ],
      "Fire Staff Mastery": [
        { title: "Fire Safety Fundamentals", duration: "20:30" },
        { title: "Staff Selection and Preparation", duration: "15:45" },
        { title: "Basic Fire Staff Spins", duration: "18:20" },
        { title: "Advanced Spinning Techniques", duration: "22:15" },
        { title: "Fire Staff Transitions", duration: "19:40" },
        { title: "Performance and Safety", duration: "25:10" },
      ],
      "Contact Ball Basics": [
        { title: "Introduction to Contact Ball", duration: "10:30" },
        { title: "Basic Ball Manipulation", duration: "14:20" },
        { title: "Body Rolls and Isolations", duration: "16:45" },
        { title: "Advanced Contact Techniques", duration: "18:30" },
      ],
      "Rope Dart Fundamentals": [
        { title: "Rope Dart History and Safety", duration: "12:15" },
        { title: "Basic Grip and Stance", duration: "15:30" },
        { title: "Fundamental Movements", duration: "18:45" },
        { title: "Wrapping Techniques", duration: "20:20" },
        { title: "Advanced Patterns", duration: "22:40" },
      ],
      "Hoop Dance Flow": [
        { title: "Hoop Selection and Basics", duration: "11:20" },
        { title: "On-Body Movements", duration: "16:30" },
        { title: "Off-Body Techniques", duration: "18:15" },
        { title: "Flow and Transitions", duration: "20:45" },
      ],
      "Juggling Journey": [
        { title: "Juggling Fundamentals", duration: "9:30" },
        { title: "Three Ball Cascade", duration: "14:20" },
        { title: "Advanced Patterns", duration: "17:40" },
        { title: "Performance Skills", duration: "15:50" },
      ],
    }

    const lessons = lessonTemplates[course.title] || lessonTemplates["Poi Spinning Fundamentals"]

    return lessons.map((lesson, index) => ({
      id: index + 1,
      title: lesson.title,
      duration: lesson.duration,
      completed: index < Math.floor((course.progress / 100) * lessons.length),
      current: index === Math.floor((course.progress / 100) * lessons.length),
    }))
  }

  const dynamicCourseData = {
    ...courseData,
    title: course?.title || courseData.title,
    instructor: course?.instructor || courseData.instructor,
    rating: course?.rating || courseData.rating,
    students: course?.students || courseData.students,
    progress: course?.progress || courseData.progress,
    lessons: generateLessonsForCourse(course),
    currentLesson: {
      id: Math.floor(((course?.progress || 75) / 100) * (course?.lessons || 18)) + 1,
      title:
        generateLessonsForCourse(course)[
          Math.floor(((course?.progress || 75) / 100) * generateLessonsForCourse(course).length)
        ]?.title || "Current Lesson",
      duration:
        generateLessonsForCourse(course)[
          Math.floor(((course?.progress || 75) / 100) * generateLessonsForCourse(course).length)
        ]?.duration || "15:45",
    },
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">Course Content</span>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span className="font-medium">{dynamicCourseData.progress}%</span>
          </div>
          <Progress value={dynamicCourseData.progress} className="h-2" />
        </div>
        <p className="text-sm text-gray-500">
          {dynamicCourseData.completedLessons} of {dynamicCourseData.totalLessons} lessons completed
        </p>
      </div>

      <div className="space-y-2">
        {dynamicCourseData.lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              lesson.current ? "bg-gray-100 border border-gray-200" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex-shrink-0">
              {lesson.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : lesson.current ? (
                <Play className="h-5 w-5 text-gray-900" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 mb-1">{String(index + 1).padStart(2, "0")}</div>
              <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{lesson.title}</div>
              <div className="text-xs text-gray-500">{lesson.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ResponsiveCourseDetail({ onBackClick, course }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Use the passed course data or fall back to default
  const courseData = course || {
    title: "Poi Spinning Fundamentals",
    instructor: "Maya Chen",
    rating: 4.9,
    students: 1247,
    progress: 75,
    completedLessons: 2,
    totalLessons: 18,
    currentLesson: {
      id: 3,
      title: "Basic Stalls and Holds",
      duration: "15:45",
    },
    lessons: [
      { id: 1, title: "Welcome to Poi Spinning", duration: "8:30", completed: true },
      { id: 2, title: "Choosing Your First Poi", duration: "12:15", completed: true },
      { id: 3, title: "Basic Stalls and Holds", duration: "15:45", completed: false, current: true },
      { id: 4, title: "Forward and Backward Weaves", duration: "18:20", completed: false },
      { id: 5, title: "Butterfly Pattern Basics", duration: "16:55", completed: false },
      { id: 6, title: "Introduction to Flowers", duration: "22:10", completed: false },
    ],
  }

  // Generate dynamic lesson data based on the course
  const generateLessonsForCourse = (course) => {
    if (!course) return courseData.lessons

    const lessonTemplates = {
      "Poi Spinning Fundamentals": [
        { title: "Welcome to Poi Spinning", duration: "8:30" },
        { title: "Choosing Your First Poi", duration: "12:15" },
        { title: "Basic Stalls and Holds", duration: "15:45" },
        { title: "Forward and Backward Weaves", duration: "18:20" },
        { title: "Butterfly Pattern Basics", duration: "16:55" },
        { title: "Introduction to Flowers", duration: "22:10" },
      ],
      "Fire Staff Mastery": [
        { title: "Fire Safety Fundamentals", duration: "20:30" },
        { title: "Staff Selection and Preparation", duration: "15:45" },
        { title: "Basic Fire Staff Spins", duration: "18:20" },
        { title: "Advanced Spinning Techniques", duration: "22:15" },
        { title: "Fire Staff Transitions", duration: "19:40" },
        { title: "Performance and Safety", duration: "25:10" },
      ],
      "Contact Ball Basics": [
        { title: "Introduction to Contact Ball", duration: "10:30" },
        { title: "Basic Ball Manipulation", duration: "14:20" },
        { title: "Body Rolls and Isolations", duration: "16:45" },
        { title: "Advanced Contact Techniques", duration: "18:30" },
      ],
      "Rope Dart Fundamentals": [
        { title: "Rope Dart History and Safety", duration: "12:15" },
        { title: "Basic Grip and Stance", duration: "15:30" },
        { title: "Fundamental Movements", duration: "18:45" },
        { title: "Wrapping Techniques", duration: "20:20" },
        { title: "Advanced Patterns", duration: "22:40" },
      ],
      "Hoop Dance Flow": [
        { title: "Hoop Selection and Basics", duration: "11:20" },
        { title: "On-Body Movements", duration: "16:30" },
        { title: "Off-Body Techniques", duration: "18:15" },
        { title: "Flow and Transitions", duration: "20:45" },
      ],
      "Juggling Journey": [
        { title: "Juggling Fundamentals", duration: "9:30" },
        { title: "Three Ball Cascade", duration: "14:20" },
        { title: "Advanced Patterns", duration: "17:40" },
        { title: "Performance Skills", duration: "15:50" },
      ],
    }

    const lessons = lessonTemplates[course.title] || lessonTemplates["Poi Spinning Fundamentals"]

    return lessons.map((lesson, index) => ({
      id: index + 1,
      title: lesson.title,
      duration: lesson.duration,
      completed: index < Math.floor((course.progress / 100) * lessons.length),
      current: index === Math.floor((course.progress / 100) * lessons.length),
    }))
  }

  const dynamicCourseData = {
    ...courseData,
    title: course?.title || courseData.title,
    instructor: course?.instructor || courseData.instructor,
    rating: course?.rating || courseData.rating,
    students: course?.students || courseData.students,
    progress: course?.progress || courseData.progress,
    lessons: generateLessonsForCourse(course),
    currentLesson: {
      id: Math.floor(((course?.progress || 75) / 100) * (course?.lessons || 18)) + 1,
      title:
        generateLessonsForCourse(course)[
          Math.floor(((course?.progress || 75) / 100) * generateLessonsForCourse(course).length)
        ]?.title || "Current Lesson",
      duration:
        generateLessonsForCourse(course)[
          Math.floor(((course?.progress || 75) / 100) * generateLessonsForCourse(course).length)
        ]?.duration || "15:45",
    },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2" onClick={onBackClick}>
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Courses</span>
            </Button>
            <div>
              <h1 className="text-lg lg:text-xl font-semibold">{dynamicCourseData.title}</h1>
              <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-sm text-gray-500">
                <span>by {dynamicCourseData.instructor}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{dynamicCourseData.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{dynamicCourseData.students}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base lg:text-lg font-semibold">{dynamicCourseData.progress}% Complete</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Sidebar */}
        <div className="lg:hidden border-b border-gray-200 p-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Menu className="h-4 w-4" />
                Course Content
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-4">
              <CourseSidebar course={course} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 border-r border-gray-200 bg-white p-4">
          <CourseSidebar course={course} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Video Player */}
          <VideoPlayer />

          {/* Content Tabs */}
          <div className="p-4 lg:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="text-xs lg:text-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs lg:text-sm">
                  Notes
                </TabsTrigger>
                <TabsTrigger value="resources" className="text-xs lg:text-sm">
                  Resources
                </TabsTrigger>
                <TabsTrigger value="community" className="text-xs lg:text-sm">
                  Community
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{dynamicCourseData.currentLesson.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      In this lesson, you'll learn the fundamental stalls and holds that form the foundation of poi
                      spinning. We'll cover proper hand positioning, timing, and the muscle memory needed to execute
                      clean stalls. These techniques are essential for transitioning between different spinning patterns
                      and creating dynamic flow sequences.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">What you'll learn:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Basic stall positions and hand placement</li>
                      <li>• Timing and rhythm for smooth transitions</li>
                      <li>• Common mistakes and how to avoid them</li>
                      <li>• Practice exercises to build muscle memory</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <div className="text-center py-12 text-gray-500">
                  <p>Your notes will appear here as you take them during the lesson.</p>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <div className="text-center py-12 text-gray-500">
                  <p>Downloadable resources and materials will be available here.</p>
                </div>
              </TabsContent>

              <TabsContent value="community" className="mt-6">
                <div className="text-center py-12 text-gray-500">
                  <p>Join the discussion with other students learning this course.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
