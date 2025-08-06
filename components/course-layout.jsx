"use client"

import { useState, useEffect } from "react"
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { CourseCards } from "@/components/course-cards";

function DashboardSidebar({
  filterType, setFilterType,
  selectedFlowArts, setSelectedFlowArts,
  selectedSkillLevel, setSelectedSkillLevel,
  ratingFilter, setRatingFilter,
  coursesData, flowArtsOptions, skillLevelOptions
}) {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 p-6 fixed left-0 top-24 h-[calc(100vh-6rem)] overflow-y-auto z-40 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-purple-600 hover:scrollbar-thumb-purple-500">
      <div className="flex items-center gap-2 text-lg font-semibold text-purple-400 mb-6">
        <ListFilter className="h-5 w-5" />
        Filters
      </div>
      <div className="mb-8">
        <h3 className="text-gray-300 text-sm uppercase tracking-wider mb-3">Course Type</h3>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-left ${filterType === "all" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setFilterType("all")}
          >
            All Courses
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-left ${filterType === "free" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setFilterType("free")}
          >
            Free Courses
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-left ${filterType === "paid" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setFilterType("paid")}
          >
            Premium Courses
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
            </Button>
          ))}
          <Button
            variant="ghost"
            className={`w-full justify-start text-left gap-2 ${selectedFlowArts === "all" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setSelectedFlowArts("all")}
          >
            All Flow Arts
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
            </Button>
          ))}
          <Button
            variant="ghost"
            className={`w-full justify-start text-left ${selectedSkillLevel === "all" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
            onClick={() => setSelectedSkillLevel("all")}
          >
            All Levels
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
    </div>
  )
}

export default function CourseLayout() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedFlowArts, setSelectedFlowArts] = useState("all")
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("all")
  const [ratingFilter, setRatingFilter] = useState([0])

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      const { data, error } = await supabase.from("courses").select("*")
      setCourses(data || [])
      setLoading(false)
    }
    fetchCourses()
  }, [])

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

  let filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterType === "all" ||
      (filterType === "free" && course.is_free) ||
      (filterType === "paid" && !course.is_free)
    const matchesFlowArt =
      selectedFlowArts === "all" || (course.tags && course.tags.includes(selectedFlowArts))
    const matchesSkillLevel =
      selectedSkillLevel === "all" || course.level === selectedSkillLevel
    const matchesRating = course.rating >= ratingFilter[0]

    return matchesSearch && matchesFilter && matchesFlowArt && matchesSkillLevel && matchesRating
  })

  const sidebarToggle = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-gray-900/80 backdrop-blur-sm border-gray-700 text-gray-100 hover:bg-gray-800 w-10 h-10 p-0 flex items-center justify-center">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-gray-900 border-gray-800 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-purple-600 hover:scrollbar-thumb-purple-500">
        <DashboardSidebar
          filterType={filterType}
          setFilterType={setFilterType}
          selectedFlowArts={selectedFlowArts}
          setSelectedFlowArts={setSelectedFlowArts}
          selectedSkillLevel={selectedSkillLevel}
          setSelectedSkillLevel={setSelectedSkillLevel}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          coursesData={courses}
          flowArtsOptions={flowArtsOptions}
          skillLevelOptions={skillLevelOptions}
        />
      </SheetContent>
    </Sheet>
  )

  if (loading) return <div className="p-8 text-white">Loading courses...</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SiteHeader sidebarToggle={sidebarToggle} />
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <DashboardSidebar
            filterType={filterType}
            setFilterType={setFilterType}
            selectedFlowArts={selectedFlowArts}
            setSelectedFlowArts={setSelectedFlowArts}
            selectedSkillLevel={selectedSkillLevel}
            setSelectedSkillLevel={setSelectedSkillLevel}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            coursesData={courses}
            flowArtsOptions={flowArtsOptions}
            skillLevelOptions={skillLevelOptions}
          />
        </div>
        {/* Main Content */}
        <div className="flex-1 lg:ml-64 lg:pt-6 p-8 overflow-y-auto">
          <div className="mb-8">
            {/* Removed duplicate heading, description, and filter UI. Now handled by CourseCards. */}
          </div>

          <CourseCards courses={filteredCourses} />
        </div>
      </div>
    </div>
  )
} 