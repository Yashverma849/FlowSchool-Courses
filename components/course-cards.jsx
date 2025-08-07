"use client"

import { Clock, Users, Star, Play, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EnrollmentService } from "@/lib/enrollmentService";
import AuthOverlay from "@/app/auth-overlay";
import { useToast } from "@/hooks/use-toast";
import { useEnrollment } from "@/hooks/use-enrollment";

export function CourseCards({ courses, searchTerm, setSearchTerm }) {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState({});
  const { toast } = useToast();
  const { user, enrollments, checkMultipleEnrollments, enrollInCourse } = useEnrollment();

  // Razorpay script loader
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Fetch enrollment status for all courses
  useEffect(() => {
    if (user && courses.length > 0) {
      const courseIds = courses.map(course => course.id);
      checkMultipleEnrollments(courseIds);
    }
  }, [user, courses, checkMultipleEnrollments]);

  // Sort so FLOWCHAKRA TUTORIALS is always first
  const sortedCourses = [...courses].sort((a, b) => {
    if (a.title === "FLOWCHAKRA TUTORIALS") return -1;
    if (b.title === "FLOWCHAKRA TUTORIALS") return 1;
    return 0;
  });

  const handleCourseClick = async (course) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    // Check if user is enrolled
    const isEnrolled = enrollments[course.id];
    
    if (isEnrolled) {
      // User is enrolled, navigate to course
      router.push(`/courses/${course.id}`);
      return;
    }

    if (course.is_free) {
      setLoading(prev => ({ ...prev, [course.id]: true }));
      
      try {
        const result = await enrollInCourse(course.id);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: result.message,
            variant: "default",
          });
          
          // Navigate to course after successful enrollment
          router.push(`/courses/${course.id}`);
        }
      } catch (error) {
        toast({
          title: "Enrollment Failed",
          description: error.message || "Failed to enroll in course",
          variant: "destructive",
        });
      } finally {
        setLoading(prev => ({ ...prev, [course.id]: false }));
      }
    } else {
      // Paid course: Razorpay flow
      setLoading(prev => ({ ...prev, [course.id]: true }));
      try {
        // 1. Create Razorpay order
        const orderRes = await fetch('/api/razorpay/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, course_id: course.id })
        });
        const { order, error } = await orderRes.json();
        if (error || !order) throw new Error(error || 'Failed to create order');

        // 2. Open Razorpay Checkout
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: course.title,
          description: course.description || 'Course Purchase',
          order_id: order.id,
          handler: async function (response) {
            // 3. On payment success, verify and enroll
            // Get the user's access token
            const session = await supabase.auth.getSession();
            const access_token = session?.data?.session?.access_token;
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user.id,
                course_id: course.id,
                amount: order.amount / 100, // convert paise to INR
                access_token,
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast({
                title: 'Enrollment Successful',
                description: 'You have been enrolled in the course!',
                variant: 'default',
              });
              router.push(`/courses/${course.id}`);
            } else {
              toast({
                title: 'Payment Verification Failed',
                description: verifyData.error || 'Could not verify payment.',
                variant: 'destructive',
              });
            }
          },
          prefill: {
            email: user.email,
            name: user.full_name || '',
          },
          theme: { color: '#7c3aed' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        toast({
          title: 'Payment Error',
          description: error.message || 'Could not initiate payment.',
          variant: 'destructive',
        });
      } finally {
        setLoading(prev => ({ ...prev, [course.id]: false }));
      }
    }
  };

  return (
    <>
      <div className="flex-1 p-4 lg:p-6">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Start Your Own Flow Journey Today!
              </h1>
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
          <div className="flex justify-between items-center mt-4">
            <p className="text-base lg:text-lg text-gray-300 font-medium italic">
              Where movement becomes art, and rhythm flows through your soul ✨
            </p>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedCourses.map((course) => (
            <Card
              key={course.id}
              className="group overflow-hidden border-0 bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-800 flex flex-col h-full"
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
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="space-y-4 flex-1 flex flex-col">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-100 mb-2 group-hover:text-purple-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed min-h-[56px] sm:min-h-[48px] lg:min-h-[40px]">
                      {course.description}
                    </p>
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
                {/* Always render the action button in the footer for consistent layout */}
                <Button
                  onClick={() => handleCourseClick(course)}
                  disabled={loading[course.id]}
                  className={`w-full transition-all duration-300 ${
                    enrollments[course.id]
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                      : course.is_free
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                  }`}
                >
                  {loading[course.id] ? (
                    <>
                      Enrolling...
                      <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </>
                  ) : enrollments[course.id] ? (
                    <>
                      Continue Learning
                      <Play className="ml-2 h-4 w-4" />
                    </>
                  ) : course.is_free ? (
                    <>
                      Start Learning
                      <Play className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Enroll Now ₹1
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