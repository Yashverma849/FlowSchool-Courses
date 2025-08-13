"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { User, Lock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import SiteHeader from "@/components/site-header"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    location: "",
    website: "",
    avatar: "",
  });
  // const [activeTab, setActiveTab] = useState("profile");
  // const [appPreferences, setAppPreferences] = useState({
  //   theme: "system",
  //   language: "english",
  //   timezone: "pacific_time",
  //   videoQuality: "auto",
  //   autoplayVideos: true,
  // });
  // const [privacySettings, setPrivacySettings] = useState({
  //   profileVisibility: "public",
  //   showLearningProgress: true,
  //   showCertificates: true,
  //   allowDirectMessages: true,
  // });
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const fileInputRef = useRef();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      setUser(data?.user || null);
      if (data?.user) {
        setProfile({
          fullName: data.user.user_metadata?.full_name || "",
          email: data.user.email || "",
          location: data.user.user_metadata?.location || "",
          website: data.user.user_metadata?.website || "",
          avatar: data.user.user_metadata?.avatar_url || "/placeholder-user.jpg",
        });
      }
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [id]: value }));
  };

  // const handleAppPreferencesChange = (id, value) => {
  //   setAppPreferences((prevPreferences) => ({
  //     ...prevPreferences,
  //     [id]: value,
  //   }))
  // }

  // const handlePrivacyChange = (id, value) => {
  //   setPrivacySettings((prevSettings) => ({
  //     ...prevSettings,
  //     [id]: value,
  //   }))
  // }

  const handlePasswordChange = (e) => {
    const { id, value } = e.target
    setPasswordFields((prevFields) => ({ ...prevFields, [id]: value }))
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`; // Do NOT include bucket name
    // Upload to Supabase Storage
    let { error: uploadError } = await supabase.storage
      .from('user-avatars')
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      console.error(uploadError);
      alert('Error uploading avatar!');
      setAvatarUploading(false);
      return;
    }
    // Get public URL
    const { data: publicData } = supabase
      .storage
      .from('user-avatars')
      .getPublicUrl(filePath);
    const publicURL = publicData?.publicUrl;
    // Update user_metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicURL }
    });
    if (updateError) {
      alert('Error updating profile!');
    } else {
      setProfile((prev) => ({ ...prev, avatar: publicURL }));
    }
    setAvatarUploading(false);
  };

  const handleSave = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profile.fullName,
        location: profile.location,
        website: profile.website,
        avatar_url: profile.avatar,
      }
    });
    if (error) {
      alert('Error updating profile!');
    } else {
      alert('Profile updated!');
      window.location.reload();
    }
  };

  const handleRemovePhoto = async () => {
    // Remove from storage (optional: only if you want to delete the file)
    if (profile.avatar && !profile.avatar.includes('/placeholder-user.jpg')) {
      // Extract the path after the bucket name
      const urlParts = profile.avatar.split('/user-avatars/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        await supabase.storage.from('user-avatars').remove([filePath]);
      }
    }
    // Set avatar to placeholder
    setProfile((prev) => ({ ...prev, avatar: "/placeholder-user.jpg" }));
    await supabase.auth.updateUser({ data: { avatar_url: "/placeholder-user.jpg" } });
  };

  // const handleSaveAppPreferences = () => {
  //   console.log("Saving app preferences:", appPreferences)
  //   // Implement save app preferences logic here
  // }

  // const handleSavePrivacySettings = () => {
  //   console.log("Saving privacy settings:", privacySettings)
  //   // Implement save privacy settings logic here
  // }

  const handleUpdatePassword = async () => {
    // Validate password fields
    if (!passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmNewPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (passwordFields.newPassword !== passwordFields.confirmNewPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    if (passwordFields.newPassword.length < 6) {
      alert("New password must be at least 6 characters long");
      return;
    }

    setPasswordUpdating(true);

    try {
      // First, verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordFields.currentPassword,
      });

      if (signInError) {
        alert("Current password is incorrect");
        setPasswordUpdating(false);
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordFields.newPassword,
      });

      if (updateError) {
        alert(`Error updating password: ${updateError.message}`);
        setPasswordUpdating(false);
        return;
      }

      // Clear the password fields
      setPasswordFields({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred while updating the password. Please try again.");
    } finally {
      setPasswordUpdating(false);
    }
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

      <div className="container mx-auto px-4 py-8">
        {/* Settings Header */}
        <div className="flex items-center justify-between w-full mb-6">
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

        {/* Main Content Area */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
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
                  <AvatarFallback>{profile.fullName ? profile.fullName.split(" ").map((n) => n[0]).join("") : "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="text-black" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={avatarUploading}>
                    {avatarUploading ? "Uploading..." : "Change Photo"}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <Button variant="ghost" className="text-red-400 hover:bg-transparent hover:text-red-500" onClick={handleRemovePhoto}>Remove Photo</Button>
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

              <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mb-12">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>

              {/* Account Security Section */}
              <Separator className="bg-gray-800 my-8" />
              
              <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                <Lock className="h-5 w-5" /> Account Security
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
              <Button 
                onClick={handleUpdatePassword} 
                disabled={passwordUpdating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordUpdating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
          </>

          {/* {activeTab === "preferences" && (
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
          )} */}

          {/* {activeTab === "privacy" && (
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
          )} */}

          {/* {activeTab === "account" && (
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
            </>
          )} */}
        </div>
      </div>
    </div>
  )
} 