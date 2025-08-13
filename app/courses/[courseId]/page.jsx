"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star, Menu, Lock } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { EnrollmentService } from "@/lib/enrollmentService"
import { LessonProgressService } from "@/lib/lessonProgressService"
import SiteHeader from "@/components/site-header"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Circle, ChevronRight, ChevronLeft } from "lucide-react"

function CourseSidebar({ course, lessons, currentLesson, setCurrentLesson, lessonProgress, onMarkAsCompleted, updatingProgress }) {
  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex-shrink-0 h-[calc(100vh-64px)] sticky top-16 flex flex-col">
      {/* Fixed Header */}
      <div className="p-6 border-b border-gray-800 flex-shrink-0">
        <Link href="/my-learning" className="flex items-center text-gray-400 hover:text-purple-400 mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
        <h2 className="text-xl font-bold text-white">Course Content</h2>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <ul className="space-y-2">
        {lessons.map((lesson, idx) => {
          const isCompleted = lessonProgress[lesson.id];
          const isCurrent = currentLesson?.id === lesson.id;
          
          return (
            <li
              key={lesson.id}
              className={`p-3 rounded-lg transition-colors ${
                isCurrent 
                  ? "bg-purple-700/30 text-purple-300" 
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => setCurrentLesson(lesson)}
                >
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{idx + 1}. {lesson.title}</span>
                      {lesson.duration && (
                        <span className="text-xs text-gray-400 mt-1">{lesson.duration}</span>
                      )}
                    </div>
                  </div>
                </div>
                                 {isCompleted && (
                   <div className="ml-2 px-2 py-1 text-xs text-green-400">
                     ✓ Completed
                   </div>
                 )}
              </div>
            </li>
          );
        })}
              </ul>
      </div>
    </div>
  )
}

export default function CourseContentPage({ params }) {
  const { courseId } = params;
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [lessonProgress, setLessonProgress] = useState({});
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const { toast } = useToast();

  // Calculate progress percentage from lesson progress
  const calculateProgressPercentage = () => {
    if (!lessons || lessons.length === 0) return 0;
    
    const completedLessons = Object.values(lessonProgress).filter(completed => completed).length;
    return Math.round((completedLessons / lessons.length) * 100);
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

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

  // Check enrollment status and load lesson progress
  useEffect(() => {
    const checkEnrollmentAndProgress = async () => {
      if (!user || !courseId) return;
      
      try {
        const enrollmentData = await EnrollmentService.getEnrollmentProgress(user.id, courseId);
        if (enrollmentData) {
          setEnrollment(enrollmentData);
          setIsEnrolled(true);
        }

        // Load lesson progress
        const progressData = await LessonProgressService.getLessonProgress(user.id, courseId);
        const progressMap = {};
        progressData.forEach(progress => {
          progressMap[progress.lesson_id] = progress.is_completed;
        });
        setLessonProgress(progressMap);
      } catch (error) {
        console.error('Error checking enrollment and progress:', error);
      }
    };

    checkEnrollmentAndProgress();
  }, [user, courseId]);

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!course) return <div className="p-8 text-red-400">Course not found</div>;

  // Check if user can access the course
  const canAccessCourse = course.is_free || isEnrolled;
  const showEnrollmentPrompt = !isEnrolled && course.is_free && user;

  // Handle enrollment
  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to enroll in this course.",
        variant: "destructive",
      });
      return;
    }

    setEnrolling(true);
    try {
      const result = await EnrollmentService.enrollUser(user.id, courseId);
      
      if (result.success) {
        setIsEnrolled(true);
        setEnrollment(result.data);
        toast({
          title: "Success!",
          description: result.message,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  // Handle marking lesson as completed
  const handleMarkAsCompleted = async (lessonId) => {
    if (!user || !isEnrolled) {
      toast({
        title: "Enrollment Required",
        description: "Please enroll in this course to mark lessons as completed.",
        variant: "destructive",
      });
      return;
    }

    // Don't allow marking already completed lessons
    if (lessonProgress[lessonId]) {
      toast({
        title: "Already Completed",
        description: "This lesson has already been completed.",
        variant: "default",
      });
      return;
    }

    setUpdatingProgress(true);
    try {
      // Mark as completed
      await LessonProgressService.markLessonAsCompleted(user.id, lessonId, courseId);
      
      // Refresh lesson progress data from database
      const progressData = await LessonProgressService.getLessonProgress(user.id, courseId);
      const progressMap = {};
      progressData.forEach(progress => {
        progressMap[progress.lesson_id] = progress.is_completed;
      });
      setLessonProgress(progressMap);
      
      // Find the current lesson index
      const currentLessonIndex = lessons.findIndex(lesson => lesson.id === lessonId);
      
      // Check if there's a next lesson
      if (currentLessonIndex < lessons.length - 1) {
        const nextLesson = lessons[currentLessonIndex + 1];
        setCurrentLesson(nextLesson);
        
        toast({
          title: "Lesson Completed!",
          description: `Moving to next lesson: ${nextLesson.title}`,
        });
      } else {
        // This is the last lesson
        toast({
          title: "Course Completed! 🎉",
          description: "Congratulations! You've completed all lessons in this course.",
        });
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update lesson progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingProgress(false);
    }
  };

  // Navigation functions
  const goToNextLesson = () => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === currentLesson?.id);
    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1]);
    }
  };

  const goToPreviousLesson = () => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === currentLesson?.id);
    if (currentIndex > 0) {
      setCurrentLesson(lessons[currentIndex - 1]);
    }
  };

  const canGoToNext = () => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === currentLesson?.id);
    return currentIndex < lessons.length - 1;
  };

  const canGoToPrevious = () => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === currentLesson?.id);
    return currentIndex > 0;
  };

  // Sidebar toggle for mobile (icon only)
  const sidebarToggle = (
    <Sheet>
      <SheetTrigger asChild>
      <button className="flex items-center justify-center p-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700">
          <Menu className="h-5 w-5" />
      </button>
      </SheetTrigger>
    <SheetContent side="left" className="w-80 p-0 bg-gray-900 border-r border-gray-800">
      <CourseSidebar 
        course={course} 
        lessons={lessons} 
        currentLesson={currentLesson} 
        setCurrentLesson={setCurrentLesson}
        lessonProgress={lessonProgress}
        onMarkAsCompleted={handleMarkAsCompleted}
        updatingProgress={updatingProgress}
      />
      </SheetContent>
    </Sheet>
  );

  // If user is not enrolled and course is not free, show access denied
  if (!canAccessCourse) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <SiteHeader sidebarToggle={sidebarToggle} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Course Access Required</h1>
            <p className="text-gray-400 mb-6">
              You need to enroll in this course to access its content.
            </p>
            <Button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <SiteHeader sidebarToggle={sidebarToggle} />
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <CourseSidebar 
          course={course} 
          lessons={lessons} 
          currentLesson={currentLesson} 
          setCurrentLesson={setCurrentLesson}
          lessonProgress={lessonProgress}
          onMarkAsCompleted={handleMarkAsCompleted}
          updatingProgress={updatingProgress}
        />
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
              {showEnrollmentPrompt ? (
                <div className="text-center">
                  <p className="text-gray-400 mb-2">Ready to start learning?</p>
                  <Button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    {enrolling ? (
                      <>
                        Enrolling...
                        <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </>
                    ) : (
                      "Enroll Now"
                    )}
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-lg font-semibold text-purple-400">
                    {calculateProgressPercentage()}% Complete 
                    <span className="text-gray-500 text-sm">Keep going!</span>
                  </span>
                  <div className="w-48">
                    <Progress value={calculateProgressPercentage()} />
                  </div>
                </>
              )}
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentLesson?.title}</h2>
                {currentLesson?.duration && <div className="text-sm text-gray-400 mb-2">Duration: {currentLesson.duration}</div>}
              </div>
                             {isEnrolled && currentLesson && !lessonProgress[currentLesson.id] && (
                 <Button
                   onClick={() => handleMarkAsCompleted(currentLesson.id)}
                   disabled={updatingProgress}
                   className="bg-green-600 hover:bg-green-700"
                 >
                   {updatingProgress ? (
                     <div className="flex items-center gap-2">
                       <div className="h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
                       Updating...
                     </div>
                   ) : (
                     <div className="flex items-center gap-2">
                       <Circle className="h-4 w-4" />
                       Mark as Completed
                     </div>
                   )}
                 </Button>
               )}
            </div>
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

            {/* Navigation Buttons */}
            {isEnrolled && lessons.length > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                <Button
                  onClick={goToPreviousLesson}
                  disabled={!canGoToPrevious()}
                  className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous Lesson
                </Button>

                <div className="text-sm text-gray-400">
                  {lessons.findIndex(lesson => lesson.id === currentLesson?.id) + 1} of {lessons.length}
                </div>

                <Button
                  onClick={goToNextLesson}
                  disabled={!canGoToNext()}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Lesson
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 