"use client"

import { useState } from "react"
import { Clock, Users, Star, Play, BookOpen, Award, TrendingUp, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCourses } from "../contexts/course-context"

export function MyLearningPage({ onCourseClick, onBackClick }) {
  const { courses } = useCourses()
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")

  // Get enrolled courses
  const enrolledCourses = courses.filter((course) => course.enrolled)

  // Filter courses based on progress
  const getFilteredCourses = () => {
    let filtered = [...enrolledCourses]

    switch (filterBy) {
      case "in-progress":
        filtered = filtered.filter((course) => course.progress > 0 && course.progress < 100)
        break
      case "completed":
        filtered = filtered.filter((course) => course.progress === 100)
        break
      case "not-started":
        filtered = filtered.filter((course) => course.progress === 0)
        break
      default:
        break
    }

    // Sort courses
    switch (sortBy) {
      case "progress":
        filtered.sort((a, b) => b.progress - a.progress)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "recent":
      default:
        // Keep original order for "recent"
        break
    }

    return filtered
  }

  const filteredCourses = getFilteredCourses()

  // Calculate stats
  const stats = {
    total: enrolledCourses.length,
    inProgress: enrolledCourses.filter((course) => course.progress > 0 && course.progress < 100).length,
    completed: enrolledCourses.filter((course) => course.progress === 100).length,
    notStarted: enrolledCourses.filter((course) => course.progress === 0).length,
    totalHours: enrolledCourses.reduce((acc, course) => {
      const hours = Number.parseInt(course.duration.split(" ")[0])
      return acc + hours
    }, 0),
    averageProgress: Math.round(
      enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCourses.length,
    ),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Header */}
      <div className="border-b border-gray-200/50 bg-white/80 backdrop-blur-sm px-4 lg:px-6 py-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                My Learning Journey
              </h1>
              <p className="text-gray-600">Track your progress and continue your flow arts education</p>
            </div>
            <Button variant="outline" onClick={onBackClick} className="self-start lg:self-center">
              Back to Courses
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                  <p className="text-sm text-blue-600">Total Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700">{stats.inProgress}</p>
                  <p className="text-sm text-orange-600">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">{stats.totalHours}h</p>
                  <p className="text-sm text-purple-600">Total Hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Completion</span>
                <span className="font-semibold text-purple-600">{stats.averageProgress}%</span>
              </div>
              <Progress value={stats.averageProgress} className="h-3 bg-gray-100">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                  style={{ width: `${stats.averageProgress}%` }}
                />
              </Progress>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="font-medium text-gray-900">{stats.notStarted}</p>
                  <p className="text-gray-500">Not Started</p>
                </div>
                <div>
                  <p className="font-medium text-orange-600">{stats.inProgress}</p>
                  <p className="text-gray-500">In Progress</p>
                </div>
                <div>
                  <p className="font-medium text-green-600">{stats.completed}</p>
                  <p className="text-gray-500">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Accessed</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => onCourseClick(course)}
              >
                <CardHeader className="p-0 relative overflow-hidden">
                  <div className="relative">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Progress Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge
                        className={
                          course.progress === 100
                            ? "bg-green-500 text-white shadow-lg"
                            : course.progress > 0
                              ? "bg-orange-500 text-white shadow-lg"
                              : "bg-gray-500 text-white shadow-lg"
                        }
                      >
                        {course.progress === 100 ? "Completed" : course.progress > 0 ? "In Progress" : "Not Started"}
                      </Badge>
                    </div>

                    {/* Course Stats Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between text-white text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.lessons}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        by <span className="font-medium text-gray-700">{course.instructor}</span>
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {course.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-purple-600">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2 bg-gray-100">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </Progress>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button
                    className={`w-full transition-all duration-300 ${
                      course.progress === 100
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                        : course.progress > 0
                          ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                    }`}
                  >
                    {course.progress === 100 ? (
                      <>
                        Review Course
                        <Award className="ml-2 h-4 w-4" />
                      </>
                    ) : course.progress > 0 ? (
                      <>
                        Continue Learning
                        <Play className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Start Learning
                        <Play className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filterBy === "all"
                ? "You haven't enrolled in any courses yet. Start your learning journey today!"
                : `No courses match the "${filterBy}" filter. Try selecting a different filter.`}
            </p>
            {filterBy === "all" && (
              <Button
                className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={onBackClick}
              >
                Browse Courses
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
