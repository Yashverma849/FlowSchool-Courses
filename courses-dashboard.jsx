"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Clock, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Link from "next/link"

export default function CoursesDashboard({ courses }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={course.price === "Free" ? "secondary" : "default"}
                    className={course.price === "Free" ? "bg-green-600 text-white" : "bg-purple-600 text-white"}
                  >
                    {course.price}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {course.level}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                    <Users className="h-4 w-4 ml-2" />
                    <span>{course.students}</span>
                    <div className="flex items-center ml-auto">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1">{course.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                {course.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                by {course.instructor} • {course.lessons} lessons
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {course.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-gray-700 text-gray-400">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Link href={`/courses/${course.id}`} className="w-full">
                <Button
                  className={`w-full ${course.enrolled || course.isPlaylist ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"}`}
                >
                  {course.enrolled || course.isPlaylist ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </>
                  ) : (
                    "Enroll Now"
                  )}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}

      {courses.length === 0 && (
        <div className="text-center py-12 col-span-full">
          <div className="text-gray-400 text-lg">No courses found matching your criteria</div>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter settings</p>
        </div>
      )}
    </motion.div>
  )
}
