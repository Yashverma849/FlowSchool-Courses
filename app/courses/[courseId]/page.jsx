"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Star, Menu } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import SiteHeader from "@/components/site-header"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

function CourseSidebar({ course, lessons, currentLesson, setCurrentLesson }) {
  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex-shrink-0 p-6 overflow-y-auto h-full">
          <Link href="/" className="flex items-center text-gray-400 hover:text-purple-400 mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
      <h2 className="text-xl font-bold text-white mb-4">Course Content</h2>
      <ul className="space-y-2">
        {lessons.map((lesson, idx) => (
          <li
                key={lesson.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${currentLesson?.id === lesson.id ? "bg-purple-700/30 text-purple-300" : "hover:bg-gray-800 text-gray-300"}`}
                onClick={() => setCurrentLesson(lesson)}
              >
            <div className="flex flex-col">
              <span className="font-medium">{idx + 1}. {lesson.title}</span>
              {lesson.duration && (
                <span className="text-xs text-gray-400 mt-1">{lesson.duration}</span>
                )}
              </div>
          </li>
            ))}
      </ul>
        </div>
  )
}

export default function CourseContentPage({ params }) {
  const { courseId } = params;
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    async function fetchCourseAndLessons() {
      setLoading(true);
      // Fetch course
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      // Fetch lessons
      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true });
      setCourse(courseData);
      setLessons(lessonsData || []);
      setCurrentLesson((lessonsData && lessonsData[0]) || null);
      setLoading(false);
    }
    if (courseId) fetchCourseAndLessons();
  }, [courseId]);

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!course) return <div className="p-8 text-red-400">Course not found</div>;

  // Sidebar toggle for mobile (icon only)
    const sidebarToggle = (
      <Sheet>
        <SheetTrigger asChild>
        <button className="flex items-center justify-center p-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700">
            <Menu className="h-5 w-5" />
        </button>
        </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 bg-gray-900 border-r border-gray-800">
        <CourseSidebar course={course} lessons={lessons} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} />
        </SheetContent>
      </Sheet>
    );

    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <SiteHeader sidebarToggle={sidebarToggle} />
        <div className="flex flex-1">
          {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <CourseSidebar course={course} lessons={lessons} currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} />
                  </div>
        <div className="flex-1 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">{course.title}</h1>
              <div className="flex items-center gap-4 text-gray-400 mb-2">
                {course.instructor && <span>by {course.instructor}</span>}
                {course.rating && <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {course.rating}</span>}
                {course.students !== undefined && <span>{course.students} students</span>}
              </div>
              <p className="text-gray-400 max-w-2xl mb-2">{course.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-lg font-semibold text-purple-400">0% Complete <span className="text-gray-500 text-sm">Keep going!</span></span>
              <div className="w-48"><Progress value={0} /></div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            {console.log('DEBUG currentLesson:', currentLesson)}
            {currentLesson?.video_url && (
              <div className="aspect-video mb-4 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                  src={currentLesson.video_url}
                  title={currentLesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                  className="w-full h-full"
              ></iframe>
            </div>
            )}
            <h2 className="text-2xl font-bold mb-2">{currentLesson?.title}</h2>
            {currentLesson?.duration && <div className="text-sm text-gray-400 mb-2">Duration: {currentLesson.duration}</div>}
            <div className="mb-4">{currentLesson?.description}</div>
            <Tabs defaultValue="overview" className="w-full mt-6 mb-6">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-b border-gray-700 rounded-none">
                <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Overview</TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Notes</TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Resources</TabsTrigger>
                <TabsTrigger value="community" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 rounded-none">Community</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg shadow mb-4">
                <p className="text-gray-400 mb-4">{course.description}</p>
                <h3 className="text-xl font-bold text-gray-100 mb-3">What you'll learn in this course:</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {Array.isArray(course.learnings) && course.learnings.length > 0 ? (
                    course.learnings.map((item, i) => <li key={i}>{item}</li>)
                  ) : (
                    <>
                      <li>Basic wrist movement techniques</li>
                      <li>Hand movement for juggling</li>
                      <li>Intermediate and advanced flow moves</li>
                      <li>Exploring vertical planes and more</li>
                    </>
                  )}
                </ul>
              </TabsContent>
              <TabsContent value="notes" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg shadow mb-4">
                <h3 className="text-xl font-semibold text-gray-300">Notes</h3>
                <p className="text-gray-400 mt-2">This section is for your personal notes on the course content.</p>
              </TabsContent>
              <TabsContent value="resources" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg shadow mb-4">
                <h3 className="text-xl font-semibold text-gray-300">Resources</h3>
                <p className="text-gray-400 mt-2">Here you'll find additional resources for this course.</p>
              </TabsContent>
              <TabsContent value="community" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg shadow mb-4">
                <h3 className="text-xl font-semibold text-gray-300">Community</h3>
                <p className="text-gray-400 mt-2">Engage with other learners and ask questions here!</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
} 