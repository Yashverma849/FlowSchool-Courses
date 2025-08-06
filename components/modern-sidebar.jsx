"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Filter, Target, BookOpen, Award, TrendingUp } from "lucide-react"
import { useCourses } from "../contexts/course-context"

function SidebarContent() {
  const { filters, updateFilter, toggleArrayFilter, filteredCourses, courses } = useCourses()

  // Count courses by type
  const countByType = {
    all: courses.length,
    free: courses.filter((course) => course.type === "free").length,
    premium: courses.filter((course) => course.type === "premium").length,
  }

  // Count courses by category
  const flowArts = [
    {
      label: "Poi Arts",
      value: "Poi Arts",
      count: courses.filter((c) => c.category === "Poi Arts").length,
      icon: "🪀",
    },
    {
      label: "Fire Arts",
      value: "Fire Arts",
      count: courses.filter((c) => c.category === "Fire Arts").length,
      icon: "🔥",
    },
    {
      label: "Hoop Flow",
      value: "Hoop Flow",
      count: courses.filter((c) => c.category === "Hoop Flow").length,
      icon: "⭕",
    },
    {
      label: "Contact Arts",
      value: "Contact Arts",
      count: courses.filter((c) => c.category === "Contact Arts").length,
      icon: "🔮",
    },
    {
      label: "Martial Arts",
      value: "Martial Arts",
      count: courses.filter((c) => c.category === "Martial Arts").length,
      icon: "🥋",
    },
    {
      label: "Juggling",
      value: "Juggling",
      count: courses.filter((c) => c.category === "Juggling").length,
      icon: "🤹",
    },
  ]

  // Count courses by skill level
  const skillLevels = [
    {
      label: "Beginner",
      value: "Beginner",
      count: courses.filter((c) => c.level === "Beginner").length,
      color: "bg-green-900/50 text-green-400",
    },
    {
      label: "Intermediate",
      value: "Intermediate",
      count: courses.filter((c) => c.level === "Intermediate").length,
      color: "bg-yellow-900/50 text-yellow-400",
    },
    {
      label: "Advanced",
      value: "Advanced",
      count: courses.filter((c) => c.level === "Advanced").length,
      color: "bg-red-900/50 text-red-400",
    },
  ]

  // User learning stats
  const enrolledCourses = courses.filter((course) => course.enrolled).length
  const completedCourses = 0 // In a real app, this would be calculated
  const inProgressCourses = courses.filter(
    (course) => course.enrolled && course.progress > 0 && course.progress < 100,
  ).length
  const certificatesEarned = 0 // In a real app, this would be calculated

  const myLearning = [
    { label: "Enrolled Courses", count: enrolledCourses, icon: BookOpen, color: "text-blue-400" },
    { label: "Completed", count: completedCourses, icon: Award, color: "text-green-400" },
    { label: "In Progress", count: inProgressCourses, icon: TrendingUp, color: "text-orange-400" },
    { label: "Certificates Earned", count: certificatesEarned, icon: Award, color: "text-purple-400" },
  ]

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
          <Target className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-gray-100">Filters</h2>
      </div>

      {/* Course Type */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-100">Course Type</h3>
        <div className="space-y-2">
          {[
            { label: "All Courses", value: "all", count: countByType.all },
            { label: "Free Courses", value: "free", count: countByType.free },
            { label: "Premium Courses", value: "premium", count: countByType.premium },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => updateFilter("courseType", type.value)}
              className={`flex w-full items-center justify-start rounded-lg p-3 text-left transition-all ${
                filters.courseType === type.value
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                  : "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
              }`}
            >
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Flow Arts */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-100">Flow Arts</h3>
        <div className="space-y-2">
          {flowArts.map((art) => (
            <div
              key={art.value}
              onClick={() => toggleArrayFilter("flowArts", art.value)}
              className={`flex items-center justify-start rounded-lg p-2 transition-colors cursor-pointer ${
                filters.flowArts.includes(art.value)
                  ? "bg-purple-900/50 border border-purple-700"
                  : "hover:bg-gray-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{art.icon}</span>
                <span className="text-sm text-gray-300">{art.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Level */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-100">Skill Level</h3>
        <div className="space-y-2">
          {skillLevels.map((level) => (
            <div
              key={level.value}
              onClick={() => toggleArrayFilter("skillLevel", level.value)}
              className={`flex items-center justify-start rounded-lg p-2 transition-colors cursor-pointer ${
                filters.skillLevel.includes(level.value)
                  ? "bg-purple-900/50 border border-purple-700"
                  : "hover:bg-gray-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${level.color.split(" ")[0]}`} />
                <span className="text-sm text-gray-300">{level.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Learning */}
      <Card className="border-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <span className="text-xs text-white">✨</span>
            </div>
            <span className="text-gray-100">My Learning Journey</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myLearning.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex items-center justify-start rounded-lg p-2 hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-sm text-gray-300">{item.label}</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

export function ModernSidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 border-r border-gray-800 bg-gray-950/50 backdrop-blur-sm p-6 fixed left-0 top-24 h-[calc(100vh-6rem)] overflow-y-auto z-40 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-purple-600 hover:scrollbar-thumb-purple-500">
        <SidebarContent />
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden p-4 border-b border-gray-800">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 bg-gray-900/80 backdrop-blur-sm border-gray-700 text-gray-100 hover:bg-gray-800"
            >
              <Filter className="h-4 w-4" />
              Filters & Categories
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-6 overflow-y-auto bg-gray-950 border-gray-800 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-purple-600 hover:scrollbar-thumb-purple-500">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
