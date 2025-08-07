"use client"

import React from "react"
import SiteHeader from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Star, ChevronDown } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.3);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #a855f7;
    border-radius: 6px;
    box-shadow: 0 0 6px rgba(168, 85, 247, 0.4);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #c084fc;
    box-shadow: 0 0 8px rgba(192, 132, 252, 0.6);
  }
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }
  .overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.3);
    border-radius: 4px;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #a855f7;
    border-radius: 6px;
    box-shadow: 0 0 6px rgba(168, 85, 247, 0.4);
  }
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #c084fc;
    box-shadow: 0 0 8px rgba(192, 132, 252, 0.6);
  }
`

const categories = [
  "All Courses",
  "Poi",
  "Fire Staff",
  "Rope Dart",
  "Contact Ball",
  "Flowchakra"
]

// Function to fetch enrolled courses for a specific user
async function fetchEnrolledCourses(userId) {
  try {
    console.log('Fetching enrolled courses for user:', userId)
    
    // First, get all enrollments for the user
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)

    console.log('Enrollments data:', enrollments)
    console.log('Enrollment error:', enrollmentError)

    if (enrollmentError) {
      console.error('Error fetching enrollments:', enrollmentError)
      return []
    }

    if (!enrollments || enrollments.length === 0) {
      console.log('No enrollments found for user')
      return []
    }

    // Get course IDs from enrollments
    const courseIds = enrollments.map(e => e.course_id).filter(Boolean)
    console.log('Course IDs:', courseIds)

    if (courseIds.length === 0) {
      console.log('No course IDs found')
      return []
    }

    // Get course details
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .in('id', courseIds)

    console.log('Courses data:', courses)
    console.log('Courses error:', coursesError)

    if (coursesError) {
      console.error('Error fetching courses:', coursesError)
      return []
    }

    // Create a map of courses by ID
    const coursesMap = courses.reduce((acc, course) => {
      acc[course.id] = course
      return acc
    }, {})

    // Transform the data to match our component structure
    const enrolledCourses = enrollments.map(enrollment => {
      const course = coursesMap[enrollment.course_id]
      
      if (!course) {
        console.log('Course not found for enrollment:', enrollment.course_id)
        return null
      }

      // Convert duration from minutes to readable format
      const durationMinutes = course.duration_minutes || 150
      const hours = Math.floor(durationMinutes / 60)
      const minutes = durationMinutes % 60
      const duration = `${hours}h ${minutes}m`

      // Calculate progress based on enrollment data
      const progressPercentage = enrollment.progress_percentage || 0
      const totalLessons = course.total_lessons || 12
      const completedLessons = Math.round((progressPercentage / 100) * totalLessons)

      return {
        id: course.id,
        title: course.title,
        by: 'FlowSchool', // Default instructor name
        duration: duration,
        lessons: `${totalLessons} lessons`,
        lastAccessed: enrollment.last_accessed_at ? formatLastAccessed(enrollment.last_accessed_at) : 'Never',
        progress: progressPercentage,
        level: course.level || 'Beginner',
        rating: course.rating || 4.5,
        image: course.thumbnail_url,
        completed: enrollment.completed_at !== null,
        tags: course.tags || []
      }
    }).filter(Boolean) // Remove null entries

    console.log('Transformed enrolled courses:', enrolledCourses)
    return enrolledCourses

  } catch (error) {
    console.error('Error in fetchEnrolledCourses:', error)
    return []
  }
}

// Function to format last accessed date
function formatLastAccessed(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
}

// Function to calculate total hours from enrolled courses
function calculateTotalHours(courses) {
  let totalMinutes = 0
  courses.forEach(course => {
    const duration = course.duration
    if (duration) {
      const hours = duration.match(/(\d+)h/)
      const minutes = duration.match(/(\d+)m/)
      if (hours) totalMinutes += parseInt(hours[1]) * 60
      if (minutes) totalMinutes += parseInt(minutes[1])
    }
  })
  
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

class MyLearningPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      courses: [],
      loading: true,
      selectedCategory: "All Courses",
      userId: null
    }
  }

  async componentDidMount() {
    await this.getCurrentUser()
  }

  async getCurrentUser() {
    try {
      console.log('Getting current user...')
      const { data: { user }, error } = await supabase.auth.getUser()
      console.log('User data:', user)
      console.log('User error:', error)
      
      if (error) {
        console.error('Error getting user:', error)
        this.setState({ loading: false })
        return
      }
      
      if (user) {
        console.log('User found, ID:', user.id)
        this.setState({ userId: user.id })
        await this.fetchUserEnrolledCourses(user.id)
      } else {
        console.log('No user found')
        this.setState({ loading: false })
      }
    } catch (error) {
      console.error('Error in getCurrentUser:', error)
      this.setState({ loading: false })
    }
  }

  async fetchUserEnrolledCourses(userId) {
    try {
      this.setState({ loading: true })
      const enrolledCourses = await fetchEnrolledCourses(userId)
      this.setState({ 
        courses: enrolledCourses,
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
      this.setState({ loading: false })
    }
  }

  setSelectedCategory = (category) => {
    this.setState({ selectedCategory: category })
  }

  render() {
    const { courses, loading, selectedCategory } = this.state

  const filteredCourses = selectedCategory === "All Courses" 
    ? courses 
        : courses.filter(course => {
            if (selectedCategory === "Flowchakra") {
              return course.title.toLowerCase().includes("flowchakra") || 
                     (course.tags && course.tags.some(tag => 
                       tag.toLowerCase().includes("flowchakra")
                     ))
            }
            return course.tags && course.tags.some(tag => 
              tag.toLowerCase().includes(selectedCategory.toLowerCase())
            )
          })

    const completedCourses = courses.filter(course => course.completed).length
    const inProgressCourses = courses.filter(course => !course.completed).length
    const totalHours = calculateTotalHours(courses)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <SiteHeader />
        
        {/* Page Header */}
        <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                My Learning
              </h1>
            </div>
            
            {/* Filter Dropdown - Positioned on the right side of header */}
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 border border-gray-600/50 text-white hover:bg-gray-700/80 hover:text-purple-300 transition-all duration-300">
                    <span className="mr-2">Filter: {selectedCategory}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900/95 border border-gray-700/50 backdrop-blur-sm">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedCategory === category
                          ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                          : "text-gray-300 hover:text-purple-300 hover:bg-gray-800/50"
                      }`}
                      onClick={() => this.setSelectedCategory(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 lg:px-8 pb-6 lg:pb-8 max-w-7xl mx-auto flex-1">
          {/* Sidebar with Progress Overview */}
          <aside className="w-full lg:w-80 flex-shrink-0 mb-6 lg:mb-0 lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 rounded-xl lg:rounded-3xl p-4 lg:p-6 border border-gray-700/60 shadow-2xl backdrop-blur-sm">
              <h2 className="text-sm lg:text-base font-bold mb-3 lg:mb-4 text-white flex items-center gap-2">
                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                Progress Overview
              </h2>
              <div className="flex flex-col gap-2 lg:gap-3 text-gray-300 text-xs lg:text-sm">
                <div className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-gray-800/50">
                  <span className="text-gray-400">Courses Completed</span>
                  <span className="font-semibold text-green-400">{completedCourses}</span>
                </div>
                <div className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-gray-800/50">
                  <span className="text-gray-400">In Progress</span>
                  <span className="font-semibold text-blue-400">{inProgressCourses}</span>
              </div>
                <div className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-gray-800/50">
                  <span className="text-gray-400">Total Hours</span>
                  <span className="font-semibold text-purple-400">{totalHours}</span>
              </div>
              </div>
          </div>
        </aside>
          
        {/* Main Content */}
        <main className="flex-1">
            {/* Courses Container */}
            <div className="h-[calc(100vh-320px)] lg:h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-2">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-8 lg:py-12">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                    <Play className="w-10 h-10 lg:w-12 lg:h-12 text-purple-400" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">No enrolled courses found</h3>
                  <p className="text-gray-400 mb-6 text-sm lg:text-base">
                    {this.state.userId 
                      ? "You haven't enrolled in any courses yet." 
                      : "Please log in to view your enrolled courses."
                    }
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                    {this.state.userId ? "Browse Courses" : "Log In"}
                  </Button>
            </div>
          ) : (
                <div className="flex flex-col gap-4 lg:gap-6">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700/50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 shadow-xl backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start lg:items-center gap-4 lg:gap-6 flex-1">
                        <div className="hidden lg:flex items-center justify-center w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg lg:rounded-xl border border-purple-500/30">
                          <Play className="w-8 h-8 lg:w-10 lg:h-10 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg lg:text-2xl font-bold text-white mb-2 hover:text-purple-400 transition-colors truncate">
                            {course.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-1 lg:gap-2 text-gray-400 mb-3 text-xs lg:text-sm">
                            <span className="text-purple-300 font-medium">by {course.by}</span>
                            <span className="text-gray-500">•</span>
                            <span>{course.duration}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-blue-300">{course.lessons}</span>
                          </div>
                          <div className="flex items-center gap-2 lg:gap-3 mb-3 flex-wrap">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 text-xs font-semibold rounded-full shadow-lg">
                              {course.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 lg:gap-3 min-w-[140px] lg:min-w-[180px]">
                        <Button 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
                          onClick={() => window.location.href = `/courses/${course.id}`}
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </main>
      </div>
    </div>
    )
  }
}

export default MyLearningPage