"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Play, Clock, Users, Star, LayoutGrid, ListFilter, Flame, BrainCircuit, Dribbble, Target, Sparkles, Sparkle, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import CoursesDashboard from "@/courses-dashboard" // Will be modified to receive filtered courses
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import { Separator } from "@/components/ui/separator"

const coursesData = [
  {
    id: 1,
    title: "Poi Spinning Fundamentals",
    description: "Master the basics of poi spinning with flowing movements and fundamental techniques",
    thumbnail: "/placeholder.svg?height=200&width=300",
    instructor: "Maya Chen",
    duration: "2h 30m",
    lessons: 12,
    students: 1240,
    rating: 4.8,
    price: "Free",
    level: "Beginner",
    tags: ["Poi", "Beginner", "Free", "Flow Arts"],
    enrolled: false,
  },
  {
    id: 2,
    title: "Fire Staff Mastery",
    description: "Advanced fire staff techniques for experienced flow artists seeking to elevate their practice",
    thumbnail: "/placeholder.svg?height=200&width=300",
    instructor: "Alex Rivera",
    duration: "4h 15m",
    lessons: 18,
    students: 856,
    rating: 4.9,
    price: "$49",
    level: "Advanced",
    tags: ["Fire Staff", "Advanced", "Paid", "Flow Arts"],
    enrolled: true,
  },
  {
    id: 3,
    title: "Rope Dart Flow",
    description: "Explore the ancient art of rope dart with modern flow techniques and safety practices",
    thumbnail: "/placeholder.svg?height=200&width=300",
    instructor: "Jin Wu",
    duration: "3h 45m",
    lessons: 15,
    students: 642,
    rating: 4.7,
    price: "$39",
    level: "Intermediate",
    tags: ["Rope Dart", "Intermediate", "Paid", "Flow Arts"],
    enrolled: false,
  },
  {
    id: 4,
    title: "Hoop Dance Basics",
    description: "Graceful movements and fundamental techniques for hoop dance beginners",
    thumbnail: "/placeholder.svg?height=200&width=300",
    instructor: "Luna Star",
    duration: "2h 15m",
    lessons: 10,
    students: 1580,
    rating: 4.6,
    price: "Free",
    level: "Beginner",
    tags: ["Hoop Dance", "Beginner", "Free", "Flow Arts"],
    enrolled: false,
  },
  {
    id: 5,
    title: "Contact Ball Meditation",
    description: "Mindful movement and meditation through contact ball manipulation",
    thumbnail: "/placeholder.svg?height=200&width=300",
    instructor: "Zen Master Ko",
    duration: "1h 50m",
    lessons: 8,
    students: 423,
    rating: 4.9,
    price: "$29",
    level: "All Levels",
    tags: ["Contact Ball", "Meditation", "Paid", "Flow Arts"],
    enrolled: true,
  },
  {
    id: 6,
    title: "Juggling Fundamentals",
    description: "Learn the art of juggling from basic throws to complex patterns",
    thumbnail: "/placeholder.svg?height=200&width=300",
    instructor: "Carlo Tosser",
    duration: "3h 20m",
    lessons: 14,
    students: 2100,
    rating: 4.5,
    price: "Free",
    level: "Beginner",
    tags: ["Juggling", "Beginner", "Free", "Flow Arts"],
    enrolled: false,
  },
]

export default function CourseLayout() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedFlowArts, setSelectedFlowArts] = useState("all")
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("all")
  const [ratingFilter, setRatingFilter] = useState([0])

  const flowArtsOptions = [
    { label: "Poi Arts", value: "Poi", icon: <Sparkles className="h-4 w-4" /> },
    { label: "Fire Arts", value: "Fire Staff", icon: <Flame className="h-4 w-4" /> },
    { label: "Hoop Flow", value: "Hoop Dance", icon: <Dribbble className="h-4 w-4" /> },
    { label: "Contact Arts", value: "Contact Ball", icon: <BrainCircuit className="h-4 w-4" /> },
    { label: "Juggling", value: "Juggling", icon: <Target className="h-4 w-4" /> },
  ]

  const skillLevelOptions = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
    { label: "All Levels", value: "All Levels" },
  ]

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterType === "all" ||
      (filterType === "free" && course.price === "Free") ||
      (filterType === "paid" && course.price !== "Free")
    const matchesFlowArt =
      selectedFlowArts === "all" || course.tags.includes(selectedFlowArts)
    const matchesSkillLevel =
      selectedSkillLevel === "all" || course.level === selectedSkillLevel
    const matchesRating = course.rating >= ratingFilter[0]

    return matchesSearch && matchesFilter && matchesFlowArt && matchesSkillLevel && matchesRating
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SiteHeader />

      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex-shrink-0 sticky top-[77px] h-[calc(100vh-77px)] overflow-y-auto"
        >
          <div className="flex items-center gap-2 text-lg font-semibold text-purple-400 mb-6">
            <ListFilter className="h-5 w-5" />
            Filters
          </div>

          <div className="mb-8">
            <h3 className="text-gray-300 text-sm uppercase tracking-wider mb-3">Course Type</h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-between text-left ${filterType === "all" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
                onClick={() => setFilterType("all")}
              >
                All Courses
                <Badge variant="secondary" className={`${filterType === "all" ? "bg-purple-600/50" : "bg-gray-700"} text-gray-300`}>
                  {coursesData.length}
                </Badge>
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-between text-left ${filterType === "free" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
                onClick={() => setFilterType("free")}
              >
                Free Courses
                <Badge variant="secondary" className={`${filterType === "free" ? "bg-purple-600/50" : "bg-gray-700"} text-gray-300`}>
                  {coursesData.filter((course) => course.price === "Free").length}
                </Badge>
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-between text-left ${filterType === "paid" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
                onClick={() => setFilterType("paid")}
              >
                Premium Courses
                <Badge variant="secondary" className={`${filterType === "paid" ? "bg-purple-600/50" : "bg-gray-700"} text-gray-300`}>
                  {coursesData.filter((course) => course.price !== "Free").length}
                </Badge>
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-800 my-6" />

          <div className="mb-8">
            <h3 className="text-gray-300 text-sm uppercase tracking-wider mb-3">Flow Arts</h3>
            <div className="space-y-2">
              {flowArtsOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  className={`w-full justify-start text-left gap-2 ${selectedFlowArts === option.value ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
                  onClick={() => setSelectedFlowArts(option.value)}
                >
                  {option.icon}
                  {option.label}
                  <Badge variant="secondary" className={`${selectedFlowArts === option.value ? "bg-purple-600/50" : "bg-gray-700"} text-gray-300 ml-auto`}>
                    {coursesData.filter((course) => course.tags.includes(option.value)).length}
                  </Badge>
                </Button>
              ))}
              <Button
                variant="ghost"
                className={`w-full justify-start text-left gap-2 ${selectedFlowArts === "all" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
                onClick={() => setSelectedFlowArts("all")}
              >
                All Flow Arts
                <Badge variant="secondary" className={`${selectedFlowArts === "all" ? "bg-purple-600/50" : "bg-gray-700"} text-gray-300 ml-auto`}>
                  {coursesData.filter((course) => course.tags.some(tag => flowArtsOptions.map(opt => opt.value).includes(tag))).length}
                </Badge>
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-gray-300 text-sm uppercase tracking-wider mb-3">Skill Level</h3>
            <div className="space-y-2">
              {skillLevelOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  className={`w-full justify-start text-left ${selectedSkillLevel === option.value ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
                  onClick={() => setSelectedSkillLevel(option.value)}
                >
                  {option.label}
                  <Badge variant="secondary" className={`${selectedSkillLevel === option.value ? "bg-purple-600/50" : "bg-gray-700"} text-gray-300 ml-auto`}>
                    {coursesData.filter((course) => course.level === option.value).length}
                  </Badge>
                </Button>
              ))}
              <Button
                variant="ghost"
                className={`w-full justify-start text-left ${selectedSkillLevel === "all" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
                onClick={() => setSelectedSkillLevel("all")}
              >
                All Levels
                <Badge variant="secondary" className={`${selectedSkillLevel === "all" ? "bg-purple-600/50" : "bg-gray-700"} text-gray-300 ml-auto`}>
                  {coursesData.length}
                </Badge>
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-gray-300 text-sm uppercase tracking-wider mb-3">Rating</h3>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-gray-300">{ratingFilter[0].toFixed(1)} & up</span>
            </div>
            <Slider
              value={ratingFilter}
              onValueChange={setRatingFilter}
              max={5}
              step={0.1}
              className="mt-2"
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-200">Flow Arts Courses</h2>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-lg font-semibold text-gray-200">
                {filteredCourses.length} courses found
              </span>
              <span>Filter:</span>
              <Button
                variant="secondary"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-4"
                onClick={() => setFilterType("all")}
              >
                {filterType === "all"
                  ? "All Courses"
                  : filterType === "free"
                    ? "Free Courses"
                    : "Premium Courses"}
              </Button>
            </div>
          </div>
          <p className="text-gray-400 mb-8">
            Discover the art of movement, rhythm, and creative expression through our curated collection of
            courses
          </p>

          <CoursesDashboard courses={filteredCourses} />
        </div>
      </div>
    </div>
  )
} 