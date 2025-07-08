"use client"

import { useState } from "react"
import {
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Settings,
  Maximize,
  CheckCircle,
  Circle,
  Star,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export function CourseDetail() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration] = useState("15:45")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{courseData.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>by {courseData.instructor}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{courseData.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{courseData.students}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{courseData.progress}% Complete</div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <ChevronLeft className="h-4 w-4" />
              <span className="font-medium">Course Content</span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span className="font-medium">{courseData.progress}%</span>
              </div>
              <Progress value={courseData.progress} className="h-2" />
            </div>
            <p className="text-sm text-gray-500">
              {courseData.completedLessons} of {courseData.totalLessons} lessons completed
            </p>
          </div>

          <div className="p-4 space-y-2">
            {courseData.lessons.map((lesson, index) => (
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
                  <div className="text-sm font-medium text-gray-900 mb-1">{lesson.title}</div>
                  <div className="text-xs text-gray-500">{lesson.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Video Player */}
          <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="mb-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-2">{courseData.currentLesson.title}</h2>
                <p className="text-lg opacity-90">{courseData.title}</p>
                <p className="text-sm opacity-75">with {courseData.instructor}</p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
              <div className="flex items-center gap-4">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Play className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <div className="flex-1 bg-white/20 rounded-full h-1">
                  <div className="bg-white h-1 rounded-full w-1/4"></div>
                </div>
                <span className="text-sm text-white">
                  {currentTime} / {duration}
                </span>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Basic Stalls and Holds</h3>
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
