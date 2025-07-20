"use client"

import { Clock, Users, Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthOverlay from "@/app/auth-overlay";

export function CourseCards({ courses }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  // Sort so FLOWCHAKRA TUTORIALS is always first
  const sortedCourses = [...courses].sort((a, b) => {
    if (a.title === "FLOWCHAKRA TUTORIALS") return -1;
    if (b.title === "FLOWCHAKRA TUTORIALS") return 1;
    return 0;
  });

  const handleCourseClick = (courseId) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    router.push(`/courses/${courseId}`);
  };

  return (
    <>
      <div className="flex-1 p-4 lg:p-6">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Flow Arts Courses
              </h1>
              <p className="text-gray-400 text-sm lg:text-base">
                Discover the art of movement, rhythm, and creative expression through our curated collection of courses
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-100">{courses.length}</span> courses found
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Filter:</span>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  All Courses
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedCourses.map((course) => (
            <Card
              key={course.id}
              className="group overflow-hidden border-0 bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-800"
            >
              <CardHeader className="p-0 relative overflow-hidden">
                <div className="relative">
                  <img
                    src={
                      course.title === "FLOWCHAKRA TUTORIALS"
                        ? "https://aiiqbixgloosjmxpejzd.supabase.co/storage/v1/object/public/course-thumbnails//flowchakra.jpg"
                        : course.image || "/placeholder.svg"
                    }
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={course.is_free ? "bg-green-500 text-white shadow-lg" : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"}
                    >
                      {course.is_free ? "Free" : course.price ? course.price : "Premium"}
                    </Badge>
                  </div>
                  {course.level && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gray-800/80 text-white shadow-lg text-xs font-semibold px-3 py-1 rounded-full">
                        {course.level}
                      </Badge>
                    </div>
                  )}
                  {/* Course Stats Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between text-white text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.students?.toLocaleString?.() ?? course.students}</span>
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
                    <h3 className="font-semibold text-lg text-gray-100 mb-2 group-hover:text-purple-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{course.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      by <span className="font-medium text-gray-300">{course.instructor}</span>
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{course.students?.toLocaleString?.() ?? course.students}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.tags && course.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-gray-600 text-gray-400 hover:border-purple-500"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {course.enrolled && course.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="font-medium text-purple-400">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2 bg-gray-800" />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  onClick={() => handleCourseClick(course.id)}
                  className={`w-full transition-all duration-300 ${
                    course.is_free
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                  }`}
                >
                  {course.is_free ? (
                    <>
                      Start Learning
                      <Play className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Enroll Now
                      <Play className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <AuthOverlay open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}