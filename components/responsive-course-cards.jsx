"use client"

import { Clock, Users, Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

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
    enrolled: true,
    progress: 75,
    status: "Continue Learning",
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
    enrolled: false,
    progress: 0,
    status: "Start Learning",
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
    enrolled: true,
    progress: 30,
    status: "Continue Learning",
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
    enrolled: false,
    progress: 0,
    status: "Start Learning",
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
    enrolled: true,
    progress: 40,
    status: "Continue Learning",
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
    enrolled: true,
    progress: 40,
    status: "Continue Learning",
  },
]

export function ResponsiveCourseCards({ onCourseClick }) {
  return (
    <div className="flex-1 p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Flow Arts Courses</h1>
        <p className="text-sm lg:text-base text-gray-600">
          Discover the art of movement, rhythm, and creative expression
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
          <p className="text-sm text-gray-500">6 courses found</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <Badge className="bg-gray-900 text-white">All Courses</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {coursesData.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onCourseClick(course)}
          >
            <CardHeader className="p-0 relative">
              <div className="relative">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={course.type === "free" ? "bg-green-500 text-white" : "bg-orange-500 text-white"}>
                    {course.type === "free" ? "Free" : "Premium"}
                  </Badge>
                </div>
                {course.enrolled && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-blue-500 text-white">Enrolled</Badge>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{course.rating}</span>
              </div>

              <h3 className="font-semibold text-base lg:text-lg mb-2 text-gray-900 line-clamp-2">{course.title}</h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                Learn the captivating art of {course.title.toLowerCase()} with safety protocols...
              </p>

              <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📚</span>
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {course.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {course.enrolled && course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                {course.enrolled && course.progress > 0 ? (
                  <>
                    Continue Learning
                    <Play className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    {course.status}
                    <Play className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
