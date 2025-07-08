"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  Lock,
  Download,
  MessageCircle,
  BookOpen,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const courseData = {
  id: 2,
  title: "Fire Staff Mastery",
  instructor: "Alex Rivera",
  description: "Advanced fire staff techniques for experienced flow artists seeking to elevate their practice",
  currentLesson: {
    id: 3,
    title: "Advanced Spinning Techniques",
    duration: "12:45",
    videoUrl: "/placeholder.svg?height=400&width=700",
    description:
      "Learn advanced spinning patterns and transitions that will take your fire staff skills to the next level.",
    resources: [
      { name: "Practice Routine PDF", size: "2.3 MB" },
      { name: "Safety Guidelines", size: "1.1 MB" },
    ],
  },
  modules: [
    {
      id: 1,
      title: "Getting Started",
      lessons: [
        { id: 1, title: "Introduction to Fire Staff", duration: "8:30", completed: true, locked: false },
        { id: 2, title: "Safety First", duration: "15:20", completed: true, locked: false },
        { id: 3, title: "Basic Grip and Stance", duration: "10:45", completed: true, locked: false },
      ],
    },
    {
      id: 2,
      title: "Fundamental Techniques",
      lessons: [
        { id: 4, title: "Basic Spins", duration: "12:15", completed: true, locked: false },
        { id: 5, title: "Figure 8 Patterns", duration: "14:30", completed: false, locked: false },
        { id: 6, title: "Transitions", duration: "11:20", completed: false, locked: false },
      ],
    },
    {
      id: 3,
      title: "Advanced Patterns",
      lessons: [
        {
          id: 7,
          title: "Advanced Spinning Techniques",
          duration: "12:45",
          completed: false,
          locked: false,
          current: true,
        },
        { id: 8, title: "Complex Transitions", duration: "16:30", completed: false, locked: false },
        { id: 9, title: "Performance Flow", duration: "18:45", completed: false, locked: true },
      ],
    },
  ],
}

export default function CourseDetail() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [expandedModules, setExpandedModules] = useState([1, 2, 3])
  const [notes, setNotes] = useState("")

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Course Playlist */}
        <div className="lg:w-80 bg-gray-900 border-r border-gray-800 lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold mb-2">{courseData.title}</h2>
            <p className="text-sm text-gray-400">by {courseData.instructor}</p>
            <div className="mt-4 bg-gray-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-1/3"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Progress: 33% Complete</p>
          </div>

          <div className="p-4">
            {courseData.modules.map((module) => (
              <Collapsible
                key={module.id}
                open={expandedModules.includes(module.id)}
                onOpenChange={() => toggleModule(module.id)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-800 rounded-lg transition-colors">
                  <span className="font-medium">{module.title}</span>
                  {expandedModules.includes(module.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="ml-4 mt-2 space-y-1">
                    {module.lessons.map((lesson) => (
                      <motion.div
                        key={lesson.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          lesson.current ? "bg-purple-600/20 border border-purple-500/30" : "hover:bg-gray-800"
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex-shrink-0">
                          {lesson.locked ? (
                            <Lock className="h-4 w-4 text-gray-500" />
                          ) : lesson.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${lesson.locked ? "text-gray-500" : "text-white"}`}
                          >
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">{lesson.duration}</span>
                          </div>
                        </div>

                        {lesson.current && <Play className="h-4 w-4 text-purple-400" />}
                      </motion.div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:overflow-y-auto">
          {/* Video Player */}
          <div className="relative bg-black">
            <div className="aspect-video relative">
              <img
                src={courseData.currentLesson.videoUrl || "/placeholder.svg"}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group">
                <Button
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 rounded-full p-4"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white ml-1" />}
                </Button>
              </div>

              {/* Video Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 bg-white/20 rounded-full h-1">
                    <div className="bg-purple-500 h-1 rounded-full w-1/3"></div>
                  </div>
                  <span className="text-sm text-white">4:20 / {courseData.currentLesson.duration}</span>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="p-6 space-y-6">
            {/* Lesson Header */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{courseData.currentLesson.title}</h1>
              <p className="text-gray-400">{courseData.currentLesson.description}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Notes Section */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    My Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Take notes while learning..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-32 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Button className="mt-3 bg-purple-600 hover:bg-purple-700">Save Notes</Button>
                </CardContent>
              </Card>

              {/* Resources Section */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {courseData.currentLesson.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium">{resource.name}</p>
                        <p className="text-sm text-gray-400">{resource.size}</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-gray-600">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Q&A Section */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Ask a Question
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Have a question about this lesson? Ask here..."
                  className="mb-3 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button className="bg-purple-600 hover:bg-purple-700">Post Question</Button>

                {/* Sample Discussion */}
                <div className="mt-6 space-y-4">
                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                        S
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Sarah M.</span>
                          <Badge variant="outline" className="text-xs border-gray-600">
                            Student
                          </Badge>
                          <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                        <p className="text-gray-300">
                          How do I maintain balance during the advanced spinning patterns?
                        </p>
                        <Button variant="ghost" size="sm" className="mt-2 text-purple-400 hover:text-purple-300">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
