"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Bell, Settings as SettingsIcon, Shield, Lock, Save, ArrowLeft, Mail, Smartphone, Palette, Volume2, Eye, ScrollText, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import SiteHeader from "@/components/site-header"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "Alex Johnson",
    email: "alex@flowschool.com",
    location: "San Francisco, CA",
    website: "alexflow.com",
    bio: "Passionate flow artist exploring the intersection of movement and mindfulness.",
    avatar: "/placeholder-user.jpg",
  })
  const [activeTab, setActiveTab] = useState("profile")
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    newCourses: false,
    communityMessages: true,
    weeklyDigest: true,
  })
  const [appPreferences, setAppPreferences] = useState({
    theme: "system",
    language: "english",
    timezone: "pacific_time",
    videoQuality: "auto",
    autoplayVideos: true,
  })
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showLearningProgress: true,
    showCertificates: true,
    allowDirectMessages: true,
  })
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setProfile((prevProfile) => ({ ...prevProfile, [id]: value }))
  }

  const handleNotificationChange = (id) => {
    setNotificationSettings((prevSettings) => ({
      ...prevSettings,
      [id]: !prevSettings[id],
    }))
  }

  const handleAppPreferencesChange = (id, value) => {
    setAppPreferences((prevPreferences) => ({
      ...prevPreferences,
      [id]: value,
    }))
  }

  const handlePrivacyChange = (id, value) => {
    setPrivacySettings((prevSettings) => ({
      ...prevSettings,
      [id]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { id, value } = e.target
    setPasswordFields((prevFields) => ({ ...prevFields, [id]: value }))
  }

  const handleSave = () => {
    console.log("Saving profile:", profile)
    // Implement save logic here, e.g., API call
  }

  const handleSaveNotifications = () => {
    console.log("Saving notification settings:", notificationSettings)
    // Implement save notification settings logic here
  }

  const handleSaveAppPreferences = () => {
    console.log("Saving app preferences:", appPreferences)
    // Implement save app preferences logic here
  }

  const handleSavePrivacySettings = () => {
    console.log("Saving privacy settings:", privacySettings)
    // Implement save privacy settings logic here
  }

  const handleUpdatePassword = () => {
    console.log("Updating password:", passwordFields)
    // Implement password update logic here
  }

  const handleDeleteAccount = () => {
    console.log("Deleting account...")
    // Implement account deletion logic here
  }

  const sidebarToggle = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-gray-900/80 backdrop-blur-sm border-gray-700 text-gray-100 hover:bg-gray-800 w-10 h-10 p-0 flex items-center justify-center">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open Settings Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-gray-900 border-gray-800">
        {/* Place sidebar content here if/when needed */}
        <div className="p-6">Sidebar content (settings navigation, etc.)</div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <SiteHeader sidebarToggle={sidebarToggle} />

      <div className="container mx-auto px-4 py-8 flex flex-1 gap-8">
        {/* Settings Header */}
        <div className="flex items-center justify-between w-full lg:hidden mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-400 mt-2">Manage your account preferences and privacy settings</p>
          </div>
          <Link href="/">
            <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">
              Back to Courses
            </Button>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0 bg-gray-900 border border-gray-800 rounded-lg p-6 hidden lg:block">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start text-left gap-2 ${activeTab === "profile" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-4 w-4" /> Profile
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-left gap-2 ${activeTab === "notifications" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="h-4 w-4" /> Notifications
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-left gap-2 ${activeTab === "preferences" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
              onClick={() => setActiveTab("preferences")}
            >
              <SettingsIcon className="h-4 w-4" /> Preferences
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-left gap-2 ${activeTab === "privacy" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
              onClick={() => setActiveTab("privacy")}
            >
              <Shield className="h-4 w-4" /> Privacy
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-left gap-2 ${activeTab === "account" ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-800"}`}
              onClick={() => setActiveTab("account")}
            >
              <Lock className="h-4 w-4" /> Account
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-6">
          {activeTab === "profile" && (
            <>
              <div className="flex justify-end mb-4">
                <Link href="/">
                  <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">
                    Back to Courses
                  </Button>
                </Link>
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Profile Information</h3>
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="secondary" className="bg-gray-700 text-white hover:bg-gray-600 mr-2">Change Photo</Button>
                  <Button variant="ghost" className="text-red-400 hover:bg-transparent hover:text-red-500">Remove Photo</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <Input id="fullName" value={profile.fullName} onChange={handleChange} className="bg-gray-800 border-gray-700 text-white" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                  <Input id="email" value={profile.email} onChange={handleChange} className="bg-gray-800 border-gray-700 text-white" disabled />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                  <Input id="location" value={profile.location} onChange={handleChange} className="bg-gray-800 border-gray-700 text-white" />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-400 mb-1">Website</label>
                  <Input id="website" value={profile.website} onChange={handleChange} className="bg-gray-800 border-gray-700 text-white" />
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                <Textarea id="bio" value={profile.bio} onChange={handleChange} rows={4} className="bg-gray-800 border-gray-700 text-white" />
              </div>

              <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <div className="flex justify-end mb-4">
                <Link href="/">
                  <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">
                    Back to Courses
                  </Button>
                </Link>
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-6">Notification Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Mail className="h-6 w-6 text-gray-400" />
                    <div>
                      <h4 className="text-base font-medium text-gray-200">Email Notifications</h4>
                      <p className="text-sm text-gray-400">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationChange("emailNotifications")}
                    id="emailNotifications"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Smartphone className="h-6 w-6 text-gray-400" />
                    <div>
                      <h4 className="text-base font-medium text-gray-200">Push Notifications</h4>
                      <p className="text-sm text-gray-400">Receive push notifications on your device</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={() => handleNotificationChange("pushNotifications")}
                    id="pushNotifications"
                  />
                </div>

                <div className="h-px bg-gray-800 my-6" /> {/* Divider */}

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-200">Course Updates</h4>
                    <p className="text-sm text-gray-400">New lessons and course announcements</p>
                  </div>
                  <Switch
                    checked={notificationSettings.courseUpdates}
                    onCheckedChange={() => handleNotificationChange("courseUpdates")}
                    id="courseUpdates"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-200">New Courses</h4>
                    <p className="text-sm text-gray-400">Notifications about new course releases</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newCourses}
                    onCheckedChange={() => handleNotificationChange("newCourses")}
                    id="newCourses"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-200">Community Messages</h4>
                    <p className="text-sm text-gray-400">Messages and replies in course discussions</p>
                  </div>
                  <Switch
                    checked={notificationSettings.communityMessages}
                    onCheckedChange={() => handleNotificationChange("communityMessages")}
                    id="communityMessages"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-200">Weekly Digest</h4>
                    <p className="text-sm text-gray-400">Weekly summary of your learning progress</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={() => handleNotificationChange("weeklyDigest")}
                    id="weeklyDigest"
                  />
                </div>
              </div>
              <Button onClick={handleSaveNotifications} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mt-8">
                <Save className="h-4 w-4 mr-2" /> Save Preferences
              </Button>
            </>
          )}

          {activeTab === "preferences" && (
            <>
              <div className="flex justify-end mb-4">
                <Link href="/">
                  <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">
                    Back to Courses
                  </Button>
                </Link>
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                <Palette className="h-5 w-5" /> App Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-400 mb-1">Theme</label>
                  <Select value={appPreferences.theme} onValueChange={(value) => handleAppPreferencesChange("theme", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-400 mb-1">Language</label>
                  <Select value={appPreferences.language} onValueChange={(value) => handleAppPreferencesChange("language", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-400 mb-1">Timezone</label>
                  <Select value={appPreferences.timezone} onValueChange={(value) => handleAppPreferencesChange("timezone", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select a timezone" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="pacific_time">Pacific Time (PT)</SelectItem>
                      <SelectItem value="eastern_time">Eastern Time (ET)</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="videoQuality" className="block text-sm font-medium text-gray-400 mb-1">Video Quality</label>
                  <Select value={appPreferences.videoQuality} onValueChange={(value) => handleAppPreferencesChange("videoQuality", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select video quality" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="480p">480p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Volume2 className="h-6 w-6 text-gray-400" />
                  <div>
                    <h4 className="text-base font-medium text-gray-200">Autoplay Videos</h4>
                    <p className="text-sm text-gray-400">Automatically play next lesson</p>
                  </div>
                </div>
                <Switch
                  checked={appPreferences.autoplayVideos}
                  onCheckedChange={(checked) => handleAppPreferencesChange("autoplayVideos", checked)}
                  id="autoplayVideos"
                />
              </div>

              <Button onClick={handleSaveAppPreferences} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Save className="h-4 w-4 mr-2" /> Save Preferences
              </Button>
            </>
          )}

          {activeTab === "privacy" && (
            <>
              <div className="flex justify-end mb-4">
                <Link href="/">
                  <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">
                    Back to Courses
                  </Button>
                </Link>
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5" /> Privacy & Security
              </h3>
              <div className="mb-6">
                <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-400 mb-1">Profile Visibility</label>
                <Select value={privacySettings.profileVisibility} onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                    <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                    <SelectItem value="friends">Friends Only - Only your connections can see your profile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Eye className="h-6 w-6 text-gray-400" />
                    <div>
                      <h4 className="text-base font-medium text-gray-200">Show Learning Progress</h4>
                      <p className="text-sm text-gray-400">Display your course progress on your profile</p>
                    </div>
                  </div>
                  <Switch
                    checked={privacySettings.showLearningProgress}
                    onCheckedChange={(checked) => handlePrivacyChange("showLearningProgress", checked)}
                    id="showLearningProgress"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ScrollText className="h-6 w-6 text-gray-400" />
                    <div>
                      <h4 className="text-base font-medium text-gray-200">Show Certificates</h4>
                      <p className="text-sm text-gray-400">Display earned certificates on your profile</p>
                    </div>
                  </div>
                  <Switch
                    checked={privacySettings.showCertificates}
                    onCheckedChange={(checked) => handlePrivacyChange("showCertificates", checked)}
                    id="showCertificates"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-200">Allow Direct Messages</h4>
                    <p className="text-sm text-gray-400">Let other students send you messages</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowDirectMessages}
                    onCheckedChange={(checked) => handlePrivacyChange("allowDirectMessages", checked)}
                    id="allowDirectMessages"
                  />
                </div>
              </div>

              <Button onClick={handleSavePrivacySettings} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Save className="h-4 w-4 mr-2" /> Save Privacy Settings
              </Button>
            </>
          )}

          {activeTab === "account" && (
            <>
              <div className="flex justify-end mb-4">
                <Link href="/">
                  <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">
                    Back to Courses
                  </Button>
                </Link>
              </div>
              <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                <Lock className="h-5 w-5" /> Change Password
              </h3>
              <div className="grid grid-cols-1 gap-6 mb-8">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                  <Input id="currentPassword" type="password" value={passwordFields.currentPassword} onChange={handlePasswordChange} className="bg-gray-800 border-gray-700 text-white" />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                  <Input id="newPassword" type="password" value={passwordFields.newPassword} onChange={handlePasswordChange} className="bg-gray-800 border-gray-700 text-white" />
                </div>
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                  <Input id="confirmNewPassword" type="password" value={passwordFields.confirmNewPassword} onChange={handlePasswordChange} className="bg-gray-800 border-gray-700 text-white" />
                </div>
              </div>
              <Button onClick={handleUpdatePassword} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mb-12">
                Update Password
              </Button>

              <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                <Trash2 className="h-5 w-5" /> Delete Account
              </h3>
              <p className="text-gray-400 mb-6">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button onClick={handleDeleteAccount} variant="destructive" className="bg-red-600 hover:bg-red-700">
                <Trash2 className="h-4 w-4 mr-2" /> Delete Account
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 