"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, TrendingUp, CheckCircle, Clock, Filter, Grid3X3, List, BookCheck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import SiteHeader from "@/components/site-header"

// Mock data for enrolled courses (similar to coursesData but with progress)
const enrolledCoursesData = [
  {
    id: 1,
    title: "Poi Spinning Fundamentals",
    description: "Master the basics of poi spinning with flowing movements and fundamental techniques",
    thumbnail: "/placeholder.svg?height=200&width=300",
    instructor: "Maya Chen",
    duration: "6h 18m", // Updated duration to match image
    lessons: 18, // Updated lessons to match image
    students: 1247, // Updated students to match image
    rating: 4.8,
    price: "Free",
    level: "Beginner",
    tags: ["Poi", "Beginner", "Flow Arts"],
    enrolled: true,
    progress: 75,
    status: "In Progress",
  },
  {
    id: 2,
    title: "Rope Dart Fundamentals",
    description: "Explore the ancient Chinese weapon art form, combining modern martial arts precision...",
    thumbnail: "/placeholder.svg?height=200&width=300",
    instructor: "Jin Wu",
    duration: "7h 21m",
    lessons: 21,
    students: 1200,
    rating: 4.8,
    price: "Premium",
    level: "Intermediate",
    tags: ["Rope Dart", "Martial Arts", "Traditional"],
    enrolled: true,
    progress: 30,
    status: "In Progress",
  },
  {
    id: 3,
    title: "Fire Staff Mastery",
    description: "Advanced fire staff techniques for experienced flow artists seeking to elevate their practice",
    thumbnail: "/placeholder.svg?height=200&width=300",
    instructor: "Alex Rivera",
    duration: "8h 24m",
    lessons: 24,
    students: 1200,
    rating: 4.8,
    price: "Premium",
    level: "Advanced",
    tags: ["Fire Staff", "Advanced", "Flow Arts"],
    enrolled: true,
    progress: 50,
    status: "In Progress",
  },
  {
    id: 4,
    title: "Contact Ball Basics",
    description: "Enter the meditative practice of contact ball manipulation, where spheres become...",
    thumbnail: "/placeholder.svg?height=200&width=300",
    instructor: "Zen Master Ko",
    duration: "4h 12m",
    lessons: 12,
    students: 1200,
    rating: 4.8,
    price: "Free",
    level: "All Levels",
    tags: ["Contact Ball", "Meditation", "Beginner"],
    enrolled: true,
    progress: 0, // Assuming 0 for a 'Not Started' example if needed, or adjust to match image
    status: "Not Started",
  },
]

export default function MyLearningPage() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("recentlyAccessed")

  const filteredCourses = enrolledCoursesData.filter((course) => {
    if (filterStatus === "all") return true
    return course.status === filterStatus
  }).sort((a, b) => {
    if (sortBy === "recentlyAccessed") {
      // For now, let's just sort by title, as there's no actual access date
      return a.title.localeCompare(b.title)
    } else if (sortBy === "progress") {
      return a.progress - b.progress
    }
    return 0
  })

  const totalCourses = enrolledCoursesData.length
  const inProgressCourses = enrolledCoursesData.filter(c => c.status === "In Progress").length
  const completedCourses = enrolledCoursesData.filter(c => c.status === "Completed").length
  const totalHours = enrolledCoursesData.reduce((sum, course) => {
    const [hours, minutes] = course.duration.split('h ').map(parseFloat);
    return sum + hours + (minutes || 0) / 60;
  }, 0);

  const averageCompletion = totalCourses > 0 
    ? enrolledCoursesData.reduce((sum, course) => sum + course.progress, 0) / totalCourses
    : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              My Learning Journey
            </h1>
            <p className="text-gray-400 mt-2">Track your progress and continue your flow arts education</p>
          </div>
          <Link href="/">
            <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">
              Back to Courses
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-blue-600/20 border-blue-600/50 flex items-center p-4 gap-4">
            <BookOpen className="h-8 w-8 text-blue-400" />
            <div>
              <div className="text-3xl font-bold text-blue-300">{totalCourses}</div>
              <div className="text-blue-400">Total Courses</div>
            </div>
          </Card>
          <Card className="bg-orange-600/20 border-orange-600/50 flex items-center p-4 gap-4">
            <TrendingUp className="h-8 w-8 text-orange-400" />
            <div>
              <div className="text-3xl font-bold text-orange-300">{inProgressCourses}</div>
              <div className="text-orange-400">In Progress</div>
            </div>
          </Card>
          <Card className="bg-green-600/20 border-green-600/50 flex items-center p-4 gap-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <div className="text-3xl font-bold text-green-300">{completedCourses}</div>
              <div className="text-green-400">Completed</div>
            </div>
          </Card>
          <Card className="bg-purple-600/20 border-purple-600/50 flex items-center p-4 gap-4">
            <Clock className="h-8 w-8 text-purple-400" />
            <div>
              <div className="text-3xl font-bold text-purple-300">{totalHours.toFixed(0)}h</div>
              <div className="text-purple-400">Total Hours</div>
            </div>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="bg-gray-900 border-gray-800 p-6 mb-10">
          <div className="flex items-center gap-3 text-purple-400 mb-4">
            <TrendingUp className="h-6 w-6" />
            <h3 className="text-xl font-semibold">Overall Progress</h3>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200/20">
                  Average Completion
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold inline-block text-purple-400">
                  {averageCompletion.toFixed(0)}%
                </span>
              </div>
            </div>
            <Progress value={averageCompletion} className="w-full bg-gray-700 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-purple-500 [&::-webkit-progress-value]:to-pink-500" />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>0 Not Started</span>
              <span>{inProgressCourses} In Progress</span>
              <span>{completedCourses} Completed</span>
            </div>
          </div>
        </Card>

        {/* Course Filters and Sort */}
        <div className="flex items-center gap-4 mb-6">
          <Filter className="h-5 w-5 text-gray-400" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Recently Accessed" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="recentlyAccessed">Recently Accessed</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Enrolled Course Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant={course.status === "In Progress" ? "default" : course.status === "Completed" ? "secondary" : "outline"}
                        className={course.status === "In Progress" ? "bg-orange-600 text-white" : course.status === "Completed" ? "bg-green-600 text-white" : "border-gray-600 text-gray-300"}
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                        <BookCheck className="h-4 w-4 ml-2" />
                        <span>{course.lessons} lessons</span>
                        <div className="flex items-center ml-auto">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">Progress: {course.progress}%</div>
                    <Progress value={course.progress} className="w-2/3 bg-gray-700 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-purple-500 [&::-webkit-progress-value]:to-pink-500" />
                  </div>

                  <Button
                    className={`w-full ${course.status === "Completed" ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"}`}
                  >
                    {course.status === "Completed" ? (
                      <>Completed</>
                    ) : (
                      <Link href={`/courses/${course.id}`} className="w-full flex items-center justify-center">
                        Continue Learning
                      </Link>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="text-center py-12 col-span-full">
              <div className="text-gray-400 text-lg">No enrolled courses found matching your criteria</div>
              <p className="text-gray-500 mt-2">Try adjusting your filter settings</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 