"use client"

import { useState, useEffect } from 'react'
import CourseLayout from "../components/course-layout"
import LoadingPage from "./loading"

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loading for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingPage />
  }

  return <CourseLayout />
}