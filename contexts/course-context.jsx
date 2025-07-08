"use client"

import { createContext, useContext, useState, useEffect } from "react"

const coursesData = [
  {
    id: 1,
    title: "Poi Spinning Fundamentals",
    instructor: "Maya Chen",
    rating: 4.8,
    students: 1247,
    duration: "6 hours",
    lessons: 18,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Poi", "Beginner", "Flow Arts"],
    type: "free",
    category: "Poi Arts",
    level: "Beginner",
    enrolled: true,
    progress: 75,
    status: "Continue Learning",
    description:
      "Master the ancient art of poi spinning with flowing movements and fundamental techniques that will transform your flow practice.",
  },
  {
    id: 2,
    title: "Contact Ball Basics",
    instructor: "Zen Master Ko",
    rating: 4.8,
    students: 1200,
    duration: "4 hours",
    lessons: 12,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Contact Ball", "Meditation", "Beginner"],
    type: "free",
    category: "Contact Arts",
    level: "Beginner",
    enrolled: false,
    progress: 0,
    status: "Start Learning",
    description:
      "Enter the meditative practice of contact ball manipulation, where spheres become extensions of your creative expression.",
  },
  {
    id: 3,
    title: "Rope Dart Fundamentals",
    instructor: "Jin Wu",
    rating: 4.8,
    students: 1200,
    duration: "7 hours",
    lessons: 21,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Rope Dart", "Martial Arts", "Traditional"],
    type: "premium",
    category: "Martial Arts",
    level: "Intermediate",
    enrolled: true,
    progress: 30,
    status: "Continue Learning",
    description:
      "Explore the ancient Chinese weapon art form, combining martial arts precision with flowing artistic expression.",
  },
  {
    id: 4,
    title: "Juggling Journey",
    instructor: "Carlo Tosser",
    rating: 4.8,
    students: 1200,
    duration: "3 hours",
    lessons: 10,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Juggling", "Coordination", "Fun"],
    type: "free",
    category: "Juggling",
    level: "Beginner",
    enrolled: false,
    progress: 0,
    status: "Start Learning",
    description:
      "From basic throws to complex patterns, embark on a juggling adventure that enhances coordination and creativity.",
  },
  {
    id: 5,
    title: "Fire Staff Mastery",
    instructor: "Alex Rivera",
    rating: 4.8,
    students: 1200,
    duration: "8 hours",
    lessons: 24,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Fire Staff", "Advanced", "Performance"],
    type: "premium",
    category: "Fire Arts",
    level: "Advanced",
    enrolled: true,
    progress: 40,
    status: "Continue Learning",
    description:
      "Advanced fire staff techniques for experienced flow artists seeking to elevate their performance to professional levels.",
  },
  {
    id: 6,
    title: "Hoop Dance Flow",
    instructor: "Luna Star",
    rating: 4.8,
    students: 1200,
    duration: "5 hours",
    lessons: 15,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Hoop Dance", "Fitness", "Mindfulness"],
    type: "premium",
    category: "Hoop Flow",
    level: "Intermediate",
    enrolled: true,
    progress: 40,
    status: "Continue Learning",
    description:
      "Discover the graceful world of hoop dance, blending fitness, creativity, and mindful movement into one beautiful practice.",
  },
]

const CourseContext = createContext(null)

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState(coursesData)
  const [filteredCourses, setFilteredCourses] = useState(coursesData)
  const [filters, setFilters] = useState({
    courseType: "all",
    flowArts: [],
    skillLevel: [],
    searchTerm: "",
  })

  // Apply filters whenever they change
  useEffect(() => {
    let result = [...courses]

    // Filter by course type
    if (filters.courseType !== "all") {
      result = result.filter((course) => course.type === filters.courseType)
    }

    // Filter by flow arts categories
    if (filters.flowArts.length > 0) {
      result = result.filter((course) => filters.flowArts.includes(course.category))
    }

    // Filter by skill level
    if (filters.skillLevel.length > 0) {
      result = result.filter((course) => filters.skillLevel.includes(course.level))
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          course.instructor.toLowerCase().includes(searchLower) ||
          course.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    setFilteredCourses(result)
  }, [courses, filters])

  // Update a specific filter
  const updateFilter = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  // Toggle a filter value in an array (for multi-select filters)
  const toggleArrayFilter = (filterType, value) => {
    setFilters((prev) => {
      const currentValues = prev[filterType]
      return {
        ...prev,
        [filterType]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      }
    })
  }

  // Set search term
  const setSearchTerm = (term) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: term,
    }))
  }

  return (
    <CourseContext.Provider
      value={{
        courses,
        filteredCourses,
        filters,
        updateFilter,
        toggleArrayFilter,
        setSearchTerm,
      }}
    >
      {children}
    </CourseContext.Provider>
  )
}

export const useCourses = () => {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error("useCourses must be used within a CourseProvider")
  }
  return context
}
