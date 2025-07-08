"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

function SidebarContent() {
  const courseTypes = [
    { label: "All Courses", value: "all", count: 6 },
    { label: "Free Courses", value: "free", count: 3 },
    { label: "Premium Courses", value: "premium", count: 3 },
  ]

  const flowArts = [
    { label: "Poi Arts", count: 1 },
    { label: "Fire Arts", count: 1 },
    { label: "Hoop Flow", count: 1 },
    { label: "Contact Arts", count: 1 },
    { label: "Martial Arts", count: 1 },
    { label: "Juggling", count: 1 },
  ]

  const skillLevels = [
    { label: "Beginner", count: 3 },
    { label: "Intermediate", count: 2 },
    { label: "Advanced", count: 1 },
  ]

  const myLearning = [
    { label: "Enrolled Courses", count: 3 },
    { label: "Completed", count: 0 },
    { label: "In Progress", count: 3 },
    { label: "Certificates Earned", count: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
          <span className="text-pink-600 text-sm">🎯</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      {/* Course Type */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Course Type</h3>
        <div className="space-y-2">
          {courseTypes.map((type) => (
            <div
              key={type.value}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                type.value === "all" ? "bg-gray-900 text-white" : "hover:bg-gray-50"
              }`}
            >
              <span className="text-sm font-medium">{type.label}</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                {type.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Flow Arts */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Flow Arts</h3>
        <div className="space-y-2">
          {flowArts.map((art) => (
            <div key={art.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{art.label}</span>
              <span className="text-sm text-gray-500">{art.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Level */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Skill Level</h3>
        <div className="space-y-2">
          {skillLevels.map((level) => (
            <div key={level.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{level.label}</span>
              <span className="text-sm text-gray-500">{level.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* My Learning */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-yellow-500">⭐</span>
            My Learning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {myLearning.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-700">{item.label}</span>
              <Badge variant="secondary" className="bg-gray-900 text-white">
                {item.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function ResponsiveSidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 border-r border-gray-200 bg-white p-6">
        <SidebarContent />
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden p-4 border-b border-gray-200">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-6">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
