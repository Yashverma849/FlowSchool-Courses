"use client"

import { useState } from "react"
import { ModernHeader } from "./components/modern-header"
import { ModernSidebar } from "./components/modern-sidebar"
import { ModernCourseCards } from "./components/modern-course-cards"
import { ModernCourseDetail } from "./components/modern-course-detail"
import { MyLearningPage } from "./components/my-learning-page"
import { SettingsPage } from "./components/settings-page"
import { CourseProvider } from "./contexts/course-context"

export default function FlowSchoolApp() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedCourse, setSelectedCourse] = useState(null)

  const handleCourseClick = (course) => {
    setSelectedCourse(course)
    setCurrentView("course-detail")
  }

  const handleBackClick = () => {
    setCurrentView("dashboard")
    setSelectedCourse(null)
  }

  const handleMyLearningClick = () => {
    setCurrentView("my-learning")
  }

  const handleSettingsClick = () => {
    setCurrentView("settings")
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "course-detail":
        return <ModernCourseDetail onBackClick={handleBackClick} course={selectedCourse} />
      case "my-learning":
        return <MyLearningPage onCourseClick={handleCourseClick} onBackClick={handleBackClick} />
      case "settings":
        return <SettingsPage onBackClick={handleBackClick} />
      default:
        return (
          <div className="flex flex-col lg:flex-row">
            <ModernSidebar />
            <div className="flex-1 lg:ml-80 lg:pt-6">
              <ModernCourseCards onCourseClick={handleCourseClick} />
            </div>
          </div>
        )
    }
  }

  return (
    <CourseProvider>
      <div className="min-h-screen bg-gray-950">
        <ModernHeader onMyLearningClick={handleMyLearningClick} onSettingsClick={handleSettingsClick} />
        {renderCurrentView()}
      </div>
    </CourseProvider>
  )
}
